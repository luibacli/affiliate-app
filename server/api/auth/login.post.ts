import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/db'
import { User } from '../../models/user'
import { createSession } from '../../utils/session'
import { cacheIncr } from '../../utils/redis'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:login:${ip}`, 900)
  if (hits > 10) throw createError({ statusCode: 429, message: 'Too many login attempts. Try again in 15 minutes.' })

  const body = await readBody(event)
  const { username, password } = body ?? {}

  if (!username || !password) throw createError({ statusCode: 400, message: 'Username and password are required.' })

  await connectDB()

  const user = await User.findOne({ username: username.toLowerCase().trim() })
  if (!user) throw createError({ statusCode: 401, message: 'Invalid username or password.' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw createError({ statusCode: 401, message: 'Invalid username or password.' })

  await createSession(event, {
    userId: String(user._id),
    role: user.role as 'super_admin',
    username: user.username,
    name: user.name,
    email: user.email,
  })

  return { ok: true }
})
