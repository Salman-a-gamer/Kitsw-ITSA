import { Link } from 'react-router'
import {
  ArrowRight,
  Check,
  SquareArrowOutUpRight,
} from 'lucide-react'

import { getEvent } from '../data/events'
import { SITE } from '../data/site'
import {
  PREVIOUS_WORKSHOPS,
  PREVIOUS_WORKSHOPS_NOTE,
} from '../data/workshops'

import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { registrationPath } from '../utils/registrationRoute'
import { REGISTRATIONS_OPEN } from '../../shared/registrationStatus'
import ImageWithFallback from '../components/ui/ImageWithFallback'

import s from './Workshops.module.css'

const CURRENT = getEvent('llm')

export default function Workshops() {
  useDocumentTitle('Workshops')

  const hasSamples =
    PREVIOUS_WORKSHOPS.some(
      (item) => item.sample,
    )

  /*
   * Defensive check.
   *
   * If the event data is accidentally incomplete,
   * don't allow the entire React route to crash.
   */
  if (!CURRENT || !CURRENT.workshop) {
    return (
      <main className={s.page}>
        <section
          className={`${s.workshopCurrent} ${s.sectionShell}`}
          aria-labelledby="workshop-error-title"
        >
          <div className={s.sectionEyebrow}>
            CURRENT YEAR · {SITE.year}
          </div>

          <article className={s.currentWorkshopCard}>
            <div className={s.currentMain}>
              <div className={s.statusPill}>
                <span aria-hidden="true" />
                WORKSHOP INFORMATION
              </div>

              <h1 id="workshop-error-title">
                Workshop details are being updated.
              </h1>

              <p>
                The current workshop information is
                temporarily unavailable. Please check
                again shortly.
              </p>

              <Link
                className={s.workshopRegisterBtn}
                to="/events"
              >
                Explore Events
                <ArrowRight
                  size="1.3em"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </article>
        </section>
      </main>
    )
  }

  const { workshop } = CURRENT

  return (
    <div className={s.page}>
      <section
        className={s.workshopHero}
        aria-labelledby="workshops-title"
      >
        <div className={s.workshopHeroInner}>
          <div className={s.workshopKicker}>
            <span aria-hidden="true" />

            {SITE.festUpper} {SITE.year} · DAY 01

            <span aria-hidden="true" />
          </div>

          <div className={s.workshopHeroGrid}>
            <div>

              <h1 id="workshops-title">
                WORKSHOPS <em>THAT BUILD.</em>
              </h1>

              <p>
                Practical sessions designed to help
                students explore emerging technologies,
                build useful skills and turn curiosity
                into working ideas.
              </p>
            </div>

            <a
              className={s.heroPoster}
              href={REGISTRATIONS_OPEN ? '/register?event=llm&from=workshops' : '/gallery'}
              aria-label={REGISTRATIONS_OPEN ? 'Register for the Industry-Driven AI workshop' : 'View the event gallery'}
            >
              <ImageWithFallback
                imageKey={CURRENT.poster}
                alt={CURRENT.posterAlt}
                loading="eager"
              />
            </a>
          </div>
        </div>
      </section>

      <section
        className={`${s.workshopCurrent} ${s.sectionShell}`}
        aria-labelledby="current-title"
      >
        <div className={s.sectionEyebrow}>
          CURRENT YEAR · {SITE.year}
        </div>

        <article className={s.currentWorkshopCard}>

          <div className={s.currentMain}>
            <div className={s.statusPill}>
              <span aria-hidden="true" />

              {REGISTRATIONS_OPEN ? 'CURRENT WORKSHOP' : 'WORKSHOP CONCLUDED'}
            </div>

            <h2 id="current-title">
              {workshop.titleLead}{' '}
              <strong>
                {workshop.titleStrong}
              </strong>
            </h2>

            <p>
              {workshop.description}
            </p>

            <dl
              className={
                s.workshopMetaGrid
              }
            >
              {workshop.facts.map(
                (fact) => (
                  <div key={fact.label}>
                    <dt>
                      <span>
                        {fact.label}
                      </span>
                    </dt>

                    <dd>
                      <strong>
                        {fact.value}
                      </strong>
                    </dd>
                  </div>
                ),
              )}
            </dl>
          </div>

          <div className={s.currentSide}>
            <div className={s.dueTab}>
              <span>
                {workshop.due.label}
              </span>

              <strong>
                {workshop.due.value}
              </strong>

              <small>
                {REGISTRATIONS_OPEN ? workshop.due.note : 'Registrations closed'}
              </small>
            </div>

            {REGISTRATIONS_OPEN ? <Link
              className={
                s.workshopRegisterBtn
              }
              to={registrationPath(
                CURRENT.id,
                'workshops',
              )}
              aria-label={`Register for ${CURRENT.title}`}
            >
              Register

              <SquareArrowOutUpRight
                size="1.3em"
                aria-hidden="true"
              />
            </Link> : <span className={s.workshopRegisterBtn} aria-disabled="true">Registrations closed</span>}
          </div>
        </article>
      </section>

      <section
        className={`${s.workshopHistory} ${s.sectionShell}`}
        aria-labelledby="history-title"
      >
        <div className={s.historyHeading}>
          <div>
            <div className={s.sectionEyebrow}>
              PREVIOUS WORKSHOPS
            </div>

            <h2 id="history-title">
              What we have{' '}
              <strong>
                already built.
              </strong>
            </h2>
          </div>

          <div>
            <p>
              {PREVIOUS_WORKSHOPS_NOTE}
            </p>

            {hasSamples && (
              <span
                className={
                  s.sampleNote
                }
              >
                SAMPLE CONTENT · AWAITING
                FINAL RECORDS
              </span>
            )}
          </div>
        </div>

        <div className={s.completedList}>
          {PREVIOUS_WORKSHOPS.map(
            (item) => (
              <article
                key={item.number}
                className={
                  s.completedWorkshop
                }
                data-sample={
                  item.sample ||
                  undefined
                }
              >
                <div
                  className={
                    s.completedNumber
                  }
                  aria-hidden="true"
                >
                  {item.number}
                </div>

                <div
                  className={
                    s.completedInfo
                  }
                >
                  <span>
                    COMPLETED · {item.year}

                    {item.sample && (
                      <span
                        className={
                          s.sampleBadge
                        }
                      >
                        SAMPLE RECORD
                      </span>
                    )}
                  </span>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>
                </div>

                <div
                  className={
                    s.completedStatus
                  }
                >
                  <Check
                    size="1.4em"
                    aria-hidden="true"
                  />

                  <span>
                    Workshop
                    <br />
                    Completed
                  </span>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <section
        className={s.workshopCta}
        aria-labelledby="workshop-cta-title"
      >
        <div>
          <span>
            KEEP LEARNING
          </span>

          <h2 id="workshop-cta-title">
            One workshop can start
            <br />
            <strong>
              your next idea.
            </strong>
          </h2>
        </div>

        <Link to="/events">
          Explore Events

          <ArrowRight
            size="1.3em"
            aria-hidden="true"
          />
        </Link>
      </section>
    </div>
  )
}
