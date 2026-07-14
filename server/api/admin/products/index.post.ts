import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { PriceHistory } from '../../../models/priceHistory'
import { slugify } from '../../../utils/slugify'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.title || !body.price || !body.affiliateUrl) {
    throw createError({ statusCode: 400, message: 'title, price, and affiliateUrl are required' })
  }
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
  if (Number(body.price) <= 0)
    throw createError({ statusCode: 400, message: 'price must be greater than 0' })

  await connectDB()

  const baseSlug = slugify(body.title)
  let slug = baseSlug
  let suffix = 1
  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${suffix++}`
  }

  const product = await Product.create({
    ...body,
    slug,
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    rating: body.rating ? Number(body.rating) : 0,
    tags: Array.isArray(body.tags) ? body.tags : (body.tags ? String(body.tags).split(',').map((t: string) => t.trim()).filter(Boolean) : []),
  })

  await PriceHistory.create({ productId: product._id, price: product.price, source: 'manual' })
  await cacheDel('recommendations:all', 'categories:all')

  return product
})
