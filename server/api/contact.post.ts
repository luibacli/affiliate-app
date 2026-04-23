import { cacheIncr } from '../utils/redis'

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

  // Log to server console — wire up email/webhook here when ready
  console.info(`[Contact] from=${email} subject=${subject ?? 'general'} name=${name}`)

  return { ok: true }
})
