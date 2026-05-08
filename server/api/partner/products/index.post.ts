import { connectDB } from '../../../utils/db'
import { Product } from '../../../models/product'
import { SellerApplication } from '../../../models/sellerApplication'
import { requirePartner } from '../../../utils/partnerAuth'
import { slugify } from '../../../utils/slugify'

export default defineEventHandler(async (event) => {
  const session = await requirePartner(event)
  await connectDB()

  const app = await SellerApplication.findOne({ userId: session.userId })
  if (!app || app.status !== 'approved') {
    throw createError({ statusCode: 403, message: 'Your application must be approved before submitting products.' })
  }

  const body = await readBody(event)
  const { title, description, price, affiliateUrl, imageUrl, category } = body ?? {}

  if (!title?.trim() || !price || !affiliateUrl?.trim()) {
    throw createError({ statusCode: 400, message: 'Title, price, and affiliate URL are required.' })
  }

  const baseSlug = slugify(title.trim())
  let slug = baseSlug
  let counter = 0
  while (await Product.exists({ slug })) {
    counter++
    slug = `${baseSlug}-${counter}`
  }

  const product = await Product.create({
    title: title.trim(),
    description: description?.trim(),
    price: Number(price),
    affiliateUrl: affiliateUrl.trim(),
    imageUrl: imageUrl?.trim(),
    category,
    slug,
    submittedBy: session.userId,
    isActive: false,
    source: 'partner',
  })

  return product
})
