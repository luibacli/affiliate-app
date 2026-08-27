/**
 * Syncs schema indexes and backfills legacy fields.
 *
 * Run after any deploy that changes a schema index. Production sets
 * autoIndex:false so cold starts don't pay to re-verify indexes, which makes
 * this script the thing that actually creates them.
 *
 *   npm run db:indexes
 */
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'

// Minimal .env loader so the script runs without extra deps.
try {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const i = line.indexOf('=')
    if (i < 1 || line.trim().startsWith('#')) continue
    const k = line.slice(0, i).trim()
    if (!process.env[k]) process.env[k] = line.slice(i + 1).trim()
  }
} catch {}

const uri = process.env.MONGO_URI
if (!uri) {
  console.error('MONGO_URI is not set')
  process.exit(1)
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
console.log('connected')

const products = mongoose.connection.db.collection('products')

// 1. Backfill isActive so the equality filter in ACTIVE matches every live doc.
const backfill = await products.updateMany(
  { isActive: { $exists: false } },
  { $set: { isActive: true } }
)
console.log(`isActive backfilled on ${backfill.modifiedCount} document(s)`)

const nulls = await products.updateMany(
  { isActive: null },
  { $set: { isActive: true } }
)
console.log(`isActive null->true on ${nulls.modifiedCount} document(s)`)

// 2. Create the listing indexes.
const INDEXES = [
  { key: { isActive: 1, createdAt: -1 }, name: 'isActive_1_createdAt_-1' },
  { key: { isActive: 1, price: 1 }, name: 'isActive_1_price_1' },
  { key: { isActive: 1, price: -1 }, name: 'isActive_1_price_-1' },
  { key: { isActive: 1, rating: -1 }, name: 'isActive_1_rating_-1' },
  { key: { isActive: 1, category: 1, createdAt: -1 }, name: 'isActive_1_category_1_createdAt_-1' },
  { key: { isActive: 1, category: 1, price: 1 }, name: 'isActive_1_category_1_price_1' },
]

await products.createIndexes(INDEXES.map(i => ({ ...i, background: true })))
console.log(`ensured ${INDEXES.length} listing indexes`)

console.log('\ncurrent indexes on products:')
for (const i of await products.indexes()) console.log(' ', i.name)

await mongoose.disconnect()
console.log('\ndone')
