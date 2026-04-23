import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet, cacheIncr } from '../../utils/redis'
import { Product } from '../../models/product'

const SORT_MAP: Record<string, object> = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
  relevance: { score: { $meta: 'textScore' } },
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:search:${ip}`, 60)
  if (hits > 60) throw createError({ statusCode: 429, message: 'Too many requests' })

  const q = getQuery(event)
  const term = (q.q as string)?.trim() || undefined
  const page = Math.max(1, Number(q.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(q.limit) || 20))
  const minPrice = q.minPrice ? Number(q.minPrice) : undefined
  const maxPrice = q.maxPrice ? Number(q.maxPrice) : undefined
  const source = (q.source as string) || undefined
  const sortKey = (q.sort as string) || (term ? 'relevance' : 'newest')

  const cacheKey = `search:${term ?? ''}:${minPrice ?? ''}:${maxPrice ?? ''}:${source ?? ''}:${sortKey}:p${page}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const filter: Record<string, unknown> = {}
  if (term) filter.$text = { $search: term }
  if (source) filter.source = source
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {
      ...(minPrice !== undefined && { $gte: minPrice }),
      ...(maxPrice !== undefined && { $lte: maxPrice }),
    }
  }

  const projection = term ? { score: { $meta: 'textScore' } } : {}
  const sort = SORT_MAP[sortKey] ?? SORT_MAP.newest
  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    Product.find(filter, projection)
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .select('title price originalPrice rating slug imageUrl source category lastPriceDrop')
      .lean(),
    Product.countDocuments(filter),
  ])

  const result = {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    query: term,
    filters: { source, minPrice, maxPrice },
  }

  await cacheSet(cacheKey, result, 30)
  return result
})
