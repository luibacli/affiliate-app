import mongoose from 'mongoose'
import { connectDB } from '../utils/db'
import { getRedis } from '../utils/redis'

export default defineEventHandler(async (event) => {
  let db = 'ok'
  let redis = 'ok'

  try {
    if (mongoose.connection.readyState < 1) await connectDB()
    if (mongoose.connection.readyState < 1) db = 'error'
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
