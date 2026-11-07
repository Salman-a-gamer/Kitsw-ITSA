import { Link, Navigate, useSearchParams } from 'react-router'
import { REGISTRATIONS_OPEN, REGISTRATION_CLOSED_MESSAGE } from '../../shared/registrationStatus'
import DaySelector from '../components/registration/DaySelector'
import RegistrationView from '../components/registration/RegistrationView'
import StatusMessage from '../components/ui/StatusMessage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { resolveRegistrationView } from '../utils/registrationRoute'
import s from './Register.module.css'

// The view is derived from the URL on every render, so browser Back/Forward
// and shared links always show the matching step.
export default function Register() {
  const [searchParams] = useSearchParams()
  const route = resolveRegistrationView(searchParams)

  const title =
    route.view === 'form'
      ? `${route.event.title} Registration`
      : 'Register'
  useDocumentTitle(REGISTRATIONS_OPEN ? title : 'Registrations closed')

  if (!REGISTRATIONS_OPEN) {
    return (
      <div className={s.page}>
        <section className={s.closedNotice} aria-labelledby="registrations-closed-title">
          <h1 id="registrations-closed-title">Registrations closed</h1>
          <StatusMessage tone="info" title="Event concluded">
            {REGISTRATION_CLOSED_MESSAGE}
          </StatusMessage>
          <Link to="/gallery" className="btn btn-primary">View the event gallery</Link>
        </section>
      </div>
    )
  }

  if (route.view === 'redirect-events') {
    return <Navigate to="/events" replace />
  }

  return (
    <div className={s.page}>
      <div className={s.noise} aria-hidden="true" />
      <div className={`${s.orb} ${s.orbOne}`} aria-hidden="true" />
      <div className={`${s.orb} ${s.orbTwo}`} aria-hidden="true" />
      <div className={`${s.line} ${s.lineOne}`} aria-hidden="true" />
      <div className={`${s.line} ${s.lineTwo}`} aria-hidden="true" />

      {route.unknownEvent && (
        <div className={s.notice}>
          <StatusMessage tone="info" title="Event not found">
            The link you followed points to an event that is not available for registration.
            Please choose a registration day below.
          </StatusMessage>
        </div>
      )}

      {route.view === 'days' && <DaySelector />}
      {route.view === 'form' && <RegistrationView key={route.event.id} event={route.event} from={route.from} />}
    </div>
  )
}
