import { Pool } from 'pg'

let db
export function hackathonDatabase() {
  if (!process.env.HACKATHON_DATABASE_URL) return null
  if (!db) {
    const pool = new Pool({ connectionString: process.env.HACKATHON_DATABASE_URL, max: 3, connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000, statement_timeout: 8000 })
    pool.on('error', () => console.error(JSON.stringify({ scope: 'hackathon', action: 'database_pool_error' })))
    db = {
      query: (sql, params) => pool.query(sql, params),
      transaction: async (run) => {
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          const result = await run(client)
          await client.query('COMMIT')
          return result
        } catch (error) {
          try { await client.query('ROLLBACK') } catch { /* retain original error */ }
          throw error
        } finally { client.release() }
      },
    }
  }
  return db
}
