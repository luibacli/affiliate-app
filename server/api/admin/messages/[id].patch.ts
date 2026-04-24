import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { ContactMessage } from '../../../models/contactMessage'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  const { read } = await readBody(event)

  await connectDB()
  await ContactMessage.findByIdAndUpdate(id, { $set: { read: !!read } })
  return { ok: true }
})
