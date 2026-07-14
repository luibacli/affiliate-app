import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { slugify } from '../../../utils/slugify'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const items: any[] = Array.isArray(body) ? body : body.items ?? []

  if (!items.length) throw createError({ statusCode: 400, message: 'No items provided' })

  await connectDB()

  let created = 0
  let skipped = 0
  const errors: string[] = []

  for (const item of items) {
    try {
      if (!item.bestBuySkuId || !item.title || !item.price) { skipped++; continue }

      const existing = await Product.findOne({ bestBuySkuId: item.bestBuySkuId })
      if (existing) { skipped++; continue }

      const baseSlug = slugify(item.title)
      let slug = baseSlug
      let suffix = 1
      while (await Product.exists({ slug })) slug = `${baseSlug}-${suffix++}`

      await Product.create({
        title: item.title,
        price: Number(item.price),
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        affiliateUrl: item.affiliateUrl,
        imageUrl: item.imageUrl,
        bestBuySkuId: item.bestBuySkuId,
        source: 'Best Buy',
        slug,
        rating: item.rating || 0,
        category: item.category || undefined,
        compareGroupId: item.compareGroupId || undefined,
      })

      created++
    } catch (e: any) {
      errors.push(e.message)
    }
  }

  await cacheDel('recommendations:all', 'categories:all')
  return { created, skipped, errors }
})
