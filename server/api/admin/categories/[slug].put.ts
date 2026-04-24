import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { cacheDel } from '../../../utils/redis'
import { Category } from '../../../models/category'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const slug = getRouterParam(event, 'slug')!
  const body = await readBody(event)

  await connectDB()

  const updated = await Category.findOneAndUpdate(
    { slug },
    { $set: { icon: body.icon, label: body.label, sortOrder: Number(body.sortOrder) || 0 } },
    { upsert: true, new: true }
  )

  await cacheDel('categories:all')
  return updated
})
