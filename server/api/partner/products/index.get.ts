import { connectDB } from '../../../utils/db'
import { Product } from '../../../models/product'
import { requirePartner } from '../../../utils/partnerAuth'

export default defineEventHandler(async (event) => {
  const session = await requirePartner(event)
  await connectDB()
  const products = await Product.find({ submittedBy: session.userId })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()
  return products
})
