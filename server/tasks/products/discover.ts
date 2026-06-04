import { connectDB } from '../../utils/db'
import { cacheDel } from '../../utils/redis'
import { Product } from '../../models/product'
import { slugify } from '../../utils/slugify'
import { searchEbay, getEbayConfig } from '../../services/ebay'
import { searchBestBuy, getBestBuyConfig } from '../../services/bestbuy'
import { searchWalmart, getWalmartConfig } from '../../services/walmart'

const KEYWORDS_BY_CATEGORY: Record<string, string[]> = {
  phones:      ['iPhone 15', 'Samsung Galaxy S24', 'Google Pixel 8'],
  laptops:     ['MacBook Air M3', 'Dell XPS 15', 'gaming laptop'],
  gaming:      ['gaming mouse', 'gaming headset', 'gaming keyboard', 'PS5 controller'],
  accessories: ['wireless charger', 'USB-C hub', 'Bluetooth speaker'],
  home:        ['air fryer', 'robot vacuum', 'smart TV'],
  beauty:      ['hair dryer', 'electric toothbrush', 'skin care'],
}

async function upsertProduct(data: {
  idField: string
  idValue: string
  title: string
  price: number
  originalPrice?: number
  affiliateUrl: string
  imageUrl: string
  source: string
  rating: number
  category: string
}): Promise<'created' | 'skipped'> {
  const existing = await Product.findOne({ [data.idField]: data.idValue })
  if (existing) return 'skipped'

  const baseSlug = slugify(data.title)
  let slug = baseSlug
  let suffix = 1
  while (await Product.exists({ slug })) slug = `${baseSlug}-${suffix++}`

  await Product.create({
    title: data.title,
    price: data.price,
    originalPrice: data.originalPrice,
    affiliateUrl: data.affiliateUrl,
    imageUrl: data.imageUrl,
    [data.idField]: data.idValue,
    source: data.source,
    slug,
    rating: data.rating,
    category: data.category,
  })

  return 'created'
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default defineTask({
  meta: { name: 'products:discover', description: 'Auto-import new products from eBay, Best Buy, and Walmart daily' },
  async run() {
    await connectDB()

    const results = { ebay: 0, bestbuy: 0, walmart: 0, errors: 0 }

    let ebayCfg: ReturnType<typeof getEbayConfig> | null = null
    let bestbuyCfg: ReturnType<typeof getBestBuyConfig> | null = null
    let walmartCfg: ReturnType<typeof getWalmartConfig> | null = null

    try { ebayCfg = getEbayConfig() } catch {}
    try { bestbuyCfg = getBestBuyConfig() } catch {}
    try { walmartCfg = getWalmartConfig() } catch {}

    for (const [category, keywords] of Object.entries(KEYWORDS_BY_CATEGORY)) {
      for (const keyword of keywords) {
        // eBay
        if (ebayCfg?.clientId) {
          try {
            const items = await searchEbay(keyword, ebayCfg)
            for (const item of items) {
              const status = await upsertProduct({
                idField: 'ebayItemId', idValue: item.ebayItemId,
                title: item.title, price: item.price,
                affiliateUrl: item.affiliateUrl, imageUrl: item.imageUrl,
                source: 'eBay', rating: item.rating, category,
              })
              if (status === 'created') results.ebay++
            }
          } catch { results.errors++ }
          await delay(300)
        }

        // Best Buy
        if (bestbuyCfg?.apiKey) {
          try {
            const items = await searchBestBuy(keyword, bestbuyCfg)
            for (const item of items) {
              const status = await upsertProduct({
                idField: 'bestBuySkuId', idValue: item.bestBuySkuId,
                title: item.title, price: item.price, originalPrice: item.originalPrice,
                affiliateUrl: item.affiliateUrl, imageUrl: item.imageUrl,
                source: 'Best Buy', rating: item.rating, category,
              })
              if (status === 'created') results.bestbuy++
            }
          } catch { results.errors++ }
          await delay(300)
        }

        // Walmart
        if (walmartCfg?.impactSid) {
          try {
            const items = await searchWalmart(keyword, walmartCfg)
            for (const item of items) {
              const status = await upsertProduct({
                idField: 'walmartItemId', idValue: item.walmartItemId,
                title: item.title, price: item.price, originalPrice: item.originalPrice,
                affiliateUrl: item.affiliateUrl, imageUrl: item.imageUrl,
                source: 'Walmart', rating: 0, category,
              })
              if (status === 'created') results.walmart++
            }
          } catch { results.errors++ }
          await delay(300)
        }
      }
    }

    const total = results.ebay + results.bestbuy + results.walmart
    if (total > 0) await cacheDel('recommendations:all', 'categories:all')

    return {
      result: `imported ${total} new products — eBay: ${results.ebay}, Best Buy: ${results.bestbuy}, Walmart: ${results.walmart}, errors: ${results.errors}`,
    }
  },
})
