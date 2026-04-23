import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Product } from '../../../models/product'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')!

  await connectDB()

  const product = await Product.findByIdAndDelete(id).lean()
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })

  await cacheDel(
    `product:${product.slug}`,
    `related:${product.slug}`,
    `compare:${product.slug}`,
    'recommendations:all',
    'categories:all',
  )

  return { deleted: true, id }
})
