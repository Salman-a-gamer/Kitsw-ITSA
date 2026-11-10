import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, KeyRound, Plus, Trash2, Users } from 'lucide-react'
import { HACKATHON } from '../../../shared/hackathon'
import { hackathonRequest } from './api'
import s from './Hackathon.module.css'

function useAvailability() {
  const [availability, setAvailability] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    hackathonRequest('settings', { signal: controller.signal }).then(setAvailability).catch((error) => {
      if (error.name !== 'AbortError') setAvailability({ available: false, registrationOpen: false })
    })
    return () => controller.abort()
  }, [])
  return availability
}

export function Feedback({ error }) {
  if (!error) return null
  return <p className={s.error} role="alert">{error.message}{error.requestId && <small>Support reference: {error.requestId}</small>}</p>
}

const freshMember = () => ({ key: crypto.randomUUID(), name: '', email: '', college: '', year: '' })
const YEARS = [['1','First year'], ['2','Second year'], ['3','Third year'], ['4','Fourth year'], ['5','Fifth year'], ['PG','Postgraduate']]

export function JoinTeam() {
  const availability = useAvailability()
  const navigate = useNavigate()
  const [members, setMembers] = useState(() => Array.from({ length: HACKATHON.minTeam }, freshMember))
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const edit = (key, field, value) => setMembers((list) => list.map((member) => member.key === key ? { ...member, [field]: value } : member))
  async function submit(event) {
    event.preventDefault()
    if (!availability?.registrationOpen || busy) return
    const form = new FormData(event.currentTarget)
    setBusy(true); setError(null)
    try {
      const result = await hackathonRequest('register', { body: { name: form.get('name'), track: form.get('track'), password: form.get('password'), consent: form.get('consent') === 'on', members: members.map(({ name, email, college, year }) => ({ name, email, college, year })) } })
      navigate('/hackathon/workspace', { replace: true, state: { invites: result.invites } })
    } catch (problem) { setError(problem) }
    finally { setBusy(false) }
  }
  return (
    <main id="hack-main" className={`${s.shell} ${s.innerPage}`}>
      <Link className={s.back} to="/hackathon"><ArrowLeft size={16} /> Hackathon overview</Link>
      <div className={s.pageHeading}><div className={s.kicker}><Users size={17} /> PARTICIPANT REGISTRATION</div><h1>Register your team.</h1><p>Enter each member’s details. The first member is the captain and receives the team ID and individual invitation links.</p></div>
      <div className={s.formLayout}>
        <form className={s.form} onSubmit={submit}>
          <section className={s.formCard}><h2>Team details</h2><div className={s.formGrid}>
            <label>Team name<input name="name" placeholder="e.g. Campus Circuit" minLength={2} maxLength={70} required /></label>
            <label>Preferred track<select name="track" defaultValue="" required><option value="" disabled>Choose a track</option>{HACKATHON.tracks.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}</select></label>
          </div></section>
          {members.map((member, index) => <fieldset className={s.formCard} key={member.key}>
            <legend>{index === 0 ? '01 / CAPTAIN' : `0${index + 1} / TEAM MEMBER`}</legend>
            <div className={s.formGrid}>
              <label>Full name<input autoComplete={index === 0 ? 'name' : 'off'} value={member.name} onChange={(event) => edit(member.key, 'name', event.target.value)} minLength={2} maxLength={100} required /></label>
              <label>Email address<input type="email" autoComplete={index === 0 ? 'email' : 'off'} value={member.email} onChange={(event) => edit(member.key, 'email', event.target.value)} maxLength={150} required /></label>
              <label>College<input value={member.college} onChange={(event) => edit(member.key, 'college', event.target.value)} minLength={2} maxLength={150} required /></label>
              <label>Study year<select value={member.year} onChange={(event) => edit(member.key, 'year', event.target.value)} required><option value="" disabled>Choose a year</option>{YEARS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            </div>
            {index === 0 ? <label className={s.passwordField}>Captain’s password<input type="password" name="password" autoComplete="new-password" minLength={12} maxLength={128} placeholder="At least 12 characters" required /></label> : members.length > HACKATHON.minTeam && <button className={s.textButton} type="button" onClick={() => setMembers((list) => list.filter((entry) => entry.key !== member.key))}><Trash2 size={15} /> Remove member {index + 1}</button>}
          </fieldset>)}
          {members.length < HACKATHON.maxTeam && <button type="button" className={s.secondary} onClick={() => setMembers((list) => [...list, freshMember()])}><Plus size={16} /> Add a member</button>}
          <label className={s.check}><input type="checkbox" name="consent" required /> Everyone on the team agrees to share these details with the IT Association for event registration.</label>
          <Feedback error={error} />
          <button className={s.primary} disabled={busy || !availability?.registrationOpen}>{busy ? 'Creating team…' : 'Create team'} <ArrowRight size={17} /></button>
        </form>
        <aside className={s.sideCard}><div className={s.kicker}>BEFORE YOU START</div><h2>{availability?.registrationOpen ? (HACKATHON.confirmed ? 'Registration open' : 'Local test registration') : 'Registration is not open'}</h2>
          <p>{availability?.registrationOpen ? (HACKATHON.confirmed ? 'Use one email per member. Keep your team ID handy.' : 'Use fictional participant details while testing this local setup.') : 'You can review the form. Team registration will open once the department confirms the event and publishes the schedule.'}</p>
          <ul><li>{HACKATHON.minTeam}–{HACKATHON.maxTeam} members per team</li><li>One account per participant</li><li>One shared project submission</li></ul>
          <Link className={s.textButton} to="/hackathon/workspace?demo=1">Explore sample workspace <ArrowRight size={16} /></Link>
        </aside>
      </div>
    </main>
  )
}

export function MemberAccess({ activate = false }) {
  const { hash } = useLocation()
  const invite = new URLSearchParams(hash.slice(1)).get('invite') || ''
  const navigate = useNavigate()
  const availability = useAvailability()
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = form.get('password')
    if (activate && password !== form.get('confirmation')) { setError(new Error('Passwords do not match.')); return }
    setBusy(true); setError(null)
    try {
      await hackathonRequest(activate ? 'activate' : 'login', { body: activate ? { token: invite, password } : { teamCode: form.get('teamCode'), email: form.get('email'), password } })
      navigate('/hackathon/workspace', { replace: true })
    } catch (problem) { setError(problem) }
    finally { setBusy(false) }
  }
  return (
    <main id="hack-main" className={`${s.shell} ${s.innerPage}`}>
      <Link className={s.back} to="/hackathon"><ArrowLeft size={16} /> Hackathon overview</Link>
      <div className={s.accessLayout}>
        <div className={s.accessIntro}><div className={s.kicker}><KeyRound size={17} /> PARTICIPANT ACCESS</div><h1>{activate ? 'Activate your account.' : 'Your team starts here.'}</h1><p>{activate ? 'Choose your own password to join your team’s shared workspace.' : 'Use your team ID and your individual email and password. Everyone on the roster works in the same project workspace.'}</p><Link className={s.secondary} to="/hackathon/workspace?demo=1">Explore sample workspace <ArrowRight size={17} /></Link></div>
        <form className={`${s.form} ${s.formCard} ${s.authCard}`} onSubmit={submit}>
          <h2>{activate ? 'Set your password' : 'Member sign in'}</h2>
          {availability && !availability.available && <p className={s.note}>Team accounts aren’t connected on this deployment. The sample workspace is available.</p>}
          {activate && !invite && <p className={s.note}>Open the full invitation link from your captain.</p>}
          {!activate && <><label>Team ID<input name="teamCode" placeholder="BW-…" maxLength={32} autoComplete="off" required /></label><label>Email address<input type="email" name="email" autoComplete="username" maxLength={150} required /></label></>}
          <label>Password<input type="password" name="password" minLength={activate ? 12 : undefined} maxLength={128} autoComplete={activate ? 'new-password' : 'current-password'} required /></label>
          {activate && <label>Confirm password<input type="password" name="confirmation" minLength={12} maxLength={128} autoComplete="new-password" required /></label>}
          <Feedback error={error} />
          <button className={s.primary} disabled={busy || !availability?.available || (activate && !invite)}>{busy ? 'Please wait…' : activate ? 'Activate account' : 'Sign in'} <ArrowRight size={17} /></button>
          <small>{activate ? 'Invitations are valid for seven days and can only be used once.' : 'New team member? Ask your captain for your personal invitation link.'}</small>
        </form>
      </div>
    </main>
  )
}
