import { connectDB } from '../../utils/db'
import { SellerApplication } from '../../models/sellerApplication'
import { requirePartner } from '../../utils/partnerAuth'

export default defineEventHandler(async (event) => {
  const session = await requirePartner(event)
  await connectDB()
  const app = await SellerApplication.findOne({ userId: session.userId }).lean()
  if (!app) throw createError({ statusCode: 404, message: 'No application found' })
  return app
})
