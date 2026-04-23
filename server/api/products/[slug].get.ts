import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Product } from '../../models/product'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const cacheKey = `product:${slug}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const product = await Product.findOne({ slug }).lean()
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })

  await cacheSet(cacheKey, product, 120)
  return product
})
