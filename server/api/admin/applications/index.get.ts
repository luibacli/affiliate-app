import { connectDB } from '../../../utils/db'
import { SellerApplication } from '../../../models/sellerApplication'
import { requireAdmin } from '../../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  await connectDB()

  const { status } = getQuery(event)
  const filter = status && status !== 'all' ? { status } : {}

  const apps = await SellerApplication.find(filter)
    .populate('userId', 'name email createdAt')
    .sort({ createdAt: -1 })
    .lean()

  return apps
})
