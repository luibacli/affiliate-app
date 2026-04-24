import mongoose, { type InferSchemaType } from 'mongoose'

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: 'general' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    ip: { type: String, default: null },
  },
  { timestamps: true }
)

export type IContactMessage = InferSchemaType<typeof contactMessageSchema>

export const ContactMessage =
  (mongoose.models.ContactMessage as mongoose.Model<IContactMessage>) ||
  mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema)
