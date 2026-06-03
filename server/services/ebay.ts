import { getRedis } from '../utils/redis'

export interface EbayConfig {
  clientId: string
  clientSecret: string
  campaignId: string
}

export interface EbayProduct {
  ebayItemId: string
  title: string
  price: number
  imageUrl: string
  affiliateUrl: string
  condition: string
  rating: number
}

const TOKEN_KEY = 'ebay:access_token'

async function getAccessToken(cfg: EbayConfig): Promise<string> {
  const cached = await getRedis().get(TOKEN_KEY).catch(() => null)
  if (cached) return cached

  const credentials = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString('base64')
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
  })

  if (!res.ok) throw new Error(`eBay OAuth failed: ${res.status} ${await res.text()}`)
  const data = await res.json()

  // Token expires in 7200s — cache for 1h50m to be safe
  await getRedis().setex(TOKEN_KEY, 6600, data.access_token).catch(() => {})
  return data.access_token as string
}

function buildAffiliateUrl(itemWebUrl: string, campaignId: string): string {
  const sep = itemWebUrl.includes('?') ? '&' : '?'
  return `${itemWebUrl}${sep}mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=${campaignId}&toolid=10001&mkevt=1`
}

function extractItemId(rawId: string): string {
  // Browse API returns "v1|123456789012|0" — we store the numeric part
  const parts = rawId.split('|')
  return parts[1] ?? rawId
}

export async function searchEbay(keyword: string, cfg: EbayConfig): Promise<EbayProduct[]> {
  const token = await getAccessToken(cfg)

  const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search')
  url.searchParams.set('q', keyword)
  url.searchParams.set('limit', '20')
  url.searchParams.set('sort', 'BEST_MATCH')
  url.searchParams.set('filter', 'conditions:{NEW|LIKE_NEW}')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'X-EBAY-C-ENDUSERCTX': `affiliateCampaignId=${cfg.campaignId}`,
    },
  })

  if (!res.ok) throw new Error(`eBay Browse API error: ${res.status} ${await res.text()}`)
  const data = await res.json()

  return (data.itemSummaries ?? [])
    .filter((item: any) => item.price?.value && item.image?.imageUrl)
    .map((item: any) => ({
      ebayItemId: extractItemId(item.itemId),
      title: item.title,
      price: Number(item.price.value),
      imageUrl: item.image.imageUrl,
      affiliateUrl: buildAffiliateUrl(item.itemWebUrl, cfg.campaignId),
      condition: item.condition ?? 'New',
      rating: 0,
    }))
}

export function getEbayConfig(): EbayConfig {
  const c = useRuntimeConfig()
  return {
    clientId: c.ebayClientId as string,
    clientSecret: c.ebayClientSecret as string,
    campaignId: c.ebayCampaignId as string,
  }
}
