import { connectDB } from '../../../utils/db'
import { cacheGet, cacheSet } from '../../../utils/redis'
import { Product } from '../../../models/product'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const cacheKey = `compare:${slug}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const product = await Product.findOne({ slug }).select('compareGroupId').lean()
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })

  if (!product.compareGroupId) return { comparisons: [], slug }

  const comparisons = await Product.find({ compareGroupId: product.compareGroupId })
    .select('title price source affiliateUrl slug imageUrl')
    .sort({ price: 1 })
    .lean()

  const result = { comparisons, slug }
  await cacheSet(cacheKey, result, 120)
  return result
})
