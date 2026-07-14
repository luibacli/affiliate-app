import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { PriceHistory } from '../../../models/priceHistory'

async function computeLowest30d(productId: unknown): Promise<number | null> {
  const since = new Date(Date.now() - 30 * 86400000)
  const rows = await PriceHistory.find({ productId, createdAt: { $gte: since } }).select('price').lean()
  if (!rows.length) return null
  return Math.min(...rows.map((r: any) => r.price))
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const VALID_SOURCES = ['Amazon', 'Walmart', 'eBay', 'AliExpress']
  const VALID_CURRENCIES = ['USD', 'PHP', 'SGD', 'MYR', 'IDR', 'THB']
  if (body.source && !VALID_SOURCES.includes(body.source))
    throw createError({ statusCode: 400, message: `source must be one of: ${VALID_SOURCES.join(', ')}` })
  if (body.currency && !VALID_CURRENCIES.includes(body.currency))
    throw createError({ statusCode: 400, message: `currency must be one of: ${VALID_CURRENCIES.join(', ')}` })
  if (body.rating !== undefined && body.rating !== '') {
    const r = Number(body.rating)
    if (isNaN(r) || r < 0 || r > 5)
      throw createError({ statusCode: 400, message: 'rating must be between 0 and 5' })
  }
  if (body.price !== undefined && Number(body.price) <= 0)
    throw createError({ statusCode: 400, message: 'price must be greater than 0' })

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
    product.lowestPrice30d = await computeLowest30d(product._id)
    await product.save()
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
