import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Click } from '../../models/click'

export default defineEventHandler(async (event) => {
  const { adminKey } = useRuntimeConfig()
  const key = getHeader(event, 'x-admin-key') || (getQuery(event).key as string)
  if (adminKey && key !== adminKey) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const cacheKey = 'admin:analytics:v2'
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const now = Date.now()
  const since7d = new Date(now - 7 * 86400000)
  const since14d = new Date(now - 14 * 86400000)
  const since30d = new Date(now - 30 * 86400000)

  const [
    total,
    last7d,
    prev7d,
    last30d,
    byProduct,
    bySource,
    byCategory,
    dailyTrend,
  ] = await Promise.all([
    Click.countDocuments({}),
    Click.countDocuments({ createdAt: { $gte: since7d } }),
    Click.countDocuments({ createdAt: { $gte: since14d, $lt: since7d } }),
    Click.countDocuments({ createdAt: { $gte: since30d } }),

    // Top 10 products all-time
    Click.aggregate([
      { $group: { _id: '$productId', count: { $sum: 1 }, slug: { $first: '$slug' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          count: 1,
          slug: 1,
          title: '$product.title',
          price: '$product.price',
          imageUrl: '$product.imageUrl',
          category: '$product.category',
          source: '$product.source',
        },
      },
    ]),

    // Source breakdown with % share
    Click.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, source: '$_id', count: 1 } },
    ]),

    // Category breakdown — last 30 days
    Click.aggregate([
      { $match: { createdAt: { $gte: since30d }, category: { $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, category: '$_id', count: 1 } },
    ]),

    // Daily trend — last 30 days
    Click.aggregate([
      { $match: { createdAt: { $gte: since30d } } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: { year: '$_id.y', month: '$_id.m', day: '$_id.d' },
              },
            },
          },
          count: 1,
        },
      },
    ]),
  ])

  // Compute % growth (last7d vs prev7d)
  const growth7d = prev7d === 0
    ? (last7d > 0 ? 100 : 0)
    : Math.round(((last7d - prev7d) / prev7d) * 100)

  // Add % share to source breakdown
  const sourceTotal = bySource.reduce((sum: number, s: any) => sum + s.count, 0)
  const bySourceWithPct = bySource.map((s: any) => ({
    ...s,
    pct: sourceTotal > 0 ? Math.round((s.count / sourceTotal) * 100) : 0,
  }))

  // Add % share to category breakdown
  const catTotal = byCategory.reduce((sum: number, c: any) => sum + c.count, 0)
  const byCategoryWithPct = byCategory.map((c: any) => ({
    ...c,
    pct: catTotal > 0 ? Math.round((c.count / catTotal) * 100) : 0,
  }))

  // Fill missing days in daily trend (0-count days)
  const trendMap = new Map(dailyTrend.map((d: any) => [d.date, d.count]))
  const filledTrend: { date: string; count: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86400000)
    const key = d.toISOString().slice(0, 10)
    filledTrend.push({ date: key, count: trendMap.get(key) ?? 0 })
  }

  const result = {
    total,
    last7d,
    prev7d,
    growth7d,
    last30d,
    byProduct,
    bySource: bySourceWithPct,
    byCategory: byCategoryWithPct,
    dailyTrend: filledTrend,
  }

  await cacheSet(cacheKey, result, 60)
  return result
})
