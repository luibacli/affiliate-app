import type { H3Event } from 'h3'
import { getSession, type SessionUser } from './session'

export async function requirePartner(event: H3Event): Promise<SessionUser> {
  const session = await getSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'Authentication required' })
  if (session.role !== 'partner' && session.role !== 'super_admin') {
    throw createError({ statusCode: 403, message: 'Partner access required' })
  }
  return session
}
