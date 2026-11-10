import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Activity, ArrowRight, BookOpen, Check, ClipboardCopy, FileCode2, Lock, LogOut, RefreshCw, Users } from 'lucide-react'
import { HACKATHON, PROJECT_FIELDS, eventDate } from '../../../shared/hackathon'
import { hackathonRequest } from './api'
import { Feedback } from './TeamAccess'
import s from './Hackathon.module.css'

const SAMPLE_KEY = 'kitsw-hackathon-sample-v1'
const SAMPLE = {
  team: { code: 'BW-SAMPLE', name: 'Campus Circuit', track: 'campus-civic' },
  member: { id: 'sample-captain', name: 'Sample captain', role: 'captain' },
  roster: [{ id: 'sample-captain', name: 'Sample captain', college: 'Example college', year: '3', role: 'captain', active: true }, { id: 'sample-member', name: 'Sample teammate', college: 'Example college', year: '2', role: 'member', active: true }],
  project: { revision: 0, submitted_at: null, updated_at: null, payload: { title: 'Campus Pulse', summary: 'A campus service tracker that helps students report accessibility issues and see progress in one place.', tools: 'React, PostgreSQL' } },
  events: [{ id: 'sample-registration', name: 'Sample captain', action: 'team_registered' }],
  submissionsOpen: true, deadline: null,
}
const LABELS = { team_registered: 'Team registered', member_activated: 'Member activated', member_signed_in: 'Member signed in', invite_reissued: 'Invitation replaced', project_submitted: 'Final project submitted', draft_saved: 'Project draft saved' }
const tabs = [['project', FileCode2, 'Project submission'], ['roster', Users, 'Team roster'], ['guidelines', BookOpen, 'Guidelines'], ['activity', Activity, 'Activity log']]

function getSample() {
  try { return JSON.parse(sessionStorage.getItem(SAMPLE_KEY)) || SAMPLE } catch { return SAMPLE }
}

function InviteLinks({ invites }) {
  const [copied, setCopied] = useState('')
  if (!invites.length) return null
  return <section className={s.formCard} aria-label="Member invitations"><h2>Share individual invitations</h2><p>Send each teammate their own link privately. Activating the account consumes the link.</p>
    {invites.map((invite) => {
      const url = `${window.location.origin}/hackathon/activate#invite=${encodeURIComponent(invite.token)}`
      return <div className={s.inviteRow} key={invite.memberId}><label>{invite.name}<input readOnly value={url} onFocus={(event) => event.target.select()} /></label><button type="button" className={s.secondary} onClick={async () => {
        try { await navigator.clipboard.writeText(url); setCopied(invite.memberId) } catch { setCopied('manual') }
      }}><ClipboardCopy size={16} /> {copied === invite.memberId ? 'Copied' : 'Copy link'}</button></div>
    })}{copied === 'manual' && <p role="status">Select the link and copy it manually.</p>}</section>
}

function ProjectEditor({ workspace, onSave, onReload }) {
  const [project, setProject] = useState(workspace.project.payload)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const submitted = Boolean(workspace.project.submitted_at)
  const editable = workspace.submissionsOpen && !submitted
  const completed = PROJECT_FIELDS.filter((field) => project[field.key]?.trim()).length
  async function save(final) {
    setBusy(true); setError(null)
    try { await onSave({ project, revision: workspace.project.revision }, final) }
    catch (problem) { setError(problem); setConfirm(false) }
    finally { setBusy(false) }
  }
  return <div className={s.editorLayout}>
    <form className={`${s.form} ${s.formCard}`} onSubmit={(event) => { event.preventDefault(); void save(false) }}>
      <div className={s.editorHeader}><div><div className={s.kicker}>SHARED TEAM ENTRY</div><h2>Project submission</h2></div><span className={s.badge}>{submitted ? 'Submitted' : 'Draft'}</span></div>
      {submitted && <p className={s.note}>Submitted {eventDate(workspace.project.submitted_at)}. This entry is locked.</p>}
      {!editable && !submitted && <p className={s.note}>The submission window is closed. Your saved draft is available to view.</p>}
      {PROJECT_FIELDS.map((field) => <label key={field.key}>{field.label}
        {field.multiline ? <textarea rows={5} maxLength={field.max} placeholder={field.placeholder} value={project[field.key] || ''} disabled={!editable || busy} onChange={(event) => setProject({ ...project, [field.key]: event.target.value })} />
          : <input type={field.url ? 'url' : 'text'} maxLength={field.max} placeholder={field.placeholder} value={project[field.key] || ''} disabled={!editable || busy} onChange={(event) => setProject({ ...project, [field.key]: event.target.value })} />}
      </label>)}
      <Feedback error={error} />
      {error?.status === 409 && <button type="button" className={s.secondary} onClick={onReload}><RefreshCw size={15} /> Reload saved draft</button>}
      {editable && <div className={s.actions}><button className={s.secondary} disabled={busy}>{busy ? 'Saving…' : 'Save draft'}</button>
        {workspace.member.role === 'captain' && <button className={s.primary} type="button" disabled={busy || completed < PROJECT_FIELDS.length} onClick={() => setConfirm(true)}>Submit final entry <ArrowRight size={16} /></button>}
      </div>}
      {confirm && <div className={s.note}><strong>Lock this project for judging?</strong><p>After final submission, teammates can view the entry but can’t edit it.</p><div className={s.actions}><button type="button" className={s.secondary} onClick={() => setConfirm(false)} disabled={busy}>Keep editing</button><button type="button" className={s.primary} disabled={busy} onClick={() => void save(true)}>Confirm submission</button></div></div>}
    </form>
    <aside className={s.sideCard}><div className={s.kicker}>SUBMISSION CHECKLIST</div><h3>{completed} / {PROJECT_FIELDS.length} fields complete</h3><progress aria-label="Submission fields complete" max={PROJECT_FIELDS.length} value={completed} />
      <ul className={s.checklist}>{PROJECT_FIELDS.map((field) => <li key={field.key}><Check size={15} className={project[field.key]?.trim() ? s.complete : s.incomplete} />{field.label}</li>)}</ul>
      <div className={s.deadline}><Lock size={17} /><div><strong>Final deadline</strong><p>{eventDate(workspace.deadline)}</p></div></div><p>All members can save the draft. Only the captain can submit the final entry.</p>
    </aside>
  </div>
}

export default function TeamWorkspace() {
  const location = useLocation(), navigate = useNavigate()
  const demo = new URLSearchParams(location.search).get('demo') === '1'
  const [sample, setSample] = useState(getSample)
  const [live, setLive] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [tab, setTab] = useState('project')
  const [inviteBusy, setInviteBusy] = useState('')
  const [invites, setInvites] = useState(() => location.state?.invites || [])
  const workspace = demo ? sample : live
  useEffect(() => {
    if (demo) return
    const controller = new AbortController()
    hackathonRequest('workspace', { signal: controller.signal }).then((value) => { setLive(value); setError(null) }).catch((problem) => {
      if (problem.name !== 'AbortError') { setLive(null); setError(problem) }
    })
    return () => controller.abort()
  }, [demo, refresh])

  function persistSample(value) {
    setSample(value)
    try { sessionStorage.setItem(SAMPLE_KEY, JSON.stringify(value)) } catch { /* storage may be disabled */ }
  }

  async function save(body, final) {
    if (demo) {
      if (final && PROJECT_FIELDS.some((field) => !body.project[field.key]?.trim())) throw new Error('Complete every field before submitting.')
      const now = new Date().toISOString()
      persistSample({ ...sample, project: { payload: body.project, revision: sample.project.revision + 1, updated_at: now, submitted_at: final ? now : null }, events: [{ id: now, name: sample.member.name, action: final ? 'project_submitted' : 'draft_saved', created_at: now }, ...sample.events].slice(0, 16) })
    } else {
      const data = await hackathonRequest(final ? 'submit' : 'draft', { body })
      setLive((previous) => ({ ...previous, project: data.project }))
      setRefresh((value) => value + 1)
    }
    setNotice(final ? 'Final project submitted and locked.' : 'Draft saved.')
  }

  async function reissue(memberId) {
    setInviteBusy(memberId); setError(null)
    try {
      const invite = await hackathonRequest('invite', { body: { memberId } })
      setInvites((previous) => [...previous.filter((item) => item.memberId !== memberId), invite])
    } catch (problem) { setError(problem) }
    finally { setInviteBusy('') }
  }

  async function signOut() {
    try { await hackathonRequest('logout', { body: {} }); navigate('/hackathon/login', { replace: true }) }
    catch (problem) { setError(problem) }
  }

  if (!workspace) return <main id="hack-main" className={`${s.shell} ${s.innerPage}`}><div className={s.pageHeading}><div className={s.kicker}>TEAM PORTAL</div><h1>Team workspace</h1></div>{error ? <><Feedback error={error} /><div className={s.actions}><Link className={s.primary} to="/hackathon/login">Team sign in</Link><Link className={s.secondary} to="/hackathon/workspace?demo=1">Explore sample workspace</Link></div></> : <p role="status">Loading your team workspace…</p>}</main>

  return <main id="hack-main" className={`${s.shell} ${s.innerPage}`}>
    {demo && <div className={s.previewBar}><span><strong>Sample workspace</strong> · Fictional team. Changes stay in this browser tab.</span><button type="button" className={s.textButton} onClick={() => { persistSample(SAMPLE); setNotice('Sample reset.'); setTab('project') }}>Reset sample</button></div>}
    <div className={s.workspaceHeading}><div><div className={s.kicker}>TEAM WORKSPACE <span className={s.teamId}>{workspace.team.code}</span></div><h1>{workspace.team.name}</h1><p>{HACKATHON.tracks.find((track) => track.id === workspace.team.track)?.title} · {workspace.roster.length} members</p></div><div className={s.userBlock}><strong>{workspace.member.name}</strong><span>{workspace.member.role === 'captain' ? 'Team captain' : 'Team member'}</span>{!demo && <button type="button" className={s.textButton} onClick={() => void signOut()}><LogOut size={15} /> Sign out</button>}</div></div>
    {notice && <p className={s.note} role="status">{notice}</p>}
    <Feedback error={error} />
    {!demo && workspace.member.role === 'captain' && <InviteLinks invites={invites.filter((invite) => workspace.roster.some((member) => member.id === invite.memberId && !member.active))} />}
    <div className={s.workspaceLayout}>
      <nav className={s.workspaceNav} aria-label="Team workspace">{tabs.map(([key, Icon, label]) => <button key={key} type="button" aria-pressed={tab === key} onClick={() => { setTab(key); setNotice('') }}><Icon size={18} />{label}</button>)}</nav>
      <div className={s.workspacePanel}>
        {tab === 'project' && <ProjectEditor key={`${workspace.team.code}-${workspace.project.revision}-${refresh}`} workspace={workspace} onSave={save} onReload={() => setRefresh((value) => value + 1)} />}
        {tab === 'roster' && <section className={s.formCard}><h2>Team roster</h2><p>Share team ID <strong>{workspace.team.code}</strong> with your teammates. Each member signs in separately.</p><ul className={s.roster}>{workspace.roster.map((member) => <li key={member.id}><div><strong>{member.name}</strong><span>{member.college} · {member.year === 'PG' ? 'Postgraduate' : `Year ${member.year}`}</span></div><span className={s.badge}>{member.role === 'captain' ? 'Captain' : member.active ? 'Active' : 'Invited'}</span>{!demo && !member.active && workspace.member.role === 'captain' && <button type="button" className={s.secondary} disabled={Boolean(inviteBusy)} onClick={() => void reissue(member.id)}>{inviteBusy === member.id ? 'Creating…' : 'New invite'}</button>}</li>)}</ul></section>}
        {tab === 'guidelines' && <section className={s.formCard}><div className={s.kicker}>{HACKATHON.confirmed ? 'EVENT GUIDE' : 'PROPOSED EVENT GUIDE'}</div><h2>Before you submit</h2><ul className={s.guideList}><li>Describe the problem, who it affects and how your project solves it.</li><li>Include a GitHub repository with a README and instructions to run your project.</li><li>Make sure the demo and video links work without private account access.</li><li>List your tools and credit any external libraries, datasets and AI assistance.</li><li>Save a draft early. Have the captain confirm the final submission before the deadline.</li></ul><Link className={s.textButton} to="/hackathon#rules">Read event rules <ArrowRight size={16} /></Link></section>}
        {tab === 'activity' && <section className={s.formCard}><h2>Team activity log</h2><p>Recent changes and sign-ins for this team.</p><ul className={s.roster}>{workspace.events.map((entry) => <li key={entry.id}><div><strong>{LABELS[entry.action] || entry.action}</strong><span>{entry.name || 'Team member'}</span></div><small>{entry.created_at ? eventDate(entry.created_at) : 'Sample activity'}</small></li>)}</ul></section>}
      </div>
    </div>
  </main>
}
