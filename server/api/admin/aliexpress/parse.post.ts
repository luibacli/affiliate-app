import { requireAdmin } from '../../../utils/adminAuth'
import { connectDB } from '../../../utils/db'
import { Product } from '../../../models/product'
import { parseAliExpressWorkbook } from '../../../utils/aliexpress'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_ROWS = 1000

/**
 * Parses an uploaded AliExpress export and returns a preview.
 * Read-only: nothing is written until /import is called.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const form = await readMultipartFormData(event)
  const file = form?.find((f) => f.name === 'file' && f.filename)

  if (!file) throw createError({ statusCode: 400, message: 'No file uploaded' })
  if (!/\.(xls|xlsx)$/i.test(file.filename!)) {
    throw createError({ statusCode: 400, message: 'Upload an .xls or .xlsx file' })
  }
  if (file.data.length > MAX_FILE_BYTES) {
    throw createError({ statusCode: 413, message: 'File too large (max 5MB)' })
  }

  const result = parseAliExpressWorkbook(file.data, file.filename!)

  if (result.drafts.length > MAX_ROWS) {
    throw createError({
      statusCode: 400,
      message: `File has ${result.drafts.length} products (max ${MAX_ROWS} per upload). Split the export into smaller batches.`,
    })
  }

  // Flag rows already in the DB so re-importing a batch is obvious up front.
  await connectDB()
  const ids = result.drafts.map((d) => d.aliexpressProductId)
  const existing = await Product.find({ aliexpressProductId: { $in: ids } })
    .select('aliexpressProductId')
    .lean()
  const existingIds = new Set(existing.map((p: any) => p.aliexpressProductId))

  return {
    ...result,
    drafts: result.drafts.map((d) => ({
      ...d,
      alreadyImported: existingIds.has(d.aliexpressProductId),
    })),
    alreadyImported: existingIds.size,
  }
})
