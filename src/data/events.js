/*
  Sumshodhini 2026 — single source of truth for workshops and events.
*/

import {
  Brain,
  CalendarDays,
  CodeXml,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Trophy,
  Lock,
  Users,
  Wrench,
  Radio,
  Sparkles,
} from 'lucide-react'
import { getPaymentQr } from './payment'
import { PPT_TEAM_FEE } from '../../shared/pptRegistration'
import { REGISTRATIONS_OPEN } from '../../shared/registrationStatus'

export const REGISTRATION_DAYS = {
  day1: {
    key: 'day1',
    number: '01',
    label: 'DAY 01 · WORKSHOPS',
    shortLabel: 'DAY 01',
    title: 'Workshops',
    selectorDescription: 'Register for the workshops scheduled on Day 1.',
    selectorAction: 'Continue to workshops',
    icon: Wrench,
    heading: 'Register for Day 1 Workshops',
    description:
      'Enter your details carefully. They will be used for workshop registration and payment verification.',
    paymentTitle: 'Day 1 Workshops',
    paymentDescription:
      'Scan the workshop payment QR, complete the payment, and keep your transaction reference ready.',
    ...getPaymentQr('llm', 'day1'),
  },
  day2: {
    key: 'day2',
    number: '02',
    label: 'DAY 02 · EVENTS',
    shortLabel: 'DAY 02',
    title: 'Events',
    selectorDescription: 'Choose one of the events available on Day 2.',
    selectorAction: 'View event options',
    icon: CalendarDays,
    heading: 'Choose a Day 2 Event',
    description: 'Select the event you want to register for.',
    paymentTitle: 'Day 2 Events',
    paymentDescription: 'Each Day-2 event can use its own configured payment QR.',
    ...getPaymentQr('code-build', 'day2'),
  },
}

const openEventDefaults = {
  status: REGISTRATIONS_OPEN ? 'open' : 'closed',
  statusLabel: REGISTRATIONS_OPEN ? 'REGISTRATION OPEN' : 'EVENT CONCLUDED',
  registrationEnabled: REGISTRATIONS_OPEN,
}

export const EVENTS = [
  {
    id: 'llm',
    day: 'day1',
    type: 'workshop',
    number: '01',
    category: 'Artificial Intelligence & Intelligent Automation',
    title:
      'Industry-Driven AI: Prompt, Build, Deploy with LLMs and Intelligent Automation',
    description:
      'Explore industry-driven AI through prompt engineering, building with LLMs, deployment and intelligent automation.',
    icon: Brain,
    date: '2026 · Coming Soon',
    meta: { icon: MapPin, label: 'IT Department' },
    fee: 500,
    ...openEventDefaults,
    formHeading: 'Register for Industry-Driven AI',
    formDescription:
      'Complete the registration form for Industry-Driven AI: Prompt, Build, Deploy with LLMs and Intelligent Automation.',
    poster: 'posters/llm-poster',
    posterAlt: 'Industry-Driven AI workshop poster',
    ...getPaymentQr('llm', 'day1'),
    workshop: {
      titleLead: 'Industry-Driven AI: Prompt,',
      titleStrong: 'Build, Deploy with LLMs and\nIntelligent Automation',
      description:
        'A hands-on workshop exploring industry-driven AI, prompt engineering, building and deploying solutions with Large Language Models, and intelligent automation.',
      facts: [
        { label: 'DATE', value: 'Oct 30th, 2026' },
        { label: 'MODE', value: 'On Campus' },
        { label: 'LEVEL', value: 'Beginner Friendly' },
      ],
      due: {
        label: 'DUE',
        value: '2026',
        note: 'Registration window open',
      },
    },
  },
  {
    id: 'code-build',
    day: 'day2',
    type: 'event',
    number: '01',
    category: 'PRESENTATION',
    title: 'PPT Presentation',
    description: 'Showcase innovative ideas, creativity and knowledge at the PPT Presentation Event on 31 October 2026. Present your ideas, share your knowledge and inspire the future.',
    selectorDescription: 'One or two participants · ₹200 per team · 31 October 2026.',
    icon: Lightbulb,
    date: '31 October 2026',
    meta: { icon: Users, label: '1–2 participants · ₹200/team' },
    fee: PPT_TEAM_FEE,
    ...openEventDefaults,
    formHeading: 'Register for PPT Presentation',
    formDescription: 'Showcase your ideas, creativity and knowledge on 31 October 2026. Build confidence, critical thinking and communication skills while sharing innovative thoughts. Register solo or with one teammate for ₹200 per team, enter your topic and upload your abstract as a PDF or DOCX document.',
    coordinators: [
      { name: 'G. Varshith', phone: '6305737322' },
      { name: 'P. Sindhuja', phone: '7993088577' },
    ],
    poster: 'posters/code-build-poster',
    posterAlt: 'PPT Presentation event poster',
    ...getPaymentQr('code-build', 'day2'),
  },
  {
    id: 'innovation',
    day: 'day2',
    type: 'event',
    number: '02',
    category: 'TECHNICAL EVENT',
    title: 'Techthon',
    description: 'Take part in Techthon, a technical event for student teams.',
    selectorDescription: 'Register for Techthon.',
    icon: CodeXml,
    date: '2026 · TBD',
    meta: { icon: Trophy, label: 'Challenge' },
    fee: 49,
    coordinators: [{ name: 'Md.Shekeel', phone: '9542671213' }],
    ...openEventDefaults,
    formHeading: 'Register for Techthon',
    formDescription: 'Complete the registration form for Techthon.',
    poster: 'posters/innovation-poster',
    posterAlt: 'Techthon event poster',
    ...getPaymentQr('innovation', 'day2'),
  },
  {
    id: 'cyber-quest',
    day: 'day2',
    type: 'event',
    number: '03',
    category: 'TECHNICAL EVENT',
    title: 'Technomyst',
    description: 'Join Technomyst and take on its technology-themed challenges.',
    selectorDescription: 'Register for Technomyst.',
    icon: ShieldCheck,
    date: '2026 · TBD',
    meta: { icon: Lock, label: 'Challenge' },
    fee: 70,
    coordinators: [
      { name: 'M.Hyndavi', phone: '9059048196' },
      { name: 'P.Sri Vaishnavi', phone: '7386233604' },
    ],
    ...openEventDefaults,
    formHeading: 'Register for Technomyst',
    formDescription: 'Complete the registration form for Technomyst.',
    poster: 'posters/cyber-quest-poster',
    posterAlt: 'Technomyst event poster',
    ...getPaymentQr('cyber-quest', 'day2'),
  },
  {
    id: 'design-deploy',
    day: 'day2',
    type: 'event',
    number: '04',
    category: 'CODING & AI',
    title: 'AlgoCodex & AI',
    description: 'Explore algorithms and AI through AlgoCodex & AI.',
    selectorDescription: 'Register for AlgoCodex & AI.',
    icon: CodeXml,
    date: '2026 · TBD',
    meta: { icon: Users, label: 'Students' },
    fee: 70,
    coordinators: [{ name: 'G. Akhil', phone: '8309067006' }],
    ...openEventDefaults,
    formHeading: 'Register for AlgoCodex & AI',
    formDescription: 'Complete the registration form for AlgoCodex & AI.',
    poster: 'posters/design-deploy-poster',
    posterAlt: 'AlgoCodex & AI event poster',
    ...getPaymentQr('design-deploy', 'day2'),
  },
  {
    id: 'tech-connect',
    day: 'day2',
    type: 'event',
    number: '05',
    category: 'FUN EVENT',
    title: 'GLITCH AND GIGGLES',
    description: 'Join GLITCH AND GIGGLES for a fun, technology-themed experience.',
    selectorDescription: 'Register for GLITCH AND GIGGLES · ₹70.',
    icon: Radio,
    date: '2026 · TBD',
    meta: { icon: Users, label: 'Students' },
    fee: 70,
    coordinators: [
      { name: 'M. K. Moin', phone: '95739 09701' },
      { name: 'Muqeeth', phone: '8179468516' },
    ],
    ...openEventDefaults,
    formHeading: 'Register for GLITCH AND GIGGLES',
    formDescription: 'Complete the registration form for GLITCH AND GIGGLES. Registration fee: ₹70.',
    poster: 'posters/tech-connect-poster',
    posterAlt: 'GLITCH AND GIGGLES event poster',
    ...getPaymentQr('tech-connect', 'day2'),
  },
  {
    id: 'event6',
    day: 'day2',
    type: 'event',
    number: '06',
    category: 'SPECIAL EVENT',
    title: 'AI TRINITY',
    description: 'Explore three sides of artificial intelligence at AI TRINITY.',
    selectorDescription: 'Register for AI TRINITY · ₹70.',
    icon: Sparkles,
    date: '2026 · TBD',
    meta: { icon: Users, label: 'Students' },
    fee: 70,
    coordinators: [
      { name: 'J. Amulya', phone: '8519899204' },
      { name: 'K. Varshith', phone: '9490186366' },
    ],
    ...openEventDefaults,
    formHeading: 'Register for AI TRINITY',
    formDescription: 'Complete the registration form for AI TRINITY. Registration fee: ₹70.',
    poster: 'posters/ai-trinity-poster',
    posterAlt: 'AI TRINITY event poster',
    ...getPaymentQr('event6', 'day2'),
  },
  {
    id: 'event7',
    day: 'day2',
    type: 'event',
    number: '07',
    category: 'TECHNICAL EVENT',
    title: 'NEXORA',
    description: 'Take part in NEXORA, a technology-focused student event.',
    selectorDescription: 'Register for NEXORA · ₹70.',
    icon: CodeXml,
    date: '2026 · TBD',
    meta: { icon: Users, label: 'Students' },
    fee: 70,
    coordinators: [
      { name: 'Tejasri', phone: '8074922181' },
      { name: 'K. Sathwik', phone: '9492792166' },
    ],
    ...openEventDefaults,
    formHeading: 'Register for NEXORA',
    formDescription: 'Complete the registration form for NEXORA. Registration fee: ₹70.',
    poster: 'posters/event7-poster',
    posterAlt: 'NEXORA event poster',
    ...getPaymentQr('event7', 'day2'),
  },
  {
    id: 'event8',
    day: 'day2',
    type: 'event',
    number: '08',
    category: 'SPECIAL EVENT',
    title: 'INFUSION',
    description: 'Join INFUSION for a day of technology and collaboration.',
    selectorDescription: 'Register for INFUSION.',
    icon: Lightbulb,
    date: '2026 · TBD',
    meta: { icon: Users, label: 'Students' },
    fee: 50,
    coordinators: [
      { name: 'S.Aditya', phone: '8367261027' },
      { name: 'Ganesh', phone: '7995991702' },
    ],
    ...openEventDefaults,
    formHeading: 'Register for INFUSION',
    formDescription: 'Complete the registration form for INFUSION.',
    poster: 'posters/event8-poster',
    posterAlt: 'INFUSION event poster',
    ...getPaymentQr('event8', 'day2'),
  },
]

export const DAY1_DEFAULT_EVENT_ID = 'llm'

export const getEvent = (id) =>
  EVENTS.find((event) => event.id === id) ?? null

export const eventsByDay = (day) =>
  EVENTS.filter((event) => event.day === day)

export const getDay = (key) =>
  REGISTRATION_DAYS[key] ?? null

export const hasVerifiedFee = (event) =>
  typeof event?.fee === 'number' &&
  Number.isFinite(event.fee) &&
  event.fee > 0

export const formatFee = (fee) =>
  `₹${fee.toLocaleString('en-IN')}`
