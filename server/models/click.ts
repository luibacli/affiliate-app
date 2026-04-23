import mongoose from 'mongoose'

const clickSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    slug: { type: String, required: true },
    source: { type: String, default: 'unknown' }, // traffic source: homepage, search, category, best
    referrer: String,
    userAgent: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

clickSchema.index({ slug: 1, createdAt: -1 })
clickSchema.index({ productId: 1, createdAt: -1 })
clickSchema.index({ source: 1 })

export const Click =
  (mongoose.models.Click as mongoose.Model<any>) ||
  mongoose.model('Click', clickSchema)
