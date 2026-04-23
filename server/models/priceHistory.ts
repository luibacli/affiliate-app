import mongoose from 'mongoose'

const priceHistorySchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    price: { type: Number, required: true },
    source: { type: String, default: 'manual' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

priceHistorySchema.index({ productId: 1, createdAt: -1 })

export const PriceHistory =
  (mongoose.models.PriceHistory as mongoose.Model<any>) ||
  mongoose.model('PriceHistory', priceHistorySchema)
