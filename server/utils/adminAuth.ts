import type { H3Event } from 'h3'
import { getAuthSession } from './session'
import { cacheIncr } from './redis'

export async function requireAdmin(event: H3Event) {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:admin:${ip}`, 60)
  if (hits > 60) throw createError({ statusCode: 429, message: 'Too many requests' })

  const session = await getAuthSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })
}
