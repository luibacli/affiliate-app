import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { PriceHistory } from '../../../models/priceHistory'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  await connectDB()

  const product = await Product.findById(id)
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })

  const oldPrice = Number(product.price)
  const newPrice = body.price !== undefined ? Number(body.price) : oldPrice

  const updates = {
    ...body,
    price: newPrice,
    originalPrice: body.originalPrice !== undefined ? Number(body.originalPrice) : product.originalPrice,
    rating: body.rating !== undefined ? Number(body.rating) : product.rating,
    tags: body.tags
      ? (Array.isArray(body.tags) ? body.tags : String(body.tags).split(',').map((t: string) => t.trim()).filter(Boolean))
      : product.tags,
  }

  if (newPrice < oldPrice) updates.lastPriceDrop = new Date()

  Object.assign(product, updates)
  await product.save()

  if (newPrice !== oldPrice) {
    await PriceHistory.create({ productId: product._id, price: newPrice, source: 'manual' })
  }

  await cacheDel(
    `product:${product.slug}`,
    `related:${product.slug}`,
    `compare:${product.slug}`,
    'recommendations:all',
    'categories:all',
  )

  return product
})
