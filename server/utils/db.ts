import mongoose from 'mongoose'

let connected = false

export async function connectDB() {
  if (connected) return
  const { mongoUri } = useRuntimeConfig()
  await mongoose.connect(mongoUri)
  connected = true
}
