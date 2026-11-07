import EventCard from '../components/events/EventCard'
import { eventsByDay } from '../data/events'
import { SITE } from '../data/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { REGISTRATIONS_OPEN } from '../../shared/registrationStatus'
import s from './Events.module.css'

const NUMBER_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
]

export default function Events() {
  useDocumentTitle(`Events | ${SITE.fest} ${SITE.year}`, { raw: true })

  const events = eventsByDay('day2')
  const total = events.length
  const totalWord = NUMBER_WORDS[total] ?? String(total)

  return (
    <div className={s.page}>
      <section className={s.eventsHero} aria-labelledby="events-title">
        <div className={s.eventsHeroInner}>
          <div className={s.eventsKicker}>
            <span aria-hidden="true" />
            {SITE.festUpper} {SITE.year} · EVENTS
            <span aria-hidden="true" />
          </div>

          <div className={s.eventsHeroGrid}>
            <div>
              <h1 id="events-title">
                EVENTS <em>THAT CONNECT.</em>
              </h1>
              <p>
                {totalWord} events covering technology, creativity, problem solving and
                collaboration. {REGISTRATIONS_OPEN ? 'Select an event to open its dedicated registration flow.' : 'Sumshodhini 2026 has concluded. Thank you to everyone who participated.'}
              </p>
            </div>

            <a
              className={s.eventsGifLink}
              href="https://giphy.com/gifs/Pluralsight-computer-technology-coding-L1R1tvI9svkIWwpVYr"
              target="_blank"
              rel="noreferrer"
              aria-label="View the coding GIF on GIPHY"
            >
              <img
                className={s.eventsGif}
                src="https://media.giphy.com/media/L1R1tvI9svkIWwpVYr/giphy.gif"
                alt="Animated person coding at a computer"
                loading="lazy"
              />
              <span className={s.eventsGifCaption}>
                CREATE · LEARN · COMPETE
              </span>
            </a>
          </div>
        </div>
      </section>

      <section
        className={s.eventsPageContent}
        aria-labelledby="events-choose-title"
      >
        <div className={s.eventsHeading}>
          <div>
            <div className={s.eventsEyebrow}>
              {SITE.festUpper} {SITE.year}
            </div>
            <h2 id="events-choose-title">
              Choose your <strong>event.</strong>
            </h2>
          </div>

          <p>
            Click an event&apos;s Register button to open that event&apos;s registration
            directly. The selected event, poster and payment QR will load
            automatically.
          </p>
        </div>

        <div className={s.eventGroup}>
          <div className={s.eventGroupHeading}>
            <h3>EVENTS</h3>
          </div>

          <div className={s.eventsGrid}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
