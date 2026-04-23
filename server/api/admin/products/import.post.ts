import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { slugify } from '../../../utils/slugify'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const items: any[] = Array.isArray(body) ? body : body.products

  if (!items?.length) throw createError({ statusCode: 400, message: 'Send an array of products' })
  if (items.length > 500) throw createError({ statusCode: 400, message: 'Max 500 products per import' })

  await connectDB()

  const results = { created: 0, skipped: 0, errors: [] as string[] }

  for (const item of items) {
    try {
      if (!item.title || !item.price || !item.affiliateUrl) {
        results.errors.push(`Skipped: missing required fields on "${item.title ?? 'unknown'}"`)
        results.skipped++
        continue
      }

      const baseSlug = slugify(item.title)
      let slug = baseSlug
      let suffix = 1
      while (await Product.exists({ slug })) slug = `${baseSlug}-${suffix++}`

      await Product.create({
        ...item,
        slug,
        price: Number(item.price),
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        rating: item.rating ? Number(item.rating) : 0,
        tags: Array.isArray(item.tags)
          ? item.tags
          : (item.tags ? String(item.tags).split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      })
      results.created++
    } catch (e: any) {
      results.errors.push(`Error on "${item.title}": ${e.message}`)
      results.skipped++
    }
  }

  await cacheDel('recommendations:all', 'categories:all')
  return results
})
