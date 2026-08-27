import mongoose from 'mongoose'

/**
 * Serverless-safe Mongo connection.
 *
 * Why this shape:
 *  - The connect promise is memoized, so N concurrent requests on a cold
 *    lambda share ONE handshake instead of racing N of them.
 *  - readyState 2 ("connecting") is NOT treated as connected — the old
 *    `readyState >= 1` check let queries through mid-handshake, where they
 *    sat in mongoose's buffer for bufferTimeoutMS (10s default) before failing.
 *  - bufferCommands is off: with the promise awaited properly there is nothing
 *    legitimate to buffer, and buffering only converts a fast failure into a
 *    10s hang.
 *  - autoIndex is off in production: mongoose otherwise re-verifies every index
 *    on every cold start, which is pure added latency on the slowest request.
 *    Run `npm run db:indexes` after a deploy that changes a schema index.
 */

mongoose.set('bufferCommands', false)
mongoose.set('strictQuery', true)

const SERVER_SELECTION_TIMEOUT_MS = 3000

/*
 * Circuit breaker.
 *
 * When Mongo is unreachable, every endpoint on a page used to pay the full
 * server-selection timeout independently — a page with three API calls sat
 * there for three timeouts. After a failure we refuse fast for a short window
 * so one request absorbs the wait and the rest fall straight through to their
 * cached/stale values. The window is short enough that recovery is not delayed
 * noticeably.
 */
const BREAKER_COOLDOWN_MS = 5000

let connectPromise: Promise<typeof mongoose> | null = null
let lastFailureAt = 0

export class DBUnavailableError extends Error {
  constructor() {
    super('Database unavailable (circuit open)')
    this.name = 'DBUnavailableError'
  }
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return

  if (!connectPromise && Date.now() - lastFailureAt < BREAKER_COOLDOWN_MS) {
    throw new DBUnavailableError()
  }

  if (!connectPromise) {
    const { mongoUri } = useRuntimeConfig()
    if (!mongoUri) throw new Error('MONGO_URI is not set')

    connectPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 20000,
        maxPoolSize: 10,
        minPoolSize: 0,
        maxIdleTimeMS: 60000,
        autoIndex: process.env.NODE_ENV !== 'production',
        compressors: ['zstd'],
      })
      .catch((err) => {
        // Never cache a failed handshake — the next request must retry, but
        // only after the cooldown above.
        connectPromise = null
        lastFailureAt = Date.now()
        throw err
      })
  }

  await connectPromise
}

/** True when the DB is reachable, without throwing. Used by degraded-mode paths. */
export function isDBReady() {
  return mongoose.connection.readyState === 1
}
