/**
 * Amazon Product Advertising API v5
 * Requires: Amazon Associates account + PA-API access approval
 * Env vars: AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG,
 *           AMAZON_REGION (default: us-east-1), AMAZON_MARKETPLACE (default: www.amazon.com)
 */
import crypto from 'node:crypto'

type Operation = 'SearchItems' | 'GetItems'

export interface AmazonConfig {
  accessKey: string
  secretKey: string
  partnerTag: string
  region: string
  marketplace: string
}

export interface PAProduct {
  asin: string
  title: string
  price: number
  originalPrice?: number
  imageUrl: string
  affiliateUrl: string
  rating: number
}

const REGION_HOST: Record<string, string> = {
  'us-east-1': 'webservices.amazon.com',
  'eu-west-1': 'webservices.amazon.co.uk',
  'ap-southeast-1': 'webservices.amazon.sg',
  'ap-northeast-1': 'webservices.amazon.co.jp',
}

const RESOURCES = [
  'Images.Primary.Large',
  'ItemInfo.Title',
  'Offers.Listings.Price',
  'Offers.Listings.Price.SavingBasis',
]

function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest()
}
function sha256hex(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex')
}

function buildRequest(op: Operation, payload: object, cfg: AmazonConfig) {
  const host = REGION_HOST[cfg.region] ?? 'webservices.amazon.com'
  const path = `/paapi5/${op.toLowerCase()}`
  const target = `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${op}`

  const amzDate = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const dateStamp = amzDate.slice(0, 8)

  const body = JSON.stringify({
    ...payload,
    PartnerTag: cfg.partnerTag,
    PartnerType: 'Associates',
    Marketplace: cfg.marketplace,
  })

  const canonicalHeaders =
    `content-encoding:amz-1.0\n` +
    `content-type:application/json; charset=UTF-8\n` +
    `host:${host}\n` +
    `x-amz-date:${amzDate}\n` +
    `x-amz-target:${target}\n`
  const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target'

  const scope = `${dateStamp}/${cfg.region}/ProductAdvertisingAPI/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256', amzDate, scope,
    sha256hex(['POST', path, '', canonicalHeaders, signedHeaders, sha256hex(body)].join('\n')),
  ].join('\n')

  const sigKey = hmac(
    hmac(hmac(hmac(`AWS4${cfg.secretKey}`, dateStamp), cfg.region), 'ProductAdvertisingAPI'),
    'aws4_request',
  )

  const sig = hmac(sigKey, stringToSign).toString('hex')

  return {
    url: `https://${host}${path}`,
    headers: {
      'content-encoding': 'amz-1.0',
      'content-type': 'application/json; charset=UTF-8',
      'host': host,
      'x-amz-date': amzDate,
      'x-amz-target': target,
      'authorization': `AWS4-HMAC-SHA256 Credential=${cfg.accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${sig}`,
    },
    body,
  }
}

function parseItem(item: any, partnerTag?: string): PAProduct | null {
  const asin = item.ASIN
  const title = item.ItemInfo?.Title?.DisplayValue
  const price = item.Offers?.Listings?.[0]?.Price?.Amount
  if (!asin || !title || !price) return null

  return {
    asin,
    title,
    price: Number(price),
    originalPrice: item.Offers?.Listings?.[0]?.Price?.SavingBasis?.Amount
      ? Number(item.Offers.Listings[0].Price.SavingBasis.Amount)
      : undefined,
    imageUrl: item.Images?.Primary?.Large?.URL ?? '',
    affiliateUrl: item.DetailPageURL ?? `https://www.amazon.com/dp/${asin}?tag=${partnerTag ?? ''}`,
    rating: 0,
  }
}

export async function searchItems(keywords: string, cfg: AmazonConfig): Promise<PAProduct[]> {
  const req = buildRequest('SearchItems', { Keywords: keywords, SearchIndex: 'All', Resources: RESOURCES, ItemCount: 10 }, cfg)
  const res = await fetch(req.url, { method: 'POST', headers: req.headers, body: req.body })
  if (!res.ok) throw new Error(`PA-API SearchItems ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return (data.SearchResult?.Items ?? []).map((i: any) => parseItem(i, cfg.partnerTag)).filter(Boolean) as PAProduct[]
}

export async function getItems(asins: string[], cfg: AmazonConfig): Promise<PAProduct[]> {
  const req = buildRequest('GetItems', { ItemIds: asins.slice(0, 10), Resources: RESOURCES }, cfg)
  const res = await fetch(req.url, { method: 'POST', headers: req.headers, body: req.body })
  if (!res.ok) return []
  const data = await res.json()
  return (data.ItemsResult?.Items ?? []).map((i: any) => parseItem(i, cfg.partnerTag)).filter(Boolean) as PAProduct[]
}

export function getAmazonConfig(): AmazonConfig {
  const c = useRuntimeConfig()
  return {
    accessKey: c.amazonAccessKey as string,
    secretKey: c.amazonSecretKey as string,
    partnerTag: c.amazonPartnerTag as string,
    region: (c.amazonRegion as string) || 'us-east-1',
    marketplace: (c.amazonMarketplace as string) || 'www.amazon.com',
  }
}
