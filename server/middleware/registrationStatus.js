import { REGISTRATIONS_OPEN, REGISTRATION_CLOSED_MESSAGE } from '../../shared/registrationStatus.js'

export function requireOpenRegistrations(req, res, next) {
  if (REGISTRATIONS_OPEN) return next()
  return res.set('Cache-Control', 'no-store').status(403).json({
    success: false, code: 'REGISTRATIONS_CLOSED', message: REGISTRATION_CLOSED_MESSAGE,
  })
}
