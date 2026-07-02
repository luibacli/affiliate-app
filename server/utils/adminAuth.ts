import type { H3Event } from 'h3'
import { getAuthSession } from './session'
import { cacheIncr } from './redis'

async function rateLimit(event: H3Event) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:admin:${ip}`, 60)
  if (hits > 60) throw createError({ statusCode: 429, message: 'Too many requests' })
}

export async function requireAdmin(event: H3Event) {
  await rateLimit(event)
  const session = await getAuthSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })
}

export async function requireSuperAdmin(event: H3Event) {
  await rateLimit(event)
  const session = await getAuthSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })
  if (session.role !== 'super_admin') throw createError({ statusCode: 403, message: 'Forbidden' })
}
