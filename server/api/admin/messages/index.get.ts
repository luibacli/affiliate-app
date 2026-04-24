import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { ContactMessage } from '../../../models/contactMessage'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  await connectDB()

  const q = getQuery(event)
  const page = Math.max(1, Number(q.page) || 1)
  const limit = 20
  const unreadOnly = q.unread === 'true'

  const filter = unreadOnly ? { read: false } : {}

  const [messages, total, unreadCount] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ read: false }),
  ])

  return { messages, total, unreadCount, page, totalPages: Math.ceil(total / limit) }
})
