import bcrypt from 'bcryptjs'
import { requireSuperAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { User } from '../../../models/user'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  await connectDB()

  const body = await readBody(event)
  const { username, email, name, password, role } = body ?? {}

  if (!username || !email || !name || !password) {
    throw createError({ statusCode: 400, message: 'username, email, name, and password are required.' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters.' })
  }

  if (role && !['super_admin', 'admin'].includes(role)) {
    throw createError({ statusCode: 400, message: 'Invalid role.' })
  }

  const exists = await User.exists({ $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] })
  if (exists) throw createError({ statusCode: 409, message: 'Username or email already in use.' })

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash,
    role: role ?? 'admin',
  })

  const { passwordHash: _, ...safe } = user.toObject()
  return safe
})
