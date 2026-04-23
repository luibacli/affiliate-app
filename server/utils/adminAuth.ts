import crypto from 'node:crypto'
import type { H3Event } from 'h3'
import { cacheIncr } from './redis'

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  // Always run comparison to avoid length-based timing leak
  const padded = Buffer.alloc(Math.max(bufA.length, bufB.length))
  bufA.copy(padded)
  const padB = Buffer.alloc(padded.length)
  bufB.copy(padB)
  return bufA.length === bufB.length && crypto.timingSafeEqual(padded, padB)
}

export async function requireAdmin(event: H3Event) {
  const { adminKey } = useRuntimeConfig()
  if (!adminKey) throw createError({ statusCode: 500, message: 'Admin key not configured' })

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:admin:${ip}`, 60)
  if (hits > 30) throw createError({ statusCode: 429, message: 'Too many requests' })

  const key = getHeader(event, 'x-admin-key') ?? ''
  if (!timingSafeEqual(key, adminKey)) throw createError({ statusCode: 401, message: 'Unauthorized' })
}
