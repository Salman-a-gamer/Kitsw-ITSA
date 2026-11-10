import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { createHackathonApi } from './api.js'

const database = new PGlite('./.hackathon.local')
await database.exec(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'))
const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
const server = createHackathonApi({ getDb: () => database, secureCookie: false,
  settings: () => ({ registrationOpen: true, submissionsOpen: true, deadline }),
}).listen(5051, '127.0.0.1', () => console.log('Hackathon development API listening on http://127.0.0.1:5051 (local test data only)'))
const shutdown = () => server.close(() => { void database.close() })
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
