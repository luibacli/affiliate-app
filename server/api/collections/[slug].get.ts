import { connectDB } from '../../utils/db'
import { cacheGet, cacheSet } from '../../utils/redis'
import { Product } from '../../models/product'
import { ACTIVE } from '../../utils/filters'
import { SEO_PAGES } from '../../../app/data/seoPages'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const page = getSeoPage(slug)
  if (!page) throw createError({ statusCode: 404, message: 'Collection not found' })

  const cacheKey = `collection:${slug}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  await connectDB()

  const filter: Record<string, unknown> = {
    ...ACTIVE,
    slug: { $exists: true, $ne: null },
  }

  if (page.category) filter.category = page.category
  if (page.search) filter.$text = { $search: page.search }
  if (page.maxPrice) filter.price = { $lte: page.maxPrice }

  const sortBy = page.sortBy ?? 'rating'

  let products: any[]

  if (sortBy === 'discount') {
    products = await Product.aggregate([
      { $match: filter },
      {
        $addFields: {
          discountPct: {
            $cond: [
              { $and: [{ $gt: ['$originalPrice', '$price'] }, { $gt: ['$originalPrice', 0] }] },
              { $divide: [{ $subtract: ['$originalPrice', '$price'] }, '$originalPrice'] },
              0,
            ],
          },
        },
      },
      { $sort: { discountPct: -1, createdAt: -1 } },
      { $limit: 10 },
      { $project: { title: 1, price: 1, originalPrice: 1, discountPct: 1, slug: 1, imageUrl: 1, source: 1, rating: 1, lowestPrice30d: 1, lastPriceDrop: 1 } },
    ])
  } else {
    const sort: Record<string, 1 | -1> =
      sortBy === 'price'   ? { price: 1 } :
      sortBy === 'newest'  ? { createdAt: -1 } :
                             { rating: -1, isFeatured: -1 }

    products = await Product.find(filter)
      .sort(sort)
      .limit(10)
      .select('title price originalPrice slug imageUrl source rating lowestPrice30d lastPriceDrop')
      .lean()
  }

  const result = { products, page: page.slug }
  await cacheSet(cacheKey, result, 300)
  return result
})

function getSeoPage(slug: string) {
  return SEO_PAGES.find(p => p.slug === slug)
}
