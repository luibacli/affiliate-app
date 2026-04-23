import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { Product } from '../../../models/product'
import { Category } from '../../../models/category'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  await connectDB()

  const [counts, overrides] = await Promise.all([
    Product.aggregate([
      { $match: { category: { $exists: true, $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Category.find().lean(),
  ])

  const overrideMap = new Map(overrides.map((c: any) => [c.slug, c]))

  return counts.map((c: any) => ({
    slug: c._id,
    count: c.count,
    icon: overrideMap.get(c._id)?.icon ?? '🏷️',
    label: overrideMap.get(c._id)?.label ?? (c._id.charAt(0).toUpperCase() + c._id.slice(1)),
    sortOrder: overrideMap.get(c._id)?.sortOrder ?? 0,
  }))
})
