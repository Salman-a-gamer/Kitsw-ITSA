/**
 * Payment presentation configuration.
 *
 * QR images are intentionally referenced by asset keys only. Until the real
 * QR images are uploaded, the registration UI shows an explicit placeholder
 * and never presents a fake payment code as usable.
 */
export const PAYMENT_SUPPORT_PHONE = '+91 6304412730'

export const PAYMENT_QR_CONFIG = {
  llm: {
    qr: 'qr/workshop-2026',
    qrAlt: 'Workshop payment QR code placeholder',
    qrFallbackText: 'WORKSHOP QR — UPLOAD REAL QR IMAGE',
  },
  'code-build': {
    qr: 'qr/ppt-presentation-2026',
    qrAlt: 'PPT Presentation payment QR for Gullepelli Varshith',
    qrFallbackText: 'PPT PRESENTATION PAYMENT QR UNAVAILABLE',
  },
  innovation: {
    qr: 'qr/innovation-2026',
    qrAlt: 'IT Innovation Challenge payment QR code placeholder',
    qrFallbackText: 'INNOVATION QR — UPLOAD REAL QR IMAGE',
  },
  'cyber-quest': {
    qr: 'qr/technomyst-2026',
    qrAlt: 'Technomyst payment QR for Mantha Hyndavi',
    qrFallbackText: 'TECHNOMYST PAYMENT QR UNAVAILABLE',
  },
  'design-deploy': {
    qr: 'qr/design-deploy-2026',
    qrAlt: 'Design to Deploy payment QR code placeholder',
    qrFallbackText: 'DESIGN TO DEPLOY QR — UPLOAD REAL QR IMAGE',
  },
  'tech-connect': {
    qr: 'qr/tech-connect-2026',
    qrAlt: 'GLITCH AND GIGGLES payment QR code placeholder',
    qrFallbackText: 'GLITCH AND GIGGLES QR — UPLOAD REAL QR IMAGE',
  },
  event6: {
    qr: 'qr/ai-trinity-2026',
    qrAlt: 'AI TRINITY payment QR code placeholder',
    qrFallbackText: 'AI TRINITY QR — UPLOAD REAL QR IMAGE',
  },
  event7: {
    qr: 'qr/event7-2026',
    qrAlt: 'App Innovators payment QR code placeholder',
    qrFallbackText: 'APP INNOVATORS QR — UPLOAD REAL QR IMAGE',
  },
  event8: {
    qr: 'qr/event8-2026',
    qrAlt: 'Data Quest payment QR code placeholder',
    qrFallbackText: 'DATA QUEST QR — UPLOAD REAL QR IMAGE',
  },
  event9: {
    qr: 'qr/event9-2026',
    qrAlt: 'Pixel Perfect payment QR code placeholder',
    qrFallbackText: 'PIXEL PERFECT QR — UPLOAD REAL QR IMAGE',
  },
  event10: {
    qr: 'qr/event10-2026',
    qrAlt: 'Tech Trivia payment QR code placeholder',
    qrFallbackText: 'TECH TRIVIA QR — UPLOAD REAL QR IMAGE',
  },
}

export const PAYMENT_QR_BY_DAY = {
  day1: PAYMENT_QR_CONFIG.llm,
  day2: PAYMENT_QR_CONFIG['code-build'],
}

export function getPaymentQr(eventId, dayKey) {
  return PAYMENT_QR_CONFIG[eventId] ?? PAYMENT_QR_BY_DAY[dayKey] ?? null
}
