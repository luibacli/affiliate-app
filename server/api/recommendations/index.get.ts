import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Product } from '../../models/product'
import { ACTIVE } from '../../utils/filters'

const SELECT = 'title price originalPrice rating slug imageUrl source category currency lastPriceDrop lowestPrice30d'

export default defineEventHandler(async () => {
  const cacheKey = 'recommendations:all'
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const hasSlug = { slug: { $exists: true, $ne: null }, ...ACTIVE }

  const [bestValue, topRated, budgetPicks] = await Promise.all([
    // Best Value: highest rating/price ratio
    Product.aggregate([
      { $match: { ...hasSlug, rating: { $gt: 0 }, price: { $gt: 0 } } },
      { $addFields: { valueScore: { $divide: ['$rating', '$price'] } } },
      { $sort: { valueScore: -1 } },
      { $limit: 6 },
      { $project: { title: 1, price: 1, originalPrice: 1, rating: 1, slug: 1, imageUrl: 1, source: 1, category: 1, valueScore: 1 } },
    ]),

    // Top Rated: highest rating
    Product.find({ ...hasSlug, rating: { $gt: 0 } })
      .select(SELECT)
      .sort({ rating: -1 })
      .limit(6)
      .lean(),

    // Budget Picks: lowest price with a slug
    Product.find({ ...hasSlug, price: { $gt: 0 } })
      .select(SELECT)
      .sort({ price: 1 })
      .limit(6)
      .lean(),
  ])

  const result = { bestValue, topRated, budgetPicks }
  await cacheSet(cacheKey, result, 300)
  return result
})
