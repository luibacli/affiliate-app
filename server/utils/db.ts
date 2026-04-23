import mongoose from 'mongoose'

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  const { mongoUri } = useRuntimeConfig()
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
}
