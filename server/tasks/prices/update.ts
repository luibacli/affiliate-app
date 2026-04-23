import { connectDB } from '../../utils/db'
import { cacheDel } from '../../utils/redis'
import { Product } from '../../models/product'
import { PriceHistory } from '../../models/priceHistory'
import { getItems, getAmazonConfig } from '../../services/amazon'

async function lowest30d(productId: unknown): Promise<number | null> {
  const since = new Date(Date.now() - 30 * 86400000)
  const rows = await PriceHistory.find({ productId, createdAt: { $gte: since } }).select('price').lean()
  return rows.length ? Math.min(...rows.map((r: any) => r.price)) : null
}

export default defineTask({
  meta: { name: 'prices:update', description: 'Refresh Amazon product prices every 6 hours' },
  async run() {
    await connectDB()
    const cfg = getAmazonConfig()

    const products = await Product.find({ asin: { $exists: true, $ne: '' } }).select('_id asin price slug').lean()
    if (!products.length) return { result: 'no amazon products' }

    const BATCH = 10
    let updated = 0

    for (let i = 0; i < products.length; i += BATCH) {
      const batch = products.slice(i, i + BATCH)
      const asins = batch.map((p: any) => p.asin)

      let fresh: any[]
      try {
        fresh = await getItems(asins, cfg)
      } catch {
        continue
      }

      for (const item of fresh) {
        const product = batch.find((p: any) => p.asin === item.asin)
        if (!product) continue

        const oldPrice = Number(product.price)
        const newPrice = Number(item.price)
        if (newPrice === oldPrice) continue

        const update: any = { price: newPrice }
        if (newPrice < oldPrice) update.lastPriceDrop = new Date()

        await PriceHistory.create({ productId: product._id, price: newPrice, source: 'amazon-cron' })
        update.lowestPrice30d = await lowest30d(product._id)
        await Product.updateOne({ _id: product._id }, { $set: update })

        if (product.slug) await cacheDel(`product:${product.slug}`, `compare:${product.slug}`, `related:${product.slug}`)
        updated++
      }
    }

    return { result: `updated ${updated} prices` }
  },
})
