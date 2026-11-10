import { randomUUID } from 'node:crypto'
import express from 'express'
import helmet from 'helmet'
import { HACKATHON, windowOpen } from '../../shared/hackathon.js'
import * as service from './service.js'

const COOKIE = 'build_warangal_session'
const reads = new Set(['settings', 'workspace'])
const writes = new Set(['register', 'activate', 'login', 'logout', 'invite', 'draft', 'submit'])
const cookieValue = (req) => (req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1)
const normalEmail = (value) => typeof value === 'string' ? value.trim().toLowerCase().slice(0, 150) : ''
const problem = (status, message, code) => Object.assign(new Error(message), { status, code })

export function deployedSettings() {
  const dates = HACKATHON.dates
  return {
    registrationOpen: HACKATHON.confirmed && process.env.HACKATHON_ENABLE_REGISTRATION === 'true' && windowOpen(dates.registrationOpens, dates.registrationCloses),
    submissionsOpen: HACKATHON.confirmed && process.env.HACKATHON_ENABLE_SUBMISSIONS === 'true' && windowOpen(dates.submissionsOpen, dates.submissionDeadline),
    deadline: dates.submissionDeadline,
  }
}

export function createHackathonApi({ getDb, settings = deployedSettings, secureCookie = true, logger = console }) {
  const app = express()
  app.disable('x-powered-by')
  app.use(helmet())
  const options = { httpOnly: true, sameSite: 'lax', secure: secureCookie, path: '/api/hackathon' }
  app.use((req, res, next) => {
    const requestId = randomUUID(), start = Date.now()
    const action = req.method === 'GET' ? req.query.action || 'settings' : 'request'
    res.locals.requestId = requestId
    res.locals.action = reads.has(action) ? action : 'request'
    res.set({ 'Cache-Control': 'no-store', 'X-Request-Id': requestId, 'X-Robots-Tag': 'noindex' })
    res.on('finish', () => logger.info(JSON.stringify({ scope: 'hackathon', requestId, action: res.locals.action, status: res.statusCode, durationMs: Date.now() - start })))
    next()
  })
  app.use(express.json({ limit: '24kb' }))
  app.use(async (req, res) => {
    const input = req.body || {}
    const action = req.method === 'GET' ? req.query.action || 'settings' : input.action
    const policy = settings()
    if (req.method === 'POST') {
      if (!req.is('application/json')) throw problem(415, 'Use a JSON request.')
      if (req.headers.origin) {
        let origin
        try { origin = new URL(req.headers.origin) } catch { throw problem(403, 'Request origin is not allowed.') }
        if (origin.host !== req.headers.host || (secureCookie && origin.protocol !== 'https:')) throw problem(403, 'Request origin is not allowed.')
      }
      if (!writes.has(action)) throw problem(404, 'Action not found.')
    } else if (req.method !== 'GET' || !reads.has(action)) throw problem(404, 'Action not found.')
    res.locals.action = action
    const db = getDb()
    const availability = { available: Boolean(db), registrationOpen: Boolean(db && policy.registrationOpen), submissionsOpen: Boolean(db && policy.submissionsOpen), deadline: policy.deadline }
    if (action === 'settings') return res.json(availability)
    if (action === 'register' && !availability.registrationOpen) throw problem(403, 'Hackathon registration is not open.', 'REGISTRATION_CLOSED')
    if (!db) throw problem(503, 'Team accounts are not connected on this deployment. Use the sample workspace to explore.', 'WORKSPACE_UNAVAILABLE')
    if (action === 'register' || action === 'activate' || action === 'login') {
      const ip = req.ip || 'unknown'
      await service.throttle(db, action, `connection:${ip}`, action === 'register' ? 120 : 240, 10)
      const identity = action === 'login' ? normalEmail(input.email) : action === 'activate' ? String(input.token || '').slice(0, 80) : ''
      if (identity) await service.throttle(db, action, `account:${identity}`, 15, 10)
    }
    const setSession = (session) => res.cookie(COOKIE, session, { ...options, maxAge: service.SESSION_SECONDS * 1000 })
    if (action === 'register') {
      const { session, teamCode, invites } = await service.register(db, input)
      setSession(session)
      return res.status(201).json({ teamCode, invites })
    }
    if (action === 'activate' || action === 'login') {
      setSession(await service[action](db, input))
      return res.json({ success: true })
    }
    const session = cookieValue(req)
    if (action === 'logout') {
      await service.logout(db, session)
      return res.clearCookie(COOKIE, options).json({ success: true })
    }
    const member = await service.currentMember(db, session)
    if (action === 'workspace') return res.json({ ...await service.workspace(db, member), ...availability })
    if (action === 'invite') {
      await service.throttle(db, 'invite', member.id, 20, 10)
      return res.json(await service.rotateInvite(db, member, input.memberId))
    }
    if (!availability.submissionsOpen) throw problem(403, 'The submission window is closed.', 'SUBMISSIONS_CLOSED')
    return res.json({ project: await service.saveProject(db, member, input, action === 'submit', policy.deadline) })
  })
  // Never emit database details, passwords, invite tokens, session IDs, or payloads.
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500 ? error.status : 503
    if (status >= 500) logger.error(JSON.stringify({ scope: 'hackathon', requestId: res.locals.requestId, action: res.locals.action, event: 'request_failed' }))
    const message = status >= 500 ? (error.code === 'WORKSPACE_UNAVAILABLE' ? error.message : 'The team workspace is temporarily unavailable.') : error.type === 'entity.parse.failed' ? 'Invalid JSON request.' : error.message
    return res.status(status).json({ message, code: error.code && /^[A-Z_]+$/.test(error.code) ? error.code : undefined, requestId: res.locals.requestId })
  })
  return app
}
