import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { HACKATHON, PROJECT_FIELDS } from '../../shared/hackathon.js'

const derive = promisify(scrypt)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const text = (value) => typeof value === 'string' ? value.trim() : ''
const email = (value) => text(value).toLowerCase()
const hash = (value) => createHash('sha256').update(value).digest('hex')
const token = () => randomBytes(32).toString('base64url')
const tokenPattern = /^[A-Za-z0-9_-]{43}$/
export const SESSION_SECONDS = 8 * 60 * 60
const fail = (status, message, code) => { throw Object.assign(new Error(message), { status, code }) }
const one = async (db, sql, params = []) => (await db.query(sql, params)).rows[0]
const bounded = (value, label, max, min = 1) => {
  const result = text(value)
  if (result.length < min || result.length > max) fail(400, `Enter ${label} (${min}–${max} characters).`)
  return result
}

async function passwordHash(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) fail(400, 'Use a password with 12–128 characters.')
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${(await derive(password, salt, 64)).toString('hex')}`
}

async function matches(password, stored) {
  const [salt, digest] = (stored || `${'0'.repeat(32)}:${'0'.repeat(128)}`).split(':')
  const calculated = await derive(password, salt, 64)
  return timingSafeEqual(calculated, Buffer.from(digest, 'hex')) && Boolean(stored)
}

export function normalizeTeam(input) {
  const name = bounded(input.name, 'a team name', 70, 2)
  const track = text(input.track)
  if (!HACKATHON.tracks.some((item) => item.id === track)) fail(400, 'Choose a track.')
  if (!Array.isArray(input.members) || input.members.length < HACKATHON.minTeam || input.members.length > HACKATHON.maxTeam) fail(400, `Register ${HACKATHON.minTeam}–${HACKATHON.maxTeam} members.`)
  if (input.consent !== true) fail(400, 'Confirm your team agreed to share its registration details.')
  const members = input.members.map((member) => {
    const address = email(member?.email)
    if (address.length > 150 || !emailPattern.test(address)) fail(400, 'Enter a valid email address for each member.')
    const year = text(member?.year)
    if (!['1', '2', '3', '4', '5', 'PG'].includes(year)) fail(400, 'Choose a study year for each member.')
    return { name: bounded(member?.name, 'a member’s name', 100, 2), email: address, college: bounded(member?.college, 'a college name', 150, 2), year }
  })
  if (new Set(members.map((member) => member.email)).size !== members.length) fail(400, 'Use a different email for each team member.')
  return { name, track, members }
}

export function normalizeProject(input, final = false) {
  const result = {}
  for (const field of PROJECT_FIELDS) {
    const value = text(input?.[field.key])
    if (value.length > field.max || (final && !value)) fail(400, `${field.label}: ${final && !value ? 'required before final submission.' : `use at most ${field.max} characters.`}`)
    if (field.url && value) {
      let url
      try { url = new URL(value) } catch { fail(400, `${field.label} must be a valid HTTPS link.`) }
      if (url.protocol !== 'https:' || url.username || url.password) fail(400, `${field.label} must be a valid HTTPS link.`)
      if (field.key === 'repository' && (url.hostname !== 'github.com' || url.pathname.split('/').filter(Boolean).length < 2)) fail(400, 'Enter a GitHub repository link.')
    }
    result[field.key] = value
  }
  return result
}

async function activity(db, team, member, action) {
  await db.query('INSERT INTO hack_activity (team_id, member_id, action) VALUES ($1,$2,$3)', [team, member, action])
}

async function issueSession(db, memberId) {
  const session = token()
  await db.query('INSERT INTO hack_sessions (digest, member_id, expires_at) VALUES ($1,$2,$3)', [hash(session), memberId, new Date(Date.now() + SESSION_SECONDS * 1000)])
  return session
}

export async function throttle(db, action, identity, limit, minutes) {
  const now = Date.now(), duration = minutes * 60000
  const bucket = hash(`${action}:${identity}:${Math.floor(now / duration)}`)
  const result = await one(db, `INSERT INTO hack_throttle (bucket,attempts,expires_at) VALUES ($1,1,$2)
    ON CONFLICT (bucket) DO UPDATE SET attempts = hack_throttle.attempts + 1 RETURNING attempts`, [bucket, new Date(Math.ceil((now + 1) / duration) * duration)])
  if (result.attempts > limit) fail(429, 'Too many attempts. Please wait and try again.', 'RATE_LIMITED')
}

export async function register(db, input) {
  const team = normalizeTeam(input)
  const captainHash = await passwordHash(input.password)
  const id = randomUUID(), code = `BW-${randomBytes(5).toString('hex').toUpperCase()}`
  const invites = []
  try {
    const session = await db.transaction(async (tx) => {
      await tx.query('INSERT INTO hack_teams (id,code,name,track) VALUES ($1,$2,$3,$4)', [id, code, team.name, team.track])
      await tx.query('INSERT INTO hack_projects (team_id) VALUES ($1)', [id])
      let captainId
      for (const [index, member] of team.members.entries()) {
        const memberId = randomUUID()
        const invite = index ? token() : null
        if (!index) captainId = memberId
        await tx.query(`INSERT INTO hack_members (id,team_id,name,email,college,year,role,password_hash,invite_hash,invite_until)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [memberId, id, member.name, member.email, member.college, member.year, index ? 'member' : 'captain', index ? null : captainHash, invite ? hash(invite) : null, invite ? new Date(Date.now() + 7 * 86400000) : null])
        if (invite) invites.push({ memberId, name: member.name, token: invite })
      }
      await activity(tx, id, captainId, 'team_registered')
      return issueSession(tx, captainId)
    })
    return { session, teamCode: code, invites }
  } catch (error) {
    if (error.code === '23505') fail(409, 'An email is already registered. Each participant can join only one team.', 'ALREADY_REGISTERED')
    throw error
  }
}

export async function activate(db, input) {
  if (typeof input.token !== 'string' || !tokenPattern.test(input.token)) fail(400, 'This invitation is invalid or expired.')
  const digest = await passwordHash(input.password)
  return db.transaction(async (tx) => {
    const member = await one(tx, `UPDATE hack_members SET password_hash=$1, invite_hash=NULL, invite_until=NULL
      WHERE invite_hash=$2 AND invite_until>now() AND password_hash IS NULL RETURNING id,team_id`, [digest, hash(input.token)])
    if (!member) fail(400, 'This invitation is invalid, expired or already used.')
    await activity(tx, member.team_id, member.id, 'member_activated')
    return issueSession(tx, member.id)
  })
}

export async function login(db, input) {
  const code = text(input.teamCode).toUpperCase(), address = email(input.email)
  if (code.length > 32 || address.length > 150 || typeof input.password !== 'string' || input.password.length < 1 || input.password.length > 128) fail(401, 'Team ID, email or password is incorrect.')
  const member = await one(db, `SELECT m.id,m.team_id,m.password_hash FROM hack_members m JOIN hack_teams t ON t.id=m.team_id
    WHERE t.code=$1 AND m.email=$2`, [code, address])
  if (!await matches(input.password, member?.password_hash)) fail(401, 'Team ID, email or password is incorrect.')
  return db.transaction(async (tx) => {
    await activity(tx, member.team_id, member.id, 'member_signed_in')
    return issueSession(tx, member.id)
  })
}

export async function currentMember(db, session) {
  if (!session || !tokenPattern.test(session)) fail(401, 'Sign in to open your team workspace.')
  const member = await one(db, `SELECT m.id,m.team_id,m.name,m.role FROM hack_sessions s JOIN hack_members m ON m.id=s.member_id
    WHERE s.digest=$1 AND s.expires_at>now()`, [hash(session)])
  if (!member) fail(401, 'Your session expired. Sign in again.')
  return member
}

export async function logout(db, session) {
  if (session && tokenPattern.test(session)) await db.query('DELETE FROM hack_sessions WHERE digest=$1', [hash(session)])
}

export async function workspace(db, member) {
  const team = await one(db, 'SELECT code,name,track FROM hack_teams WHERE id=$1', [member.team_id])
  const roster = (await db.query(`SELECT id,name,college,year,role,(password_hash IS NOT NULL) AS active FROM hack_members
    WHERE team_id=$1 ORDER BY role,name`, [member.team_id])).rows
  const project = await one(db, 'SELECT payload,revision,updated_at,submitted_at FROM hack_projects WHERE team_id=$1', [member.team_id])
  const events = (await db.query(`SELECT a.id,a.action,a.created_at,m.name FROM hack_activity a LEFT JOIN hack_members m ON m.id=a.member_id
    WHERE a.team_id=$1 ORDER BY a.id DESC LIMIT 16`, [member.team_id])).rows
  return { team, roster, project, events, member: { name: member.name, role: member.role, id: member.id } }
}

export async function rotateInvite(db, member, memberId) {
  if (member.role !== 'captain') fail(403, 'Only the captain can create invitations.')
  return db.transaction(async (tx) => {
    const invite = token()
    const target = await one(tx, `UPDATE hack_members SET invite_hash=$1,invite_until=$2 WHERE id=$3 AND team_id=$4
      AND password_hash IS NULL RETURNING id,name`, [hash(invite), new Date(Date.now() + 7 * 86400000), text(memberId), member.team_id])
    if (!target) fail(404, 'This member cannot be invited.')
    await activity(tx, member.team_id, member.id, 'invite_reissued')
    return { memberId: target.id, name: target.name, token: invite }
  })
}

export async function saveProject(db, member, input, final, deadline) {
  if (final && member.role !== 'captain') fail(403, 'Only the captain can submit the final project.')
  if (!Number.isInteger(input.revision) || input.revision < 0) fail(400, 'Reload the workspace before editing.')
  const payload = normalizeProject(input.project, final)
  return db.transaction(async (tx) => {
    const project = await one(tx, `UPDATE hack_projects SET payload=$1,revision=revision+1,updated_at=now(),
      submitted_at=CASE WHEN $2::boolean THEN now() ELSE NULL END
      WHERE team_id=$3 AND revision=$4 AND submitted_at IS NULL AND now() < $5::timestamptz
      RETURNING payload,revision,updated_at,submitted_at`, [JSON.stringify(payload), final, member.team_id, input.revision, deadline])
    if (!project) fail(409, 'The draft changed, was submitted, or the submission window closed. Reload the workspace.', 'PROJECT_CONFLICT')
    await activity(tx, member.team_id, member.id, final ? 'project_submitted' : 'draft_saved')
    return project
  })
}
