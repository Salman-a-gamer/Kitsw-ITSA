import { Link } from 'react-router'

import AssociationHighlights from '../components/home/AssociationHighlights'
import IdCard3D from '../components/home/IdCard3D'
import Testimonials from '../components/home/Testimonials'

import { LOGO, SITE } from '../data/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { REGISTRATIONS_OPEN } from '../../shared/registrationStatus'

import ImageWithFallback from '../components/ui/ImageWithFallback'

import s from './Home.module.css'

import itDepartmentGroup from '../assets/images/it-department-group.jpg'

const STATS = [
  { value: 'IT', label: 'DEPARTMENT' },
  { value: '25', label: 'FACULTIES' },
  { value: '35', label: 'STUDENT ASSOCIATION MEMBERS' },
]

const ABOUT_POINTS = [
  'Explore technologies and emerging ideas beyond the classroom.',
  'Build practical skills through projects and hands-on activities.',
  'Participate in technical workshops and student events.',
  'Develop communication, teamwork, creativity and leadership skills.',
]

const WORKSHOP_TICKER_ITEMS = REGISTRATIONS_OPEN ? [
  'Register for workshop now!',
  'CLICK NOW',
] : ['Sumshodhini 2026 has concluded', 'Thank you for participating!']

export default function Home() {
  useDocumentTitle('IT Department | KITSW', { raw: true })

  return (
    <>
      <a
        className={s.workshopTicker}
        href={REGISTRATIONS_OPEN ? '/register?event=llm&from=workshops' : '/gallery'}
        aria-label={REGISTRATIONS_OPEN ? 'Register for workshop now' : 'View the event gallery'}
      >
        <span className={s.workshopTickerTrack} aria-hidden="true">
          {[0, 1].map((group) => (
            <span className={s.workshopTickerGroup} key={group}>
              {WORKSHOP_TICKER_ITEMS.map((label, index) => (
                <span className={s.workshopTickerItem} key={`${group}-${index}`}>
                  {label}
                </span>
              ))}
            </span>
          ))}
        </span>
      </a>

      {/* HERO */}
      <section className={s.hero} aria-labelledby="home-title">
        <div className={s.heroContainer}>
          <div className={s.heroContent}>
            <h1 id="home-title">
              <span className={s.titleLead}>Department of</span>
              <span className={s.titleAccent}>
                Information Technology
              </span>
            </h1>

            <p className={s.heroDescription}>
              The IT Department helps students explore emerging technologies,
              strengthen their computing skills, and turn creative ideas into
              practical solutions. Through workshops, collaborative projects,
              and technical events, students gain real experience, share ideas,
              and prepare for future careers.
            </p>

            <p className={s.heroMotto}>Learn. Connect. Grow.</p>

            <div className={s.heroButtons}>
              <Link to="/about" className="btn btn-primary">
                Explore IT Department{' '}
                <span aria-hidden="true">→</span>
              </Link>

              <Link to="/sumshodhini" className="btn btn-outline">
                Explore {SITE.fest}{' '}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <dl className={s.heroStats}>
              {STATS.map((stat, index) => (
                <div key={stat.label} className={s.heroStatGroup}>
                  {index > 0 && (
                    <span
                      className={s.heroStatDivider}
                      aria-hidden="true"
                    />
                  )}

                  <div className={s.heroStat}>
                    <dt className="visually-hidden">{stat.label}</dt>

                    <dd>
                      <strong>{stat.value}</strong>

                      <span aria-hidden="true">{stat.label}</span>
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <IdCard3D />
        </div>
      </section>

      {/* DEPARTMENT HIGHLIGHTS */}
      <AssociationHighlights />

      {/* IT DEPARTMENT GROUP PHOTO */}
      <section
        className={`section ${s.groupPhotoSection}`}
        aria-labelledby="it-group-photo-title"
      >
        <div className="container">
          <h2 id="it-group-photo-title">
            IT Department{' '}
            <span className="text-primary">Group Photo</span>
          </h2>

          <img
            src={itDepartmentGroup}
            alt="IT Department faculty and students at the group event"
            className={s.groupPhoto}
            loading="lazy"
          />
        </div>
      </section>

      {/* ABOUT */}
      <section
        className="section"
        aria-labelledby="home-about-title"
      >
        <div className="container">
          <div className={s.aboutGrid}>
            <div className={s.brandPanel}>
              <div>
                <img
                  className={s.aboutLogoMark}
                  src={LOGO.large}
                  width="180"
                  height="187"
                  loading="lazy"
                  alt={LOGO.alt}
                />

                <div className={s.panelTitle}>
                  {SITE.nameUpper}
                </div>
              </div>
            </div>

            <div className={s.aboutContent}>
              <p className="section-label">
                ABOUT THE IT DEPARTMENT
              </p>

              <h2 id="home-about-title">
                A platform for{' '}
                <span className="text-primary">
                  future technologists.
                </span>
              </h2>

              <p>
                The IT Department is a student-driven platform
                of the Information Technology branch that brings
                together technical learning, practical
                experiences, workshops, events and creative
                ideas.
              </p>

              <p>
                Through every academic year, the Department
                provides opportunities for students to learn new
                technologies, build practical skills, participate
                in activities and experience technology beyond
                the classroom.
              </p>

              <ul className={s.aboutList}>
                {ABOUT_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className={s.actions}>
                <Link
                  to="/about"
                  className="btn btn-primary"
                >
                  Explore IT association{' '}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUMSHODHINI */}
      <section
        className="section"
        aria-labelledby="home-fest-title"
      >
        <div className="container">
          <div className={s.aboutGrid}>
            <div className={s.brandPanel}>
              <div>
                <div className={s.festLogoCircle}>
                  <ImageWithFallback
                    imageKey="sumshodhini/id-card-logo"
                    alt={`${SITE.festUpper} ${SITE.year} logo`}
                    className={s.festLogoMark}
                    loading="lazy"
                  />
                </div>

                <div className={s.panelTitle}>
                  {SITE.festUpper}
                </div>

                <div className={s.panelSubtitle}>
                  WORKSHOPS · EVENTS
                </div>
              </div>
            </div>

            <div className={s.aboutContent}>
              <p className="section-label">
                ANNUAL IT BRANCH EVENT
              </p>

              <h2 id="home-fest-title">
                Experience{' '}
                <span className="text-primary">
                  {SITE.fest}.
                </span>
              </h2>

              <p>
                {SITE.fest} is the annual event of the IT
                branch, bringing together technical workshops
                and engaging student events in a two-day
                technology-focused experience.
              </p>

              <ul className={s.aboutList}>
                <li>
                  <span>
                    <strong>Day 01 — Workshops</strong>
                    <br />
                    Learn through practical,
                    technology-focused workshops.
                  </span>
                </li>

                <li>
                  <span>
                    <strong>Day 02 — Events</strong>
                    <br />
                    Participate in different technical
                    and engaging events.
                  </span>
                </li>

                <li>
                  Explore new ideas and technologies through
                  hands-on experiences.
                </li>

                <li>
                  Take part in activities designed to develop
                  technical and creative skills.
                </li>
              </ul>

              <div className={s.actions}>
                <Link
                  to="/sumshodhini"
                  className="btn btn-primary"
                >
                  Explore {SITE.fest}{' '}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CALL TO ACTION */}
      <section
        className="section"
        aria-labelledby="home-cta-title"
      >
        <div className="container">
          <div className={s.cta}>
            <p className={s.ctaKicker}>
              LEARN · CONNECT · GROW
            </p>

            <h2 id="home-cta-title">
              Learn today. Connect through experience. Grow together.
            </h2>

            <p>
              Discover the IT Department, explore{' '}
              {SITE.fest} and take part in the workshops and
              events created for the Information Technology
              branch.
            </p>

            <div className={s.actions}>
              <Link
                to="/sumshodhini"
                className="btn btn-light"
              >
                Explore {SITE.fest}{' '}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
