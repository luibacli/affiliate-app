<script setup lang="ts">
defineRouteRules({ prerender: true })

import { SEO_PAGES } from '~/data/seoPages'

const { siteUrl } = useRuntimeConfig().public

const groups = [
  { label: 'Gaming', slugs: ['best-gaming-mouse-2026', 'best-gaming-headsets', 'best-gaming-keyboards', 'best-gaming-laptops-under-1000'] },
  { label: 'Audio', slugs: ['best-wireless-earbuds', 'best-wireless-earbuds-under-100', 'best-noise-cancelling-headphones'] },
  { label: 'Phones', slugs: ['best-smartphones-2026', 'best-budget-phones'] },
  { label: 'Laptops', slugs: ['best-laptops-under-500', 'best-laptops-for-college'] },
  { label: 'Home', slugs: ['best-air-fryers', 'best-robot-vacuums', 'best-smart-home-devices'] },
  { label: 'Accessories', slugs: ['best-wireless-chargers', 'best-usb-c-hubs'] },
  { label: 'Deals', slugs: ['best-deals-today', 'best-products-under-50'] },
]

const pagesBySlug = Object.fromEntries(SEO_PAGES.map(p => [p.slug, p]))

useSeoMeta({
  title: 'Best Product Collections — Price Comparison Guides | WinRose',
  description: 'Browse curated buying guides and price comparisons across eBay, Best Buy, and Walmart. Find the best deal on gaming gear, laptops, phones, and more.',
  ogTitle: 'Best Product Collections | WinRose',
  ogDescription: 'Curated buying guides comparing prices across eBay, Best Buy, and Walmart. Updated daily.',
  ogType: 'website',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/collections` }],
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">

    <!-- Header -->
    <div class="mb-10 text-center max-w-2xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Product Collections</h1>
      <p class="text-gray-500 text-sm leading-relaxed">
        Curated buying guides with prices compared daily across eBay, Best Buy, and Walmart.
        Find the best deal on any product, updated automatically.
      </p>
    </div>

    <!-- Groups -->
    <div v-for="group in groups" :key="group.label" class="mb-10">
      <h2 class="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
        {{ group.label }}
        <span class="h-px flex-1 bg-gray-100" />
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <NuxtLink
          v-for="slug in group.slugs"
          :key="slug"
          :to="`/collections/${slug}`"
          class="group bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <p class="font-semibold text-gray-800 text-sm group-hover:text-primary-600 transition-colors leading-snug">
            {{ pagesBySlug[slug]?.h1 }}
          </p>
          <p class="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
            {{ pagesBySlug[slug]?.description }}
          </p>
          <span class="inline-block mt-3 text-xs font-bold text-primary-600 group-hover:underline">
            View guide →
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
