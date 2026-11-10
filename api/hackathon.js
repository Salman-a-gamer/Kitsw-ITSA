import { createHackathonApi } from '../server/hackathon/api.js'
import { hackathonDatabase } from '../server/hackathon/db.js'

export default createHackathonApi({ getDb: hackathonDatabase })
