import { connectDB } from '../../../utils/db'
import { cacheGet, cacheSet } from '../../../utils/redis'
import { Click } from '../../../models/click'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const cacheKey = `affiliate:stats:${slug}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [total, last30Days] = await Promise.all([
    Click.countDocuments({ slug }),
    Click.countDocuments({ slug, createdAt: { $gte: since30d } }),
  ])

  const result = { slug, total, last30Days }
  await cacheSet(cacheKey, result, 60)
  return result
})
