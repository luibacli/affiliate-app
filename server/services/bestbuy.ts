export interface BestBuyConfig {
  apiKey: string
  cjPublisherId: string
}

export interface BestBuyProduct {
  bestBuySkuId: string
  title: string
  price: number
  originalPrice?: number
  imageUrl: string
  affiliateUrl: string
  rating: number
}

const SHOW_FIELDS = 'sku,name,regularPrice,salePrice,image,url,customerReviewAverage'
const BESTBUY_CJ_ADVERTISER = '10696860'

function buildAffiliateUrl(productUrl: string, publisherId: string): string {
  return `https://www.jdoqocy.com/click-${publisherId}-${BESTBUY_CJ_ADVERTISER}?url=${encodeURIComponent(productUrl)}`
}

export async function searchBestBuy(keyword: string, cfg: BestBuyConfig): Promise<BestBuyProduct[]> {
  const url = new URL('https://api.bestbuy.com/v1/products')
  url.pathname += `(search=${encodeURIComponent(keyword)})`
  url.searchParams.set('apiKey', cfg.apiKey)
  url.searchParams.set('format', 'json')
  url.searchParams.set('show', SHOW_FIELDS)
  url.searchParams.set('pageSize', '20')
  url.searchParams.set('sort', 'bestSellingRank.asc')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Best Buy API error: ${res.status} ${await res.text()}`)
  const data = await res.json()

  return (data.products ?? [])
    .filter((p: any) => p.salePrice && p.image)
    .map((p: any) => ({
      bestBuySkuId: String(p.sku),
      title: p.name,
      price: Number(p.salePrice),
      originalPrice: p.regularPrice > p.salePrice ? Number(p.regularPrice) : undefined,
      imageUrl: p.image,
      affiliateUrl: buildAffiliateUrl(p.url, cfg.cjPublisherId),
      rating: Number(p.customerReviewAverage) || 0,
    }))
}

export function getBestBuyConfig(): BestBuyConfig {
  const c = useRuntimeConfig()
  return {
    apiKey: c.bestBuyApiKey as string,
    cjPublisherId: c.bestBuyCjPublisherId as string,
  }
}
