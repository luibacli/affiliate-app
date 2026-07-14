import { requireSuperAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { User } from '../../../models/user'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  await connectDB()

  const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 }).lean()
  return users
})
