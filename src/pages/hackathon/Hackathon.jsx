import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Boxes, Braces, Cpu, GitBranch, Layers3, Terminal } from 'lucide-react'
import { HACKATHON, eventDate } from '../../../shared/hackathon'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { JoinTeam, MemberAccess } from './TeamAccess'
import TeamWorkspace from './TeamWorkspace'
import s from './Hackathon.module.css'

const TRACK_ICONS = [Cpu, Layers3, Boxes]
const nav = [['Overview', '/hackathon'], ['Tracks', '/hackathon#tracks'], ['Timeline', '/hackathon#timeline'], ['Rules', '/hackathon#rules']]

function Blueprint() {
  return (
    <div className={s.blueprint} aria-hidden="true">
      <div className={s.blueprintTop}><span><Terminal size={15} /> BUILD WARANGAL</span><span>DESIGN / BUILD / SHIP</span></div>
      <svg viewBox="0 0 470 325" className={s.circuit} fill="none">
        <defs><pattern id="bw-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" stroke="#ffffff" strokeOpacity=".12" /></pattern></defs>
        <rect width="470" height="325" fill="url(#bw-grid)" />
        <path d="M30 86H113L158 131H193M30 239H113L158 194H193M277 131H310L355 86H440M277 194H310L355 239H440M235 28V102M235 223V297" stroke="#dfbf7e" strokeWidth="1.4" />
        <path d="M30 120H83L133 170H177M293 170H337L387 120H440M30 205H83L112 176M440 205H387L358 176" stroke="#bf8694" strokeWidth="1.2" strokeDasharray="5 6" />
        <path d="M235 89L297 125V198L235 234L173 198V125L235 89Z" fill="#32141e" stroke="#e5c789" strokeWidth="1.5" />
        <path d="M235 109L278 134V187L235 212L192 187V134L235 109Z" stroke="#bf8694" />
        <path d="M221 147L205 162L221 177M249 147L265 162L249 177M241 143L229 181" stroke="#f3d997" strokeWidth="3" strokeLinecap="square" />
        {[ [30,86],[30,239],[440,86],[440,239],[235,28],[235,297] ].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#e5c789" />)}
        <path d="M15 18H43M15 18V46M455 18H427M455 18V46M15 307H43M15 307V279M455 307H427M455 307V279" stroke="#f3d997" strokeOpacity=".65" />
      </svg>
      <div className={s.blueprintBottom}><span>17.98° N / 79.60° E</span><span>WARANGAL, INDIA</span></div>
    </div>
  )
}

function Landing() {
  return (
    <main id="hack-main">
      <section className={s.hero}>
        <div className={s.shell}>
          <div className={s.heroGrid}>
            <div>
              <div className={s.eyebrow}><span /> {HACKATHON.confirmed ? 'STUDENT HACKATHON' : 'PROPOSED STUDENT HACKATHON'}</div>
              <h1>Build what’s<br /><em>next.</em></h1>
              <p>Bring a team, find a problem worth solving, and build a working prototype at {HACKATHON.name}, the {HACKATHON.confirmed ? '' : 'proposed '}hackathon from the IT Association at KITS Warangal.</p>
              <div className={s.actions}><Link className={s.primary} to="/hackathon/register">Team registration <ArrowUpRight size={18} /></Link><Link className={s.secondary} to="/hackathon/workspace?demo=1">Explore sample workspace <ArrowRight size={17} /></Link></div>
            </div>
            <Blueprint />
          </div>
          <dl className={s.facts}>
            <div><dt>EVENT DATE</dt><dd>{eventDate(HACKATHON.dates.kickoff)}</dd></div>
            <div><dt>VENUE</dt><dd>{HACKATHON.venue}</dd></div>
            <div><dt>TEAM SIZE {HACKATHON.confirmed ? '' : '· PROPOSED'}</dt><dd>{HACKATHON.minTeam}–{HACKATHON.maxTeam} students</dd></div>
            <div><dt>PRIZE POOL</dt><dd>{HACKATHON.prizePool || 'To be announced'}</dd></div>
          </dl>
        </div>
      </section>
      <section className={`${s.section} ${s.shell}`} id="tracks" aria-labelledby="tracks-title">
        <div className={s.sectionHeading}><div><div className={s.kicker}>01 / TRACKS</div><h2 id="tracks-title">Pick a problem<br />worth solving.</h2></div><p>{HACKATHON.confirmed ? 'Pick one track when registering.' : 'Three proposed tracks. Final problem statements will be shared before kickoff.'}</p></div>
        <div className={s.trackGrid}>{HACKATHON.tracks.map((track, index) => {
          const Icon = TRACK_ICONS[index] || Braces
          return <article className={s.track} key={track.id}><div className={s.trackTop}><Icon size={27} /><span>0{index + 1}</span></div><span className={s.kicker}>{track.tag}</span><h3>{track.title}</h3><p>{track.prompt}</p></article>
        })}</div>
      </section>
      <section className={s.timelineBand} id="timeline" aria-labelledby="timeline-title">
        <div className={`${s.shell} ${s.section} ${s.timeline}`}>
          <div><div className={s.kicker}>02 / SCHEDULE</div><h2 id="timeline-title">From idea<br />to demo.</h2><p>Exact dates and times will be posted here. All confirmed times will be shown in IST.</p></div>
          <ol>{HACKATHON.schedule.map(([key, label, description], index) => <li key={key}><span className={s.stepNo}>0{index + 1}</span><div><h3>{label}</h3><p>{description}</p></div><span className={s.timelineDate}>{eventDate(HACKATHON.dates[key])}</span></li>)}</ol>
        </div>
      </section>
      <section id="rules" className={`${s.shell} ${s.section}`} aria-labelledby="rules-title">
        <div className={s.sectionHeading}><div><div className={s.kicker}>03 / EVENT GUIDE</div><h2 id="rules-title">Know the brief.</h2></div><p>{HACKATHON.confirmed ? 'Check the submission requirements before you start.' : 'Draft guidelines and judging weights for the organizing team to review.'}</p></div>
        <div className={s.rulesGrid}><div className={s.faq}>
          <details open><summary>Who can participate?</summary><p>The proposed format is a student hackathon with {HACKATHON.minTeam}–{HACKATHON.maxTeam} members per team. Eligibility and any fee will be confirmed before registration opens.</p></details>
          <details><summary>What should a team submit?</summary><p>A project overview, a GitHub repository, a working demo link, a short demo video, and the technologies used. Make sure judges can access each link.</p></details>
          <details><summary>Can we use existing tools or AI?</summary><p>Credit external code, datasets and AI assistance. Explain what your team built during the event. Final rules will be announced at kickoff.</p></details>
          <details><summary>How do member accounts work?</summary><p>The captain registers the team and shares a one-time invitation with each member. Everyone sets their own password. The team shares a draft, and only the captain submits it.</p></details>
        </div><div className={s.rubric}><div className={s.kicker}>JUDGING {HACKATHON.confirmed ? '' : '· PROPOSED'}</div><h3>How projects are scored</h3>{HACKATHON.rubric.map(([name, weight]) => <div className={s.weight} key={name}><span>{name}</span><strong>{weight}%</strong></div>)}</div></div>
        <div className={s.closing}><div><div className={s.kicker}>PARTICIPANT PORTAL</div><h2>One team. One workspace.</h2></div><Link className={s.primary} to="/hackathon/login">Team sign in <ArrowDownRight size={18} /></Link></div>
      </section>
    </main>
  )
}

export default function Hackathon() {
  const { pathname, hash } = useLocation()
  useDocumentTitle(`${HACKATHON.name} | IT Association, KITSW`, { raw: true })
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = HACKATHON.confirmed ? 'index,follow' : 'noindex,nofollow'
    document.head.append(meta)
    return () => meta.remove()
  }, [])
  useEffect(() => {
    if (pathname === '/hackathon' && ['#tracks', '#timeline', '#rules'].includes(hash)) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return (
    <div className={s.page}>
      <a className={s.skip} href="#hack-main">Skip to content</a>
      <header className={s.header}><div className={`${s.shell} ${s.headerInner}`}>
        <Link to="/hackathon" className={s.brand}><span><Braces size={23} /></span><div><strong>{HACKATHON.name}</strong><small>IT ASSOCIATION / KITSW</small></div></Link>
        <nav aria-label="Hackathon">{nav.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</nav>
        <Link className={s.headerLink} to="/hackathon/login"><GitBranch size={16} /> Team portal <ArrowUpRight size={15} /></Link>
      </div></header>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="register" element={<JoinTeam />} />
        <Route path="login" element={<MemberAccess key="login" />} />
        <Route path="activate" element={<MemberAccess key="activate" activate />} />
        <Route path="workspace" element={<TeamWorkspace />} />
        <Route path="*" element={<main id="hack-main" className={`${s.shell} ${s.section}`}><h1>Page not found</h1><Link to="/hackathon">Back to the hackathon</Link></main>} />
      </Routes>
      <footer className={s.footer}><div className={s.shell}><span>{HACKATHON.organizer}</span><div><Link to="/">IT Department website</Link><Link to="/hackathon#rules">Event guide</Link></div></div></footer>
    </div>
  )
}
