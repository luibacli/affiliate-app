import mongoose, { type InferSchemaType } from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    affiliateUrl: { type: String, required: true },
    imageUrl: String,
    category: { type: String, index: true },
    tags: [String],
    source: String,
    slug: { type: String, unique: true, sparse: true },
    compareGroupId: { type: String, index: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    asin: { type: String, sparse: true, index: true },
    ebayItemId: { type: String, sparse: true, index: true },
    bestBuySkuId: { type: String, sparse: true, index: true },
    walmartItemId: { type: String, sparse: true, index: true },
    aliexpressProductId: { type: String, unique: true, sparse: true, index: true },
    sales180Day: { type: Number, default: 0 },
    positiveFeedback: { type: Number, default: null },
    discountPercent: { type: Number, default: 0 },
    priceMayVary: { type: Boolean, default: false },
    couponCode: { type: String, default: null },
    couponValue: { type: Number, default: null },
    couponMinSpend: { type: Number, default: null },
    couponExpiresAt: { type: Date, default: null },
    lastPriceDrop: { type: Date, default: null },
    isFeatured: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isBestDeal: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    currency: { type: String, default: 'USD' },
    lowestPrice30d: { type: Number, default: null },
  },
  { timestamps: true }
)

productSchema.index({ title: 'text', description: 'text' })
productSchema.index({ sales180Day: -1 })

/*
 * Listing indexes.
 *
 * Every public listing filters on isActive and then sorts. Without a matching
 * compound index Mongo does a COLLSCAN plus an in-memory SORT on each of
 * these — the single biggest cost on a cold homepage or /shop request.
 *
 * isActive leads each key so the filter is an index prefix; the sort field
 * follows so the sort is satisfied by the index walk rather than a SORT stage.
 */
productSchema.index({ isActive: 1, createdAt: -1 })            // default + ?sort=newest
productSchema.index({ isActive: 1, price: 1 })                 // ?sort=price_asc, budget picks
productSchema.index({ isActive: 1, price: -1 })                // ?sort=price_desc
productSchema.index({ isActive: 1, rating: -1 })               // top rated
productSchema.index({ isActive: 1, category: 1, createdAt: -1 }) // category listings
productSchema.index({ isActive: 1, category: 1, price: 1 })      // category + price sort

export type IProduct = InferSchemaType<typeof productSchema>

export const Product =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>('Product', productSchema)
