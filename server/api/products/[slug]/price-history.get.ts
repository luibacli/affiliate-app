import { connectDB } from '../../../utils/db'
import { cacheGet, cacheSet } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { PriceHistory } from '../../../models/priceHistory'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const key = `price-history:${slug}`

  const cached = await cacheGet(key)
  if (cached) return cached

  await connectDB()
  const product = await Product.findOne({ slug }).select('_id').lean()
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })

  const history = await PriceHistory.find({ productId: product._id })
    .sort({ createdAt: -1 })
    .limit(30)
    .select('price createdAt source')
    .lean()

  await cacheSet(key, history, 300)
  return history
})
