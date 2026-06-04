export interface WalmartConfig {
  impactSid: string
  impactAuth: string
  catalogId: string
}

export interface WalmartProduct {
  walmartItemId: string
  title: string
  price: number
  originalPrice?: number
  imageUrl: string
  affiliateUrl: string
  rating: number
}

export async function searchWalmart(keyword: string, cfg: WalmartConfig): Promise<WalmartProduct[]> {
  const url = new URL(`https://api.impact.com/Mediapartners/${cfg.impactSid}/Catalogs/${cfg.catalogId}/Items`)
  url.searchParams.set('Keywords', keyword)
  url.searchParams.set('PageSize', '20')

  const credentials = Buffer.from(`${cfg.impactSid}:${cfg.impactAuth}`).toString('base64')
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${credentials}` },
  })

  if (!res.ok) throw new Error(`Walmart/Impact API error: ${res.status} ${await res.text()}`)
  const data = await res.json()

  return (data.Items ?? [])
    .filter((item: any) => item.Price && item.DirectLink)
    .map((item: any) => ({
      walmartItemId: String(item.Id),
      title: item.Name,
      price: Number(item.Price),
      originalPrice: item.OriginalPrice > item.Price ? Number(item.OriginalPrice) : undefined,
      imageUrl: item.Images?.[0]?.Url ?? '',
      affiliateUrl: item.DirectLink,
      rating: 0,
    }))
}

export function getWalmartConfig(): WalmartConfig {
  const c = useRuntimeConfig()
  return {
    impactSid: c.walmartImpactSid as string,
    impactAuth: c.walmartImpactAuth as string,
    catalogId: c.walmartImpactCatalogId as string,
  }
}
