import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { Product } from '../../../models/product'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  await connectDB()

  const q = getQuery(event)
  const page = Math.max(1, Number(q.page) || 1)
  const limit = Math.min(50, Number(q.limit) || 20)
  const category = (q.category as string) || undefined
  const search = (q.search as string)?.trim() || undefined

  const source = (q.source as string) || undefined
  const onlyInactive = q.inactive === 'true'
  const onlyPartner = q.partner === 'true'

  const filter: Record<string, unknown> = {}
  if (category) filter.category = category
  if (search) filter.$text = { $search: search }
  if (source) filter.source = source
  if (onlyInactive) filter.isActive = false
  if (onlyPartner) filter.source = 'partner'

  const [products, total, pendingPartnerCount] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('submittedBy', 'name email')
      .lean(),
    Product.countDocuments(filter),
    Product.countDocuments({ source: 'partner', isActive: false }),
  ])

  return { products, total, page, limit, totalPages: Math.ceil(total / limit), pendingPartnerCount }
})
