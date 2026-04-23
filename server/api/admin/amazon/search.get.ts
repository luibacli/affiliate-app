import { requireAdmin } from '../../../utils/adminAuth'
import { searchItems, getAmazonConfig } from '../../../services/amazon'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { q } = getQuery(event) as { q?: string }
  if (!q?.trim()) throw createError({ statusCode: 400, message: 'q is required' })

  const cfg = getAmazonConfig()
  const results = await searchItems(q.trim(), cfg)
  return results
})
