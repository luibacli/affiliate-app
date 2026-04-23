import type { H3Event } from 'h3'

export function requireAdmin(event: H3Event) {
  const { adminKey } = useRuntimeConfig()
  if (!adminKey) return
  const key = getHeader(event, 'x-admin-key') || (getQuery(event).key as string)
  if (key !== adminKey) throw createError({ statusCode: 401, message: 'Unauthorized' })
}
