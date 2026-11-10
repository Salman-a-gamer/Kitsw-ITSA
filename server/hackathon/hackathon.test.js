import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { once } from 'node:events'
import test from 'node:test'
import { PGlite } from '@electric-sql/pglite'
import { createHackathonApi, deployedSettings } from './api.js'

const captainPassword = 'Captain test password'
const memberPassword = 'Member test password'
const registration = (key, name) => ({
  name, track: 'applied-ai', consent: true, password: captainPassword,
  members: [
    { name: 'Test Captain', email: `${key}-captain@example.com`, college: 'Test College', year: '3' },
    { name: 'Test Member', email: `${key}-member@example.com`, college: 'Test College', year: '2' },
  ],
})

test('draft configuration keeps deployed registration and submissions closed', () => {
  assert.deepEqual(deployedSettings(), { registrationOpen: false, submissionsOpen: false, deadline: null })
})

test('team access, revision control and final submissions through the API', async (t) => {
  const db = new PGlite()
  t.after(() => db.close())
  await db.exec(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'))
  const logs = []
  let database = null
  const policy = { registrationOpen: true, submissionsOpen: true, deadline: new Date(Date.now() + 600000).toISOString() }
  const api = createHackathonApi({
    getDb: () => database, settings: () => policy, secureCookie: false,
    logger: { info: (line) => logs.push(line), error: (line) => logs.push(line) },
  })
  const server = api.listen(0, '127.0.0.1')
  t.after(() => new Promise((resolve) => server.close(resolve)))
  await once(server, 'listening')
  const origin = `http://127.0.0.1:${server.address().port}`

  async function request(action, { body, cookie, requestOrigin = origin } = {}) {
    const url = new URL('/api/hackathon', origin)
    if (!body) url.searchParams.set('action', action)
    const headers = cookie ? { cookie } : {}
    const options = { headers }
    if (body) {
      options.method = 'POST'
      options.body = JSON.stringify({ action, ...body })
      headers['content-type'] = 'application/json'
      headers.origin = requestOrigin
    }
    const response = await fetch(url, options)
    const setCookie = response.headers.get('set-cookie')
    return { status: response.status, data: await response.json(), cookie: setCookie?.split(';')[0], setCookie, requestId: response.headers.get('x-request-id') }
  }

  const first = registration('first', 'First Team')
  assert.equal((await request('settings')).data.available, false)
  assert.equal((await request('register', { body: first })).status, 403)
  database = db
  assert.equal((await request('register', { body: first, requestOrigin: 'https://unrelated.example' })).status, 403)
  assert.equal((await request('workspace')).status, 401)

  const captain = await request('register', { body: first })
  assert.equal(captain.status, 201)
  assert.match(captain.data.teamCode, /^BW-[A-F0-9]{10}$/)
  assert.match(captain.setCookie, /HttpOnly/)
  assert.match(captain.setCookie, /SameSite=Lax/)
  assert.equal(captain.data.session, undefined)
  const invite = captain.data.invites[0]
  assert.equal((await request('register', { body: first })).status, 409)
  assert.equal((await db.query('SELECT count(*)::int AS count FROM hack_teams')).rows[0].count, 1)

  const second = await request('register', { body: registration('second', 'Second Team') })
  assert.equal(second.status, 201)
  assert.equal((await request('invite', { body: { memberId: second.data.invites[0].memberId }, cookie: captain.cookie })).status, 404)
  const renewed = await request('invite', { body: { memberId: invite.memberId }, cookie: captain.cookie })
  assert.equal(renewed.status, 200)
  assert.equal((await request('activate', { body: { token: invite.token, password: memberPassword } })).status, 400)
  const activation = { token: renewed.data.token, password: memberPassword }
  const member = await request('activate', { body: activation })
  assert.equal(member.status, 200)
  assert.equal((await request('activate', { body: activation })).status, 400)
  const login = { email: first.members[1].email, password: memberPassword, teamCode: captain.data.teamCode }
  assert.equal((await request('login', { body: { ...login, teamCode: second.data.teamCode } })).status, 401)
  const memberLogin = await request('login', { body: login })
  assert.equal(memberLogin.status, 200)
  const memberWorkspace = await request('workspace', { cookie: memberLogin.cookie })
  assert.equal(memberWorkspace.data.team.name, 'First Team')
  assert.equal(memberWorkspace.data.roster.length, 2)
  assert.equal(memberWorkspace.data.member.role, 'member')

  const project = {
    title: 'Campus navigator', summary: 'A guide to campus facilities.', tools: 'React and PostgreSQL',
    repository: 'https://github.com/example/navigator', demo: 'https://navigator.example', video: 'https://video.example/navigator',
  }
  const draft = await request('draft', { cookie: member.cookie, body: { revision: 0, project } })
  assert.equal(draft.status, 200)
  assert.equal(draft.data.project.revision, 1)
  assert.equal((await request('workspace', { cookie: captain.cookie })).data.project.payload.title, project.title)
  assert.deepEqual((await request('workspace', { cookie: second.cookie })).data.project.payload, {})
  assert.equal((await request('draft', { cookie: captain.cookie, body: { revision: 0, project } })).status, 409)
  assert.equal((await request('submit', { cookie: member.cookie, body: { revision: 1, project } })).status, 403)
  assert.equal((await request('submit', { cookie: captain.cookie, body: { revision: 1, project: { title: 'Incomplete' } } })).status, 400)
  const finalized = await request('submit', { cookie: captain.cookie, body: { revision: 1, project } })
  assert.equal(finalized.status, 200)
  assert.ok(finalized.data.project.submitted_at)
  assert.equal((await request('draft', { cookie: member.cookie, body: { revision: 2, project } })).status, 409)
  const secondDraft = { cookie: second.cookie, body: { revision: 0, project } }
  policy.deadline = new Date(Date.now() - 1000).toISOString()
  assert.equal((await request('draft', secondDraft)).status, 409)
  policy.submissionsOpen = false
  assert.equal((await request('draft', secondDraft)).status, 403)
  const events = (await request('workspace', { cookie: captain.cookie })).data.events
  assert.equal(events[0].action, 'project_submitted')
  assert.equal((await request('logout', { cookie: memberLogin.cookie, body: {} })).status, 200)
  assert.equal((await request('workspace', { cookie: memberLogin.cookie })).status, 401)
  assert.ok(logs.some((line) => JSON.parse(line).requestId === finalized.requestId))
  for (const secret of [captainPassword, memberPassword, invite.token, renewed.data.token, first.members[0].email, project.title]) {
    assert.equal(logs.some((line) => line.includes(secret)), false)
  }
})
