import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { PriceHistory } from '../../../models/priceHistory'
import { slugify } from '../../../utils/slugify'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)

  if (!body.title || !body.price || !body.affiliateUrl) {
    throw createError({ statusCode: 400, message: 'title, price, and affiliateUrl are required' })
  }

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
