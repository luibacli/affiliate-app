import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/db'
import { User } from '../../models/user'
import { createSession } from '../../utils/session'
import { cacheIncr } from '../../utils/redis'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:login:${ip}`, 900)
  if (hits > 20) throw createError({ statusCode: 429, message: 'Too many login attempts. Try again in 15 minutes.' })

  const body = await readBody(event)
  const { email, password } = body ?? {}

  if (!email || !password) throw createError({ statusCode: 400, message: 'Email and password are required.' })

  await connectDB()

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) throw createError({ statusCode: 401, message: 'Invalid email or password.' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw createError({ statusCode: 401, message: 'Invalid email or password.' })

  await createSession(event, {
    userId: String(user._id),
    role: user.role as 'super_admin' | 'partner',
    name: user.name,
    email: user.email,
  })

  return { ok: true, role: user.role }
})
