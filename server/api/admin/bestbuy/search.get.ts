import { requireAdmin } from '../../../utils/adminAuth'
import { searchBestBuy, getBestBuyConfig } from '../../../services/bestbuy'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { q } = getQuery(event) as { q?: string }
  if (!q?.trim()) throw createError({ statusCode: 400, message: 'q is required' })

  const cfg = getBestBuyConfig()
  return await searchBestBuy(q.trim(), cfg)
})
