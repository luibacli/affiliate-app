import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/db'
import { User } from '../../models/user'

export default defineEventHandler(async (event) => {
  await connectDB()

  const count = await User.countDocuments()
  if (count > 0) {
    throw createError({ statusCode: 409, message: 'Admin user already exists. Use the login page.' })
  }

  const body = await readBody(event)
  const { username, email, name, password } = body ?? {}

  if (!username || !email || !name || !password) {
    throw createError({ statusCode: 400, message: 'All fields are required: username, email, name, password.' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters.' })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await User.create({
    username: username.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash,
    role: 'super_admin',
  })

  return { ok: true, message: 'Admin account created. You can now log in.' }
})
