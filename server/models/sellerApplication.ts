import mongoose, { type InferSchemaType } from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    businessName: { type: String, required: true, trim: true },
    niche: { type: String, required: true },
    websiteUrl: { type: String, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected'],
      default: 'submitted',
      index: true,
    },
    reviewNote: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
)

export type ISellerApplication = InferSchemaType<typeof applicationSchema>

export const SellerApplication =
  (mongoose.models.SellerApplication as mongoose.Model<ISellerApplication>) ||
  mongoose.model<ISellerApplication>('SellerApplication', applicationSchema)
