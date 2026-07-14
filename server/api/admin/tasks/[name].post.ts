import { requireAdmin } from '../../../utils/adminAuth'

const ALLOWED_TASKS = ['products:discover', 'prices:update']

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const name = getRouterParam(event, 'name')!

  if (!ALLOWED_TASKS.includes(name)) {
    throw createError({ statusCode: 400, message: `Unknown task: ${name}` })
  }

  const result = await runTask(name)
  return { ok: true, task: name, result }
})
