import { REGISTRATIONS_OPEN } from '../../shared/registrationStatus'

// Primary navigation (legacy navbar.js order).
export const MAIN_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/sumshodhini', label: 'Sumshodhini' },
  { to: '/about', label: "Student's Association" },
  { to: '/gallery', label: 'Gallery' },
]

export const REGISTER_LINK = { to: '/register', label: REGISTRATIONS_OPEN ? 'Register' : 'Registrations closed' }

// Footer columns for the site's secondary navigation.
export const FOOTER_COLUMNS = [
  {
    title: 'Quick Links',
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About Association' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Sumshodhini',
    links: [
      { to: '/sumshodhini', label: 'Sumshodhini' },
      { to: '/workshops', label: 'Workshops' },
      { to: '/events', label: 'Events' },
      { to: '/register', label: 'Registration' },
    ],
  },
]
