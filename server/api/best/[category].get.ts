import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Product } from '../../models/product'

export default defineEventHandler(async (event) => {
  const category = getRouterParam(event, 'category')!
  const q = getQuery(event)
  const page = Math.max(1, Number(q.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(q.limit) || 20))
  const skip = (page - 1) * limit

  const cacheKey = `best:${category}:p${page}:l${limit}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const [products, total] = await Promise.all([
    Product.aggregate([
      { $match: { category, slug: { $exists: true, $ne: null } } },
      {
        $addFields: {
          discountPct: {
            $cond: [
              { $and: [{ $gt: ['$originalPrice', '$price'] }, { $gt: ['$originalPrice', 0] }] },
              { $divide: [{ $subtract: ['$originalPrice', '$price'] }, '$originalPrice'] },
              0,
            ],
          },
        },
      },
      { $sort: { discountPct: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { title: 1, price: 1, originalPrice: 1, discountPct: 1, slug: 1, imageUrl: 1, source: 1 } },
    ]),
    Product.countDocuments({ category }),
  ])

  const result = { products, total, page, limit, totalPages: Math.ceil(total / limit), category }
  await cacheSet(cacheKey, result, 300)
  return result
})
