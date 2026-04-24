import { cacheIncr } from '../utils/redis'
import { connectDB } from '../utils/db'
import { ContactMessage } from '../models/contactMessage'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:contact:${ip}`, 3600)
  if (hits > 5) throw createError({ statusCode: 429, message: 'Too many requests' })

  const body = await readBody(event)
  const { name, email, subject, message } = body ?? {}

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, message: 'name, email, and message are required' })
  }
  if (String(email).length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    throw createError({ statusCode: 400, message: 'Invalid email address' })
  }
  if (String(message).length > 2000) {
    throw createError({ statusCode: 400, message: 'Message too long' })
  }

  await connectDB()
  await ContactMessage.create({
    name: String(name).slice(0, 100),
    email: String(email).slice(0, 254),
    subject: String(subject ?? 'general').slice(0, 50),
    message: String(message).slice(0, 2000),
    ip,
  })

  return { ok: true }
})
