import { requireSuperAdmin } from '../../../utils/adminAuth'
import { getAuthSession } from '../../../utils/session'
import { connectDB } from '../../../utils/db'
import { User } from '../../../models/user'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const session = await getAuthSession(event)

  if (session?.userId === id) {
    throw createError({ statusCode: 400, message: 'You cannot delete your own account.' })
  }

  const user = await User.findByIdAndDelete(id)
  if (!user) throw createError({ statusCode: 404, message: 'User not found.' })

  return { ok: true }
})
