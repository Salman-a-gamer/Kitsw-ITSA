export const HACKATHON = {
  name: 'Build Warangal',
  organizer: 'IT Association · KITS Warangal',
  confirmed: false,
  venue: 'KITS Warangal · room to be announced',
  prizePool: null,
  minTeam: 2,
  maxTeam: 4,
  dates: {
    registrationOpens: null, registrationCloses: null, kickoff: null,
    submissionsOpen: null, submissionDeadline: null, demos: null,
  },
  tracks: [
    { id: 'applied-ai', title: 'Applied AI', prompt: 'Build a useful AI workflow that is reliable, explainable and grounded in a real need.', tag: 'ML / AUTOMATION' },
    { id: 'campus-civic', title: 'Campus & Civic Tech', prompt: 'Solve an everyday problem for students, educators or communities around Warangal.', tag: 'COMMUNITY / ACCESS' },
    { id: 'open-innovation', title: 'Open Innovation', prompt: 'Pitch a problem beyond the other tracks and make a working prototype that shows why it matters.', tag: 'OPEN / PRODUCT' },
  ],
  schedule: [
    ['registrationOpens', 'Registration opens', 'Create a team and activate each member’s account.'],
    ['kickoff', 'Kickoff & build', 'Attend the briefing, confirm your track and start building.'],
    ['submissionDeadline', 'Submission deadline', 'Save your draft early. Your captain locks the final entry.'],
    ['demos', 'Demos & judging', 'Show what works and explain the decisions your team made.'],
  ],
  rubric: [['Impact', 30], ['Technical execution', 30], ['Originality', 25], ['Demo & communication', 15]],
}

export function eventDate(value) {
  const date = Date.parse(value)
  if (!Number.isFinite(date)) return 'To be announced'
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(date) + ' IST'
}

export const PROJECT_FIELDS = [
  { key: 'title', label: 'Project name', max: 100, placeholder: 'Give your project a name' },
  { key: 'summary', label: 'Project overview', max: 5000, multiline: true, placeholder: 'What problem did you solve, for whom, and how does your solution work?' },
  { key: 'repository', label: 'GitHub repository', max: 500, url: true, placeholder: 'https://github.com/team/project' },
  { key: 'demo', label: 'Live demo', max: 500, url: true, placeholder: 'https://your-project.example' },
  { key: 'video', label: 'Demo video', max: 500, url: true, placeholder: 'https://…' },
  { key: 'tools', label: 'Tools and technologies', max: 500, placeholder: 'React, PostgreSQL, Python…' },
]

export function windowOpen(start, end, now = Date.now()) {
  if (!start || !end) return false
  const from = Date.parse(start), until = Date.parse(end)
  return Number.isFinite(from) && Number.isFinite(until) && now >= from && now < until
}
