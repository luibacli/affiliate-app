import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Product } from '../../models/product'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const term = (q.q as string)?.trim()
  const page = Math.max(1, Number(q.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(q.limit) || 20))

  if (!term) throw createError({ statusCode: 400, message: 'Missing query param: q' })

  const cacheKey = `search:${term}:p${page}:l${limit}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const filter = { $text: { $search: term } }
  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    Product.find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ])

  const result = { products, total, page, limit, totalPages: Math.ceil(total / limit), query: term }
  await cacheSet(cacheKey, result, 30)
  return result
})
