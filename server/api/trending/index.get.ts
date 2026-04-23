import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Click } from '../../models/click'
import { Product } from '../../models/product'
import { ACTIVE } from '../../utils/filters'

export default defineEventHandler(async () => {
  const cacheKey = 'trending:homepage'
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const now = Date.now()
  const since6h = new Date(now - 6 * 3600000)
  const since24h = new Date(now - 24 * 3600000)
  const since72h = new Date(now - 72 * 3600000)

  // Weighted score: recent clicks worth more
  const [clicks6h, clicks24h, clicks72h] = await Promise.all([
    Click.aggregate([
      { $match: { createdAt: { $gte: since6h } } },
      { $group: { _id: '$productId', count: { $sum: 1 } } },
    ]),
    Click.aggregate([
      { $match: { createdAt: { $gte: since24h, $lt: since6h } } },
      { $group: { _id: '$productId', count: { $sum: 1 } } },
    ]),
    Click.aggregate([
      { $match: { createdAt: { $gte: since72h, $lt: since24h } } },
      { $group: { _id: '$productId', count: { $sum: 1 } } },
    ]),
  ])

  // Build weighted score map: 6h clicks × 5 + 24h clicks × 2 + 72h clicks × 1
  const scoreMap = new Map<string, number>()
  for (const c of clicks6h) scoreMap.set(String(c._id), (scoreMap.get(String(c._id)) ?? 0) + c.count * 5)
  for (const c of clicks24h) scoreMap.set(String(c._id), (scoreMap.get(String(c._id)) ?? 0) + c.count * 2)
  for (const c of clicks72h) scoreMap.set(String(c._id), (scoreMap.get(String(c._id)) ?? 0) + c.count * 1)

  let products: any[] = []

  if (scoreMap.size >= 4) {
    const topIds = [...scoreMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id]) => id)

    products = await Product.find({
      _id: { $in: topIds },
      slug: { $exists: true, $ne: null },
      ...ACTIVE,
    })
      .select('title price originalPrice rating slug imageUrl source category lastPriceDrop isTrending')
      .lean()

    products.sort((a, b) => (scoreMap.get(String(b._id)) ?? 0) - (scoreMap.get(String(a._id)) ?? 0))
  }

  // Fallback: admin-flagged trending products
  if (products.length < 4) {
    products = await Product.find({
      isTrending: true,
      slug: { $exists: true, $ne: null },
      ...ACTIVE,
    })
      .select('title price originalPrice rating slug imageUrl source category lastPriceDrop isTrending')
      .limit(8)
      .lean()
  }

  await cacheSet(cacheKey, products, 300)
  return products
})
