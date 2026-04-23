import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Product } from '../../models/product'

export default defineEventHandler(async () => {
  const cacheKey = 'categories:all'
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const categories = await Product.aggregate([
    { $match: { category: { $exists: true, $ne: null } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, name: '$_id', count: 1 } },
  ])

  await cacheSet(cacheKey, categories, 300)
  return categories
})
