import type { H3Event } from 'h3'

export function requireAdmin(event: H3Event) {
  const { adminKey } = useRuntimeConfig()
  if (!adminKey) throw createError({ statusCode: 500, message: 'Admin key not configured' })
  const key = getHeader(event, 'x-admin-key')
  if (key !== adminKey) throw createError({ statusCode: 401, message: 'Unauthorized' })
}
