import { connectDB } from '../../../utils/db'
import { SellerApplication } from '../../../models/sellerApplication'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  await connectDB()

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { action, note } = body ?? {}

  if (!['approve', 'reject', 'review'].includes(action)) {
    throw createError({ statusCode: 400, message: 'Invalid action. Use approve, reject, or review.' })
  }

  const app = await SellerApplication.findById(id)
  if (!app) throw createError({ statusCode: 404, message: 'Application not found' })

  const statusMap: Record<string, string> = {
    approve: 'approved',
    reject: 'rejected',
    review: 'under_review',
  }

  app.status = statusMap[action] as any
  if (note) app.reviewNote = note
  app.reviewedAt = new Date()
  await app.save()

  return { ok: true, status: app.status }
})
