import { connectDB } from '../../utils/db'
import { Click } from '../../models/click'
import { Product } from '../../models/product'
import { requirePartner } from '../../utils/partnerAuth'

export default defineEventHandler(async (event) => {
  const session = await requirePartner(event)
  await connectDB()

  const products = await Product.find({ submittedBy: session.userId }).select('slug title price').lean()
  const slugs = products.map(p => p.slug).filter(Boolean) as string[]

  if (!slugs.length) return { total: 0, last7d: 0, products: 0, topProducts: [] }

  const since7d = new Date(Date.now() - 7 * 86_400_000)
  const since30d = new Date(Date.now() - 30 * 86_400_000)

  const [total, last7d, last30d, topProducts] = await Promise.all([
    Click.countDocuments({ slug: { $in: slugs } }),
    Click.countDocuments({ slug: { $in: slugs }, createdAt: { $gte: since7d } }),
    Click.countDocuments({ slug: { $in: slugs }, createdAt: { $gte: since30d } }),
    Click.aggregate([
      { $match: { slug: { $in: slugs } } },
      { $group: { _id: '$slug', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ])

  const slugToProduct = Object.fromEntries(products.map(p => [p.slug, p]))

  return {
    total,
    last7d,
    last30d,
    products: products.length,
    topProducts: topProducts.map(r => ({
      slug: r._id,
      count: r.count,
      title: slugToProduct[r._id]?.title,
      price: slugToProduct[r._id]?.price,
    })),
  }
})
