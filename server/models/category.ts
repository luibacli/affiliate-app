import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: '🏷️' },
  label: { type: String },
  sortOrder: { type: Number, default: 0 },
})

export const Category =
  (mongoose.models.Category as mongoose.Model<any>) ||
  mongoose.model('Category', categorySchema)
