import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Click } from '../../models/click'

export default defineEventHandler(async (event) => {
  const { adminKey } = useRuntimeConfig()
  const key = getHeader(event, 'x-admin-key') || (getQuery(event).key as string)
  if (adminKey && key !== adminKey) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const cacheKey = 'admin:analytics'
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [total, last7d, last30d, byProduct, bySource] = await Promise.all([
    Click.countDocuments({}),
    Click.countDocuments({ createdAt: { $gte: since7d } }),
    Click.countDocuments({ createdAt: { $gte: since30d } }),

    Click.aggregate([
      { $group: { _id: '$productId', count: { $sum: 1 }, slug: { $first: '$slug' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          count: 1,
          slug: 1,
          title: '$product.title',
          price: '$product.price',
          imageUrl: '$product.imageUrl',
        },
      },
    ]),

    Click.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, source: '$_id', count: 1 } },
    ]),
  ])

  const result = { total, last7d, last30d, byProduct, bySource }
  await cacheSet(cacheKey, result, 60)
  return result
})
