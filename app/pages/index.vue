<script setup lang="ts">
const { data: productsData } = await useAsyncData('landing-v2-featured', () =>
  $fetch<any>('/api/products', { query: { limit: 12, sort: 'newest' } }).catch(() => null)
)
const { data: trendingData } = useAsyncData('landing-v2-trending', () =>
  $fetch<any[]>('/api/trending').catch(() => []),
  { lazy: true }
)
const { data: recsData } = useAsyncData('landing-v2-recs', () =>
  $fetch<any>('/api/recommendations').catch(() => null),
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
    <LandingCategoryGrid />

    <!-- 4. How it works — dark, 3 steps -->
    <LazyLandingHowItWorks />

    <!-- 5. Social proof + trust signals -->
    <LazyLandingSocialProof />

    <!-- 7. Final CTA — dark, conversion -->
    <LazyLandingFinalCTA />
  </div>
</template>
