import { connectDB } from '../../../utils/db'
import { cacheGet, cacheSet } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { ACTIVE } from '../../../utils/filters'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const cacheKey = `related:${slug}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const current = await Product.findOne({ slug }).select('category _id').lean()
  if (!current) throw createError({ statusCode: 404, message: 'Product not found' })

  const related = await Product.find({
    category: current.category,
    _id: { $ne: current._id },
    slug: { $exists: true, $ne: null },
    ...ACTIVE,
  })
    .select('title price originalPrice slug imageUrl source')
    .sort({ createdAt: -1 })
    .limit(6)
    .lean()

  await cacheSet(cacheKey, related, 300)
  return related
})
