import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { Product } from '../../../models/product'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  await connectDB()
  const product = await Product.findById(id).lean()
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })
  return product
})
