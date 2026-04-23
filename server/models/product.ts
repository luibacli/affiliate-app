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
    lastPriceDrop: { type: Date, default: null },
  },
  { timestamps: true }
)

productSchema.index({ title: 'text', description: 'text' })
productSchema.index({ category: 1, price: 1 })

export type IProduct = InferSchemaType<typeof productSchema>

export const Product =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>('Product', productSchema)
