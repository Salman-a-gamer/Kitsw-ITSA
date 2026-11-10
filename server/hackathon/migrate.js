import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { Client } from 'pg'

if (!process.env.HACKATHON_DATABASE_URL) throw new Error('Set HACKATHON_DATABASE_URL for the target hackathon database.')
const db = new Client({ connectionString: process.env.HACKATHON_DATABASE_URL })
try {
  await db.connect()
  await db.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'))
  console.log('Hackathon tables are ready.')
} finally { await db.end() }
