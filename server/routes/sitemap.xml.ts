import { connectDB } from '../utils/db'
import { Product } from '../models/product'

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const { siteUrl } = useRuntimeConfig()

  await connectDB()

  const products = await Product.find({ slug: { $exists: true, $ne: null } })
    .select('slug category updatedAt')
    .lean()

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  const staticUrls = [
    { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteUrl}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${siteUrl}/contact`, priority: '0.4', changefreq: 'monthly' },
    ...categories.map((cat) => ({
      loc: `${siteUrl}/category/${cat}`,
      priority: '0.7',
      changefreq: 'daily',
    })),
    ...categories.map((cat) => ({
      loc: `${siteUrl}/best/${cat}`,
      priority: '0.8',
      changefreq: 'daily',
    })),
  ]

  const productUrls = products.map((p) => ({
    loc: `${siteUrl}/products/${p.slug}`,
    lastmod: new Date(p.updatedAt as Date).toISOString(),
    priority: '0.8',
    changefreq: 'daily',
  }))

  const toTag = (u: { loc: string; lastmod?: string; priority: string; changefreq: string }) =>
    `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...productUrls].map(toTag).join('\n')}
</urlset>`
})
