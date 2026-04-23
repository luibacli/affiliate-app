import { connectDB } from '../../utils/db'
import { cacheIncr } from '../../utils/redis'
import { Product } from '../../models/product'
import { Click } from '../../models/click'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  const hits = await cacheIncr(`ratelimit:affiliate:${ip}`, 60)
  if (hits > 10) throw createError({ statusCode: 429, message: 'Too many requests' })

  await connectDB()

  const product = await Product.findOne({ slug }).select('affiliateUrl _id').lean()
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })

  Click.create({
    productId: product._id,
    slug,
    referrer: getHeader(event, 'referer'),
    userAgent: getHeader(event, 'user-agent'),
  }).catch(() => {})

  return sendRedirect(event, product.affiliateUrl, 302)
})
