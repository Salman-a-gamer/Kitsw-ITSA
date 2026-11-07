import { Link } from 'react-router'
import { ArrowRight, Calendar } from 'lucide-react'
import { registrationPath } from '../../utils/registrationRoute'
import { cx } from '../../utils/cx'
import s from '../../pages/Events.module.css'

/** Event/workshop card from the legacy events page. */
export default function EventCard({ event, featured = false, from = 'events' }) {
  const { icon: Icon, meta } = event
  const MetaIcon = meta.icon
  const titleId = `event-${event.id}-title`

  return (
    <article className={cx(s.eventCard, featured && s.featured)} aria-labelledby={titleId}>
      <div className={s.eventCardTop}>
        <span className={s.eventNumber} aria-hidden="true">
          {event.number}
        </span>
        <span className={cx(s.eventStatus, event.status === 'open' && s.live)}>
          {event.statusLabel}
        </span>
      </div>

      <div className={s.eventIcon} aria-hidden="true">
        <Icon size="1em" />
      </div>

      <span className={s.eventType}>{event.category}</span>
      <h4 id={titleId}>
        {featured && event.id === 'llm' ? (
          <>
            Industry-Driven AI: Prompt, Build,
            <br />
            Deploy with LLMs and Intelligent Automation
          </>
        ) : (
          event.title
        )}
      </h4>
      <p>{event.description}</p>

      <div className={s.eventInfo}>
        <span>
          <Calendar size="1.2em" aria-hidden="true" /> {event.date}
        </span>
        <span>
          <MetaIcon size="1.2em" aria-hidden="true" /> {meta.label}
        </span>
      </div>

      {event.registrationEnabled ? (
        <Link
          to={registrationPath(event.id, from)}
          className={s.eventRegister}
          aria-label={`Register for ${event.title}`}
        >
          Register
          <ArrowRight size="1.3em" aria-hidden="true" />
        </Link>
      ) : (
        <span className={`${s.eventRegister} ${s.eventRegisterDisabled}`} aria-disabled="true">
          {event.status === 'closed' ? 'Registrations closed' : 'Registration not configured'}
        </span>
      )}
    </article>
  )
}

