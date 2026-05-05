<script setup lang="ts">
const { data: featuredData } = await useAsyncData('landing-featured', () =>
  $fetch<any>('/api/products', { query: { limit: 6, sort: 'newest' } }).catch(() => null)
)

const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: 'SmartBuy Hub — All the Best Deals in One Place',
  description: 'Discover products from Amazon, Walmart, Shopee, and more — all in one platform. Compare deals, save money, and earn as an affiliate contributor.',
  ogTitle: 'SmartBuy Hub — Best Deals from Every Platform',
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
      name: 'SmartBuy Hub',
      url: siteUrl,
      description: 'Affiliate marketplace aggregating deals from top e-commerce platforms globally.',
    }),
  }],
})
</script>

<template>
  <div>
    <LandingHero />
    <LandingWhatIsThis />
    <LandingHowItWorks />
    <LandingBenefits />
    <LandingFeaturedProducts :products="featuredData?.products ?? []" />
    <LandingAffiliateInvite />
  </div>
</template>
