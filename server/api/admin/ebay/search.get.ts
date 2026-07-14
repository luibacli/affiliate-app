import { requireAdmin } from '../../../utils/adminAuth'
import { searchEbay, getEbayConfig } from '../../../services/ebay'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { q } = getQuery(event) as { q?: string }
  if (!q?.trim()) throw createError({ statusCode: 400, message: 'q is required' })

  const cfg = getEbayConfig()
  return await searchEbay(q.trim(), cfg)
})
