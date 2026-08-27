import { connectDB } from '../../utils/db'
import { cached } from '../../utils/redis'
import { Product } from '../../models/product'
import { Category } from '../../models/category'
import { ACTIVE } from '../../utils/filters'

export default defineEventHandler(async (event) => {
  return cached('categories:all', 300, async () => {
    await connectDB()

    const [counts, overrides] = await Promise.all([
      Product.aggregate([
        { $match: { category: { $exists: true, $ne: null }, ...ACTIVE } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Category.find().lean(),
    ])

    const overrideMap = new Map(overrides.map((c: any) => [c.slug, c]))

    return counts.map((c: any) => ({
      _id: c._id,
      count: c.count,
      icon: overrideMap.get(c._id)?.icon,
      label: overrideMap.get(c._id)?.label,
    }))
  }, event)
})
