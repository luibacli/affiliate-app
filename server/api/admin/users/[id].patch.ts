import bcrypt from 'bcryptjs'
import { requireSuperAdmin } from '../../../utils/adminAuth'
import { getAuthSession } from '../../../utils/session'
import { connectDB } from '../../../utils/db'
import { User } from '../../../models/user'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, email, role, password } = body ?? {}

  if (role && !['super_admin', 'admin'].includes(role)) {
    throw createError({ statusCode: 400, message: 'Invalid role.' })
  }

  const session = await getAuthSession(event)
  const user = await User.findById(id)
  if (!user) throw createError({ statusCode: 404, message: 'User not found.' })

  // Prevent a super_admin from demoting themselves
  if (session?.userId === String(user._id) && role && role !== 'super_admin') {
    throw createError({ statusCode: 400, message: 'You cannot change your own role.' })
  }

  const updates: Record<string, any> = {}
  if (name) updates.name = name.trim()
  if (email) updates.email = email.toLowerCase().trim()
  if (role) updates.role = role
  if (password) {
    if (password.length < 8) throw createError({ statusCode: 400, message: 'Password must be at least 8 characters.' })
    updates.passwordHash = await bcrypt.hash(password, 12)
  }

  const updated = await User.findByIdAndUpdate(id, updates, { new: true, select: '-passwordHash' })
  return updated
})
