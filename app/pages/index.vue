<script setup lang="ts">
/*
 * Everything the first paint depends on is fetched in one blocking call, so
 * these requests run concurrently. The category fetch previously lived inside
 * <LandingCategoryGrid>, where it only started once the page's own fetch had
 * resolved — two serialised round trips on every server render.
 */
const { data: aboveFold } = await useAsyncData('landing-v2-above-fold', async () => {
  // retry: 0 — these are in-process calls to our own API. ofetch retries 500s
  // by default, so a slow-failing request was being run twice, doubling the
  // worst case instead of failing over to the cached fallback.
  const opts = { retry: 0 } as const
  const [products, categories, trending] = await Promise.all([
    $fetch<any>('/api/products', { ...opts, query: { limit: 12, sort: 'newest' } }).catch(() => null),
    $fetch<any[]>('/api/categories', opts).catch(() => []),
    // Trending is the default tab, so it has to be server-rendered. Fetched
    // lazily it left the page's most valuable slot showing eight skeleton
    // boxes on every first paint, until a client-side round trip filled it in.
    $fetch<any[]>('/api/trending', opts).catch(() => []),
  ])
  return { products, categories, trending }
})

const productsData = computed(() => aboveFold.value?.products ?? null)
const categoriesData = computed(() => aboveFold.value?.categories ?? [])
const trendingData = computed(() => aboveFold.value?.trending ?? [])

// Below the fold and behind non-default tabs — safe to load after hydration.
const { data: recsData } = useAsyncData('landing-v2-recs', () =>
  $fetch<any>('/api/recommendations', { retry: 0 }).catch(() => null),
  { lazy: true }
)

const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: 'WinRose — All the Best Deals in One Place',
  description: 'Discover products from Amazon, Walmart, eBay, AliExpress, and more — all in one platform. Compare deals, save money, and earn as an affiliate contributor.',
  ogTitle: 'WinRose — Best Deals from Every Platform',
  ogDescription: 'All the best deals from top online shopping platforms in one place. Free to use, updated daily.',
  ogType: 'website',
  ogImage: `${siteUrl}/og-default.png`,
})

useHead({
  link: [{ rel: 'canonical', href: siteUrl }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'WinRose',
      url: siteUrl,
      description: 'Affiliate marketplace aggregating deals from top e-commerce platforms globally.',
    }),
  }],
})
</script>

<template>
  <div>
    <!-- 1. Hero — dark, search-first, stats -->
    <LandingHero />

    <!-- 2. Featured products with tabs -->
    <LandingFeaturedProducts
      :newest="productsData?.products ?? []"
      :trending="trendingData ?? []"
      :best-value="recsData?.bestValue ?? []"
      :top-rated="recsData?.topRated ?? []"
      :budget-picks="recsData?.budgetPicks ?? []"
    />

    <!-- 3. Category discovery grid -->
    <LandingCategoryGrid :categories="categoriesData" />

    <!-- 4. How it works — dark, 3 steps -->
    <LazyLandingHowItWorks />

    <!-- 5. Social proof + trust signals -->
    <LazyLandingSocialProof />

    <!-- 7. Final CTA — dark, conversion -->
    <LazyLandingFinalCTA />
  </div>
</template>
