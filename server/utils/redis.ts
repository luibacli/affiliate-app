import Redis from 'ioredis'
import type { H3Event } from 'h3'

let client: Redis | null = null

export function getRedis(): Redis {
  if (!client) {
    const { redisUrl } = useRuntimeConfig()
    client = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      // Bounds every command, so an unreachable cache costs 1.5s once rather
      // than hanging. The offline queue stays enabled: with lazyConnect the
      // first command is what triggers the connect, and it needs somewhere to
      // wait while the handshake completes.
      commandTimeout: 1500,
      // Give up reconnecting quickly — a dead cache must never become the
      // thing that makes the site slow.
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 1000)),
    })
    client.on('error', () => {}) // suppress unhandled error events
  }
  return client
}

/* ------------------------------------------------------------------ *
 * Per-instance micro-cache
 *
 * Redis lives in us-east-1; a lambda elsewhere pays a round trip per
 * get AND per set. Hot keys are held in-process for a few seconds so a
 * burst of requests on one warm instance costs zero network hops.
 * ------------------------------------------------------------------ */
const LOCAL_TTL_MS = 5000
const LOCAL_MAX = 200
const local = new Map<string, { d: any; e: number }>()

function localGet(key: string) {
  const hit = local.get(key)
  if (!hit) return undefined
  if (Date.now() > hit.e) { local.delete(key); return undefined }
  return hit.d
}

function localSet(key: string, d: any) {
  if (local.size >= LOCAL_MAX) local.delete(local.keys().next().value as string)
  local.set(key, { d, e: Date.now() + LOCAL_TTL_MS })
}

/* ------------------------------------------------------------------ *
 * Raw get/set — kept for existing call sites
 * ------------------------------------------------------------------ */
export async function cacheGet(key: string) {
  const hit = localGet(key)
  if (hit !== undefined) return hit
  try {
    const val = await getRedis().get(key)
    const parsed = val ? JSON.parse(val) : null
    if (parsed !== null) localSet(key, parsed)
    return parsed
  } catch {
    return null
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 60) {
  localSet(key, value)
  try {
    await getRedis().setex(key, ttlSeconds, JSON.stringify(value))
  } catch {}
}

export async function cacheDel(...keys: string[]) {
  for (const k of keys) local.delete(k)
  try { await getRedis().del(...keys) } catch {}
}

/** Invalidate every key matching a prefix (e.g. 'products:'). */
export async function cacheDelPrefix(prefix: string) {
  for (const k of [...local.keys()]) if (k.startsWith(prefix)) local.delete(k)
  try {
    const redis = getRedis()
    let cursor = '0'
    do {
      const [next, found] = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 200)
      cursor = next
      if (found.length) await redis.del(...found)
    } while (cursor !== '0')
  } catch {}
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

/* ------------------------------------------------------------------ *
 * cached() — stale-while-revalidate
 *
 * The entry is held in Redis far longer than its freshness window, so:
 *   fresh  -> return immediately
 *   stale  -> return immediately, refresh in the background
 *   miss   -> compute, store, return
 *   error  -> fall back to stale if we have any
 *
 * The last line is the important one: a Mongo blip or cold cluster
 * degrades to slightly-old data instead of a 500 and a spinner.
 * ------------------------------------------------------------------ */
type Entry<T> = { d: T; e: number }

/** How long a stale entry stays usable as a fallback after it expires. */
const STALE_GRACE_SECONDS = 86400

const inflight = new Map<string, Promise<any>>()

export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
  event?: H3Event
): Promise<T> {
  const now = Date.now()

  let entry: Entry<T> | null = localGet(key) ?? null
  if (!entry) {
    try {
      const raw = await getRedis().get(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        // Tolerate entries written by the older cacheSet() shape.
        entry = parsed && typeof parsed === 'object' && 'e' in parsed && 'd' in parsed
          ? parsed as Entry<T>
          : { d: parsed as T, e: 0 }
        localSet(key, entry)
      }
    } catch {}
  }

  if (entry && entry.e > now) return entry.d

  const revalidate = (): Promise<T> => {
    let p = inflight.get(key)
    if (!p) {
      p = fn()
        .then(async (data) => {
          const next: Entry<T> = { d: data, e: Date.now() + ttlSeconds * 1000 }
          localSet(key, next)
          try {
            await getRedis().setex(key, ttlSeconds + STALE_GRACE_SECONDS, JSON.stringify(next))
          } catch {}
          return data
        })
        .finally(() => inflight.delete(key))
      inflight.set(key, p)
    }
    return p
  }

  // Stale hit: serve now, refresh behind the response.
  if (entry) {
    const bg = revalidate().catch(() => {})
    // On serverless the instance can freeze once the response is flushed;
    // waitUntil keeps the refresh alive so the next visitor gets fresh data.
    event?.waitUntil?.(bg)
    return entry.d
  }

  // Cold miss: nothing cached to fall back on, so the caller waits.
  return revalidate()
}
