import type { H3Event } from 'h3'
import { getRedis } from './redis'

const COOKIE = 'ph_sid'
const TTL = 60 * 60 * 24 * 7 // 7 days

export type SessionUser = {
  userId: string
  role: 'super_admin'
  name: string
  email: string
}

export async function createSession(event: H3Event, user: SessionUser): Promise<void> {
  const id = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
  try {
    await getRedis().setex(`session:${id}`, TTL, JSON.stringify(user))
  } catch {
    throw createError({ statusCode: 500, message: 'Session store unavailable' })
  }
  setCookie(event, COOKIE, id, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    maxAge: TTL,
    path: '/',
  })
}

export async function getSession(event: H3Event): Promise<SessionUser | null> {
  const id = getCookie(event, COOKIE)
  if (!id) return null
  try {
    const raw = await getRedis().get(`session:${id}`)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export async function destroySession(event: H3Event): Promise<void> {
  const id = getCookie(event, COOKIE)
  if (id) {
    try { await getRedis().del(`session:${id}`) } catch {}
  }
  deleteCookie(event, COOKIE, { path: '/' })
}
