import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Product } from '../../models/product'

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event) as { q?: string }
  if (!q || q.trim().length < 2) return []

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
