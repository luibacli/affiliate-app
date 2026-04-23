import Redis from 'ioredis'

let client: Redis | null = null

export function getRedis(): Redis {
  if (!client) {
    const { redisUrl } = useRuntimeConfig()
    client = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 })
    client.on('error', () => {}) // suppress unhandled error events
  }
  return client
}

export async function cacheGet(key: string) {
  try {
    const val = await getRedis().get(key)
    return val ? JSON.parse(val) : null
  } catch {
    return null
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 60) {
  try {
    await getRedis().setex(key, ttlSeconds, JSON.stringify(value))
  } catch {}
}

export async function cacheDel(...keys: string[]) {
  try { await getRedis().del(...keys) } catch {}
}

export async function cacheIncr(key: string, ttlSeconds: number): Promise<number> {
  try {
    const redis = getRedis()
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, ttlSeconds)
    return count
  } catch {
    return 0
  }
}
