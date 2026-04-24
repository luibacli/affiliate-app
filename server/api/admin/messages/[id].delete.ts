import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { ContactMessage } from '../../../models/contactMessage'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  await connectDB()
  await ContactMessage.findByIdAndDelete(id)
  return { ok: true }
})
