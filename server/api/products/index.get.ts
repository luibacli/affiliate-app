import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Product } from '../../models/product'
import { ACTIVE } from '../../utils/filters'

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const page = Math.max(1, Number(q.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(q.limit) || 20))
  const category = (q.category as string) || undefined
  const minPrice = q.minPrice ? Number(q.minPrice) : undefined
  const maxPrice = q.maxPrice ? Number(q.maxPrice) : undefined
  const sort = SORT_MAP[(q.sort as string) ?? ''] ?? { createdAt: -1 }

  const cacheKey = `products:p${page}:l${limit}:c${category ?? 'all'}:min${minPrice ?? ''}:max${maxPrice ?? ''}:s${q.sort ?? ''}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const filter: Record<string, unknown> = { ...ACTIVE }
  if (category) filter.category = category
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {
      ...(minPrice !== undefined && { $gte: minPrice }),
      ...(maxPrice !== undefined && { $lte: maxPrice }),
    }
  }

  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit)
      .select('title price originalPrice currency slug imageUrl source rating discountPct category lastPriceDrop lowestPrice30d')
      .lean(),
    Product.countDocuments(filter),
  ])

  const result = { products, total, page, limit, totalPages: Math.ceil(total / limit) }
  await cacheSet(cacheKey, result, 60)
  return result
})
