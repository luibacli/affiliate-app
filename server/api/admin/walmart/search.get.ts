import { requireAdmin } from '../../../utils/adminAuth'
import { searchWalmart, getWalmartConfig } from '../../../services/walmart'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { q } = getQuery(event) as { q?: string }
  if (!q?.trim()) throw createError({ statusCode: 400, message: 'q is required' })

  const cfg = getWalmartConfig()
  return await searchWalmart(q.trim(), cfg)
})
