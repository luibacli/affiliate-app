import { connectDB, isDBReady } from '../utils/db'
import { getRedis } from '../utils/redis'

export default defineEventHandler(async (event) => {
  let db = 'ok'
  let redis = 'ok'

  try {
    // isDBReady() means readyState === 1. The old check accepted readyState 2
    // ("connecting") as healthy, so a cluster mid-handshake reported ok.
    if (!isDBReady()) await connectDB()
    if (!isDBReady()) db = 'error'
  } catch {
    db = 'error'
  }

  try {
    await getRedis().ping()
  } catch {
    redis = 'error'
  }

  const healthy = db === 'ok' && redis === 'ok'
  setResponseStatus(event, healthy ? 200 : 503)

  return {
    status: healthy ? 'ok' : 'degraded',
    db,
    redis,
    uptime: process.uptime(),
    ts: new Date().toISOString(),
  }
})
