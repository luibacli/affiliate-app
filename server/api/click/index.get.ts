import { connectDB } from '../../utils/db'
import { cacheIncr } from '../../utils/redis'
import { Product } from '../../models/product'
import { Click } from '../../models/click'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const productId = q.product_id as string
  const source = (q.source as string) || 'unknown'

  if (!productId) throw createError({ statusCode: 400, message: 'Missing product_id' })

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const hits = await cacheIncr(`ratelimit:click:${ip}`, 60)
  if (hits > 20) throw createError({ statusCode: 429, message: 'Too many requests' })

  await connectDB()

  const product = await Product.findById(productId).select('affiliateUrl slug category').lean()
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })

  Click.create({
    productId: product._id,
    slug: product.slug,
    source,
    category: (product as any).category ?? null,
    referrer: getHeader(event, 'referer'),
    userAgent: getHeader(event, 'user-agent'),
  }).catch(() => {})

  return sendRedirect(event, product.affiliateUrl, 302)
})
