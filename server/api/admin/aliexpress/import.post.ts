import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel, cacheDelPrefix } from '../../../utils/redis'
import { Product } from '../../../models/product'
import { Category } from '../../../models/category'
import { slugify } from '../../../utils/slugify'
import { computeAutoFlags } from '../../../utils/aliexpress'

const MAX_ITEMS = 1000

/**
 * Upserts normalized AliExpress drafts, keyed on aliexpressProductId so
 * re-importing an overlapping batch updates prices instead of creating
 * duplicate products (which would read as thin content to Google).
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const items: any[] = Array.isArray(body?.items) ? body.items : []
  const category: string = body?.category ? slugify(String(body.category)) : ''
  const applyBestDeal = body?.autoBestDeal !== false
  const applyTrending = body?.autoTrending !== false

  if (!items.length) throw createError({ statusCode: 400, message: 'No products selected' })
  if (items.length > MAX_ITEMS) {
    throw createError({ statusCode: 400, message: `Max ${MAX_ITEMS} products per import` })
  }

  await connectDB()

  // Badges are assigned by rank across the batch, not by fixed threshold,
  // so only the standout items in this upload get one.
  const flags = computeAutoFlags(items)

  const results = { created: 0, updated: 0, skipped: 0, errors: [] as string[] }

  for (const item of items) {
    try {
      if (!item.aliexpressProductId || !item.title || !item.price || !item.affiliateUrl) {
        results.skipped++
        results.errors.push(`Skipped "${item.title ?? 'unknown'}": missing required fields`)
        continue
      }

      const existing = await Product.findOne({
        aliexpressProductId: String(item.aliexpressProductId),
      })

      const price = Number(item.price)
      const originalPrice = item.originalPrice ? Number(item.originalPrice) : undefined

      const fields = {
        title: item.title,
        description: item.description || undefined,
        price,
        originalPrice,
        affiliateUrl: item.affiliateUrl,
        imageUrl: item.imageUrl || undefined,
        category: category || item.category || undefined,
        source: 'AliExpress',
        currency: item.currency || 'USD',
        rating: Number(item.rating) || 0,
        positiveFeedback: item.positiveFeedback ?? null,
        sales180Day: Number(item.sales180Day) || 0,
        discountPercent: Number(item.discountPercent) || 0,
        priceMayVary: Boolean(item.priceMayVary),
        couponCode: item.couponCode || null,
        couponValue: item.couponValue ?? null,
        couponMinSpend: item.couponMinSpend ?? null,
        couponExpiresAt: item.couponExpiresAt ? new Date(item.couponExpiresAt) : null,
        isBestDeal: applyBestDeal && flags.bestDeal.has(String(item.aliexpressProductId)),
        isTrending: applyTrending && flags.trending.has(String(item.aliexpressProductId)),
      }

      if (existing) {
        // Preserve manual admin curation; only refresh catalog data.
        const droppedInPrice = price < existing.price
        existing.set({
          ...fields,
          isBestDeal: existing.isBestDeal || fields.isBestDeal,
          isTrending: existing.isTrending || fields.isTrending,
          category: existing.category || fields.category,
          ...(droppedInPrice ? { lastPriceDrop: new Date() } : {}),
        })
        await existing.save()
        results.updated++
        continue
      }

      const baseSlug = slugify(item.title)
      let slug = baseSlug
      let suffix = 1
      while (await Product.exists({ slug })) slug = `${baseSlug}-${suffix++}`

      await Product.create({
        ...fields,
        aliexpressProductId: String(item.aliexpressProductId),
        slug,
        isActive: true,
      })
      results.created++
    } catch (e: any) {
      results.errors.push(`Error on "${item.title}": ${e.message}`)
      results.skipped++
    }
  }

  // Register the category so it appears in nav/filters immediately.
  if (category && (results.created || results.updated)) {
    await Category.updateOne(
      { slug: category },
      {
        $setOnInsert: {
          slug: category,
          label: category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        },
      },
      { upsert: true }
    )
  }

  // Product-list keys are dynamic but carry a 60s TTL, so they self-heal.
  await cacheDel('recommendations:all', 'categories:all', 'trending:homepage')
  // Product listings are keyed by page/filter/sort, so drop the whole
  // namespace rather than guessing which permutations went stale.
  await cacheDelPrefix('products:')

  return results
})
