import { useRef } from 'react'
import { Link } from 'react-router'
import { Mail, MapPin, Users } from 'lucide-react'
import { SITE } from '../data/site'
import { REGISTRATIONS_OPEN } from '../../shared/registrationStatus'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useMagnetic } from '../hooks/useMagnetic'
import s from './Contact.module.css'

/*
  Content from the legacy contact.html. It does not list an email address or
  phone number, so none is shown here — add the official contact details to
  this list once they are confirmed.
*/
const CONTACT_CARDS = [
  {
    icon: MapPin,
    label: 'CAMPUS',
    title: SITE.college,
    text: 'Department of Information Technology, KITS Warangal.',
  },
  {
    icon: Mail,
    label: 'EMAIL',
    title: 'IT Department',
    text: "Use the department's official communication channel for event and association queries.",
  },
  {
    icon: Users,
    label: 'COMMUNITY',
    title: 'Students & Faculty',
    text: 'Connect with the association during workshops, events and department activities.',
  },
]

export default function Contact() {
  useDocumentTitle('Contact')
  const ctaRef = useRef(null)
  useMagnetic(ctaRef)

  return (
    <div className={s.page}>
      <section className={s.hero} aria-labelledby="contact-title">
        <div className={s.heroInner}>
          <div className={s.label}>CONNECT WITH US</div>
          <h1 id="contact-title">
            LET&apos;S <span>CONNECT.</span>
          </h1>
          <p>
            Have a question about an event, workshop or the IT Department? Reach the department
            team through the details below.
          </p>
        </div>
      </section>

      <section className={s.content} aria-label="Contact details">
        <div className={s.grid}>
          {CONTACT_CARDS.map(({ icon: Icon, label, title, text }) => (
            <article key={label} className={s.card}>
              <div className={s.icon} aria-hidden="true">
                <Icon />
              </div>
              <span>{label}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className={s.cta}>
          <div>
            <span>{REGISTRATIONS_OPEN ? 'READY TO PARTICIPATE?' : 'THANK YOU FOR PARTICIPATING'}</span>
            <h2>
              {REGISTRATIONS_OPEN ? 'Join the next ' : 'Relive the '}<strong>experience.</strong>
            </h2>
          </div>
          <Link ref={ctaRef} to={REGISTRATIONS_OPEN ? '/register' : '/gallery'} className={s.ctaLink}>
            {REGISTRATIONS_OPEN ? 'Register Now' : 'View Gallery'} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
