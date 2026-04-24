import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { PriceHistory } from '../../../models/priceHistory'
import { slugify } from '../../../utils/slugify'
import { getAmazonConfig } from '../../../services/amazon'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const items: any[] = Array.isArray(body) ? body : body.items ?? []

  if (!items.length) throw createError({ statusCode: 400, message: 'No items provided' })

  const cfg = getAmazonConfig()
  await connectDB()

  let created = 0
  let skipped = 0
  const errors: string[] = []

  for (const item of items) {
    try {
      if (!item.asin || !item.title || !item.price) { skipped++; continue }

      const existing = await Product.findOne({ asin: item.asin })
      if (existing) { skipped++; continue }

      const baseSlug = slugify(item.title)
      let slug = baseSlug
      let suffix = 1
      while (await Product.exists({ slug })) slug = `${baseSlug}-${suffix++}`

      const product = await Product.create({
        title: item.title,
        price: Number(item.price),
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        affiliateUrl: item.affiliateUrl,
        imageUrl: item.imageUrl,
        asin: item.asin,
        source: 'Amazon',
        slug,
        rating: 0,
      })

      await PriceHistory.create({ productId: product._id, price: Number(item.price), source: 'amazon-import' })
      created++
    } catch (e: any) {
      errors.push(e.message)
    }
  }

  await cacheDel('recommendations:all', 'categories:all')

  return { created, skipped, errors }
})
