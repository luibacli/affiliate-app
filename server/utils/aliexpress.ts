// The full dist build, not the 'xlsx' entry point.
//
// SheetJS pulls in its `codepage` module through a guarded require() that
// Rollup cannot resolve, so in the Nitro bundle `cptable` is undefined and
// reading a .xls dies in __utf16le ("Cannot read properties of undefined").
// It only shows up once bundled — a plain require() from node_modules
// resolves codepage fine, so local dev and tests all pass.
//
// xlsx@0.18.5 is npm's last SheetJS release and predates set_cptable(), so
// the documented fix isn't available. This build has codepage compiled in.
// Only .xls (CFB/BIFF) needs it; .xlsx would have worked either way.
// @ts-expect-error - the dist bundle ships no type declarations
import XLSXDist from 'xlsx/dist/xlsx.full.min.js'
import { slugify } from './slugify'

// The dist build is UMD: depending on who does the CJS interop (Vite in dev,
// Rollup in the Nitro build) the exports land either on the module namespace
// or under .default. Normalize once so both paths behave the same.
const XLSX: any = (XLSXDist as any)?.read ? XLSXDist : (XLSXDist as any)?.default

/**
 * Parses AliExpress Portals bulk product exports (.xls / .xlsx) into
 * normalized product drafts ready for import.
 *
 * The export is keyword-stuffed and price-optimistic by design, so this
 * layer does the CTR/SEO cleanup: readable titles, numeric prices, an
 * honest rating proxy, and warnings on prices we can't stand behind.
 */

const MAX_TITLE_LENGTH = 70
/** Above this discount, the price is usually a new-buyer-only deal. */
const PRICE_MAY_VARY_DISCOUNT = 70
/**
 * Badges only drive clicks while they stay scarce. AliExpress exports are
 * mostly deep discounts, so a fixed threshold would badge two-thirds of a
 * batch and the badge would stop meaning anything. Flag by rank instead.
 */
const BEST_DEAL_RATIO = 0.1
const TRENDING_RATIO = 0.1
const MAX_AUTO_FLAGS = 20

export type AliExpressDraft = {
  aliexpressProductId: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  discountPercent: number
  currency: string
  affiliateUrl: string
  imageUrl: string
  rating: number
  positiveFeedback: number | null
  sales180Day: number
  priceMayVary: boolean
  couponCode: string | null
  couponValue: number | null
  couponMinSpend: number | null
  couponExpiresAt: Date | null
  commissionRate: number
  warnings: string[]
}

/** "USD 6.47" | "6.47" | 6.47 -> 6.47 (null when unparseable) */
function parseMoney(value: unknown): number | null {
  if (value == null || value === '') return null
  const n = Number(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

/** "84%" -> 84 */
function parsePercent(value: unknown): number | null {
  if (value == null || value === '') return null
  const n = Number(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : null
}

function parseInteger(value: unknown): number {
  const n = Number(String(value ?? '').replace(/[^\d]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function parseDate(value: unknown): Date | null {
  if (!value) return null
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * AliExpress titles run ~120 chars of stacked keywords. Cut to a clean
 * 2-line card title on a word boundary; the full string is kept as the
 * description so no search keywords are lost.
 */
export function cleanTitle(raw: string): string {
  const collapsed = String(raw ?? '').replace(/\s+/g, ' ').trim()
  if (collapsed.length <= MAX_TITLE_LENGTH) return collapsed

  const cut = collapsed.slice(0, MAX_TITLE_LENGTH)
  const lastSpace = cut.lastIndexOf(' ')
  const title = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()
  return title.replace(/[,\-–|/&+]+$/, '').trim()
}

/** Positive-feedback % -> 5-star proxy. 82.5% -> 4.1 */
export function feedbackToRating(feedback: number | null): number {
  if (feedback == null) return 0
  return Math.round((feedback / 20) * 10) / 10
}

/**
 * Request a sized CDN variant instead of full-res to protect LCP.
 * The AliExpress CDN appends the transform AFTER the full filename:
 *   foo.jpg -> foo.jpg_640x640q75.jpg  (~40KB vs ~77KB original)
 */
export function sizedImageUrl(url: string, size = 640, quality = 75): string {
  const clean = String(url ?? '').trim()
  if (!clean) return ''
  if (!/(aliexpress-media\.com|alicdn\.com)/.test(clean)) return clean
  if (/_\d+x\d+(q\d+)?\.(jpg|jpeg|png|webp)$/i.test(clean)) return clean
  if (!/\.(jpg|jpeg|png|webp)$/i.test(clean)) return clean
  return `${clean}_${size}x${size}q${quality}.jpg`
}

/**
 * Batch files are named `aliexpress_{category}_batch_{n}.xls`, so the
 * category comes free from the filename. Falls back to empty.
 */
export function categoryFromFilename(filename: string): string {
  const match = String(filename ?? '')
    .replace(/\.(xls|xlsx|csv)$/i, '')
    .match(/^aliexpress[_-](.+?)[_-]batch[_-]?\d*$/i)
  return match?.[1] ? slugify(match[1].replace(/_/g, ' ')) : ''
}

function normalizeRow(row: Record<string, unknown>): AliExpressDraft | null {
  const productId = String(row['ProductId'] ?? '').trim()
  const rawTitle = String(row['Product Desc'] ?? '').trim()
  const affiliateUrl = String(row['Promotion Url'] ?? '').trim()
  const price = parseMoney(row['Discount Price'])

  // Without these four a row can't become a clickable, trackable product.
  if (!productId || !rawTitle || !affiliateUrl || price == null) return null

  const originalPrice = parseMoney(row['Origin Price'])
  const explicitDiscount = parsePercent(row['Discount'])
  const derivedDiscount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0
  const discountPercent = explicitDiscount ?? derivedDiscount

  const positiveFeedback = parsePercent(row['Positive Feedback'])
  const sales180Day = parseInteger(row['Sales180Day'])
  const imageUrl = sizedImageUrl(String(row['Image Url'] ?? '').trim())

  const warnings: string[] = []
  if (discountPercent >= PRICE_MAY_VARY_DISCOUNT) {
    warnings.push(`${discountPercent}% off — likely a new-buyer-only price`)
  }
  if (price < 1) warnings.push('Under $1 — verify before featuring')
  if (!imageUrl) warnings.push('No image')
  if (originalPrice && originalPrice <= price) warnings.push('Original price not higher than sale price')

  return {
    aliexpressProductId: productId,
    title: cleanTitle(rawTitle),
    description: rawTitle,
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : null,
    discountPercent,
    currency: String(row['Currency'] ?? 'USD').trim() || 'USD',
    affiliateUrl,
    imageUrl,
    rating: feedbackToRating(positiveFeedback),
    positiveFeedback,
    sales180Day,
    priceMayVary: discountPercent >= PRICE_MAY_VARY_DISCOUNT,
    couponCode: String(row['Code Name'] ?? '').trim() || null,
    couponValue: parseMoney(row['Code Value']),
    couponMinSpend: parseMoney(row['Code Minimum Spend']),
    couponExpiresAt: parseDate(row['Code End Time']),
    commissionRate: parsePercent(row['Direct linking commission rate (%)']) ?? 0,
    warnings,
  }
}

export type ParseResult = {
  drafts: AliExpressDraft[]
  totalRows: number
  invalidRows: number
  duplicatesInFile: number
  detectedCategory: string
}

export function parseAliExpressWorkbook(buffer: Buffer, filename = ''): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) throw createError({ statusCode: 400, message: 'Spreadsheet has no sheets' })

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName]!, {
    defval: '',
  })

  if (!rows.length) throw createError({ statusCode: 400, message: 'Spreadsheet is empty' })
  if (!('ProductId' in rows[0]!) || !('Promotion Url' in rows[0]!)) {
    throw createError({
      statusCode: 400,
      message: 'Unrecognized format — expected an AliExpress Portals export with ProductId and Promotion Url columns',
    })
  }

  const seen = new Set<string>()
  const drafts: AliExpressDraft[] = []
  let invalidRows = 0
  let duplicatesInFile = 0

  for (const row of rows) {
    const draft = normalizeRow(row)
    if (!draft) {
      invalidRows++
      continue
    }
    if (seen.has(draft.aliexpressProductId)) {
      duplicatesInFile++
      continue
    }
    seen.add(draft.aliexpressProductId)
    drafts.push(draft)
  }

  return {
    drafts,
    totalRows: rows.length,
    invalidRows,
    duplicatesInFile,
    detectedCategory: categoryFromFilename(filename),
  }
}

type FlagInput = {
  aliexpressProductId: string
  discountPercent: number
  sales180Day: number
}

/**
 * Picks which products in a batch earn a Best Deal / Trending badge,
 * capped at the top ~10% (max 20) of each ranking so badges stay scarce
 * and keep their pull on the card.
 */
export function computeAutoFlags(items: FlagInput[]) {
  const cap = (ratio: number) =>
    Math.min(MAX_AUTO_FLAGS, Math.max(1, Math.round(items.length * ratio)))

  const topBy = (key: 'discountPercent' | 'sales180Day', limit: number) =>
    new Set(
      [...items]
        .filter((i) => Number(i[key]) > 0)
        .sort((a, b) => Number(b[key]) - Number(a[key]))
        .slice(0, limit)
        .map((i) => i.aliexpressProductId)
    )

  return {
    bestDeal: topBy('discountPercent', cap(BEST_DEAL_RATIO)),
    trending: topBy('sales180Day', cap(TRENDING_RATIO)),
  }
}
