import bcrypt from 'bcryptjs'
import { connectDB } from '../../utils/db'
import { User } from '../../models/user'
import { SellerApplication } from '../../models/sellerApplication'
import { createSession } from '../../utils/session'
import { cacheIncr } from '../../utils/redis'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:register:${ip}`, 3600)
  if (hits > 5) throw createError({ statusCode: 429, message: 'Too many attempts. Try again later.' })

  const body = await readBody(event)
  const { name, email, password, businessName, niche, websiteUrl, description } = body ?? {}

  if (!name?.trim() || !email?.trim() || !password || !businessName?.trim() || !niche || !description?.trim()) {
    throw createError({ statusCode: 400, message: 'All required fields must be filled.' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters.' })
  }

  await connectDB()

  const existing = await User.findOne({ email: email.toLowerCase().trim() })
  if (existing) throw createError({ statusCode: 409, message: 'An account with this email already exists.' })

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash, role: 'partner' })

  await SellerApplication.create({
    userId: user._id,
    businessName: businessName.trim(),
    niche,
    websiteUrl: websiteUrl?.trim() || undefined,
    description: description.trim(),
    status: 'submitted',
  })

  await createSession(event, {
    userId: String(user._id),
    role: 'partner',
    name: user.name,
    email: user.email,
  })

  return { ok: true }
})
