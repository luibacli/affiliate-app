import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet, cacheIncr } from '../../utils/redis'
import { Product } from '../../models/product'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event) as { q?: string }
  if (!q || q.trim().length < 2) return []

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:autocomplete:${ip}`, 60)
  if (hits > 120) throw createError({ statusCode: 429, message: 'Too many requests' })

  const safe = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const key = `autocomplete:${safe.toLowerCase()}`

  const cached = await cacheGet(key)
  if (cached) return cached

  await connectDB()

  const results = await Product.find({ title: { $regex: safe, $options: 'i' } })
    .select('title slug price imageUrl source')
    .limit(8)
    .lean()

  await cacheSet(key, results, 15)
  return results
})
