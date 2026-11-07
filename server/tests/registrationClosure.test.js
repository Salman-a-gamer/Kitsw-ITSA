import assert from 'node:assert/strict'
import { after, before, mock, test } from 'node:test'
import { createServer } from 'node:http'
import express from 'express'
import { REGISTRATIONS_OPEN, REGISTRATION_CLOSED_MESSAGE } from '../../shared/registrationStatus.js'

let mutations = 0
const mutation = () => { mutations += 1; throw new Error('Closed registration must not perform a mutation') }
mock.module(new URL('../controllers/registrationController.js', import.meta.url).href, { namedExports: {
  createRegistration: mutation,
  getPublicRegistrationCount: (req, res) => res.json({ count: 5 }),
} })
mock.module(new URL('../controllers/abstractUploadController.js', import.meta.url).href, { namedExports: {
  startAbstractUpload: mutation, uploadAbstractChunk: mutation,
} })
const { default: router } = await import('../routes/registrationRoutes.js')
const app = express()
app.use(express.json())
app.use('/api/registrations', router)
app.use('/registrations', router)
// Closure must be scoped to public registrations; admin verification stays available.
app.post('/api/admin/status', (req, res) => res.json({ available: true }))
const server = createServer(app)
let origin
before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${server.address().port}`
})
after(async () => { await new Promise((resolve) => server.close(resolve)) })

test('all registration and document-upload API aliases reject new submissions without storage calls', async () => {
  assert.equal(REGISTRATIONS_OPEN, false)
  for (const prefix of ['/api/registrations', '/registrations']) {
    for (const path of ['', '/', '/abstract-uploads', '/abstract-uploads/chunk']) {
      const response = await fetch(origin + prefix + path, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId: 'llm' }),
      })
      assert.equal(response.status, 403, prefix + path)
      assert.equal(response.headers.get('cache-control'), 'no-store')
      assert.deepEqual(await response.json(), { success: false, code: 'REGISTRATIONS_CLOSED', message: REGISTRATION_CLOSED_MESSAGE })
    }
  }
  assert.equal(mutations, 0)
})

test('registration counts and admin payment verification remain reachable', async () => {
  assert.equal((await fetch(origin + '/api/registrations/counts/llm')).status, 200)
  assert.equal((await fetch(origin + '/api/admin/status', { method: 'POST' })).status, 200)
})
