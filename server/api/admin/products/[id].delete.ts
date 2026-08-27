import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel, cacheDelPrefix } from '../../../utils/redis'
import { Product } from '../../../models/product'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!

  await connectDB()

  const product = await Product.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  ).lean()
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })

  await cacheDel(
    `product:${(product as any).slug}`,
    `related:${(product as any).slug}`,
    `compare:${(product as any).slug}`,
    'recommendations:all',
    'categories:all',
    'trending:homepage',
  )
  // Product listings are keyed by page/filter/sort, so drop the whole
  // namespace rather than guessing which permutations went stale.
  await cacheDelPrefix('products:')

  return { deleted: true, id }
})
