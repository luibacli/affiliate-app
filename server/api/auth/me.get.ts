import { getAuthSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const session = await getAuthSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'Not authenticated' })
  return session
})
