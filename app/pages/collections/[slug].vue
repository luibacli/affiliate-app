<script setup lang="ts">
import { SEO_PAGES } from '~/data/seoPages'

const route = useRoute()
const slug = route.params.slug as string
const { siteUrl } = useRuntimeConfig().public

const seoPage = SEO_PAGES.find(p => p.slug === slug)
if (!seoPage) throw createError({ statusCode: 404, message: 'Collection not found' })

const { data, error } = await useAsyncData(
  `collection-${slug}`,
  () => $fetch<any>(`/api/collections/${slug}`)
)
if (error.value) throw createError({ statusCode: 404, message: 'Collection not found' })

const relatedPages = SEO_PAGES.filter(p => seoPage.related.includes(p.slug))

useSeoMeta({
  title: seoPage.title,
  description: seoPage.description,
  ogTitle: seoPage.title,
  ogDescription: seoPage.description,
  ogType: 'website',
  ogImage: `${siteUrl}/og-default.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/collections/${slug}` }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Collections', item: `${siteUrl}/collections` },
          { '@type': 'ListItem', position: 3, name: seoPage.h1, item: `${siteUrl}/collections/${slug}` },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: seoPage.h1,
        description: seoPage.description,
        numberOfItems: data.value?.products?.length ?? 0,
        itemListElement: (data.value?.products ?? []).map((p: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.title,
          url: `${siteUrl}/products/${p.slug}`,
        })),
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seoPage.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div>
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-gray-500">
        <NuxtLink to="/" class="hover:text-primary-600 transition-colors">Home</NuxtLink>
        <span>›</span>
        <NuxtLink to="/collections" class="hover:text-primary-600 transition-colors">Collections</NuxtLink>
        <span>›</span>
        <span class="text-gray-700 line-clamp-1">{{ seoPage.h1 }}</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">

      <!-- Hero -->
      <div class="mb-8">
        <span class="inline-block text-xs font-bold px-3 py-1 bg-accent-100 text-accent-700 rounded-full mb-3">
          Updated Daily
        </span>
        <h1 class="text-3xl sm:text-4xl font-black text-gray-900 mb-4 leading-tight">
          {{ seoPage.h1 }}
        </h1>

        <!-- Intro paragraph -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 mb-6 max-w-3xl">
          <p class="text-sm text-gray-600 leading-relaxed">{{ seoPage.intro }}</p>
          <!-- Platform trust badges -->
          <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span class="text-xs text-gray-400">Prices compared from:</span>
            <span class="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">eBay</span>
            <span class="text-xs font-semibold px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full">Best Buy</span>
            <span class="text-xs font-semibold px-2.5 py-1 bg-blue-600 text-white rounded-full">Walmart</span>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div
        v-if="data?.products?.length"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-12"
      >
        <ProductCard
          v-for="(product, i) in data.products"
          :key="product._id"
          :product="product"
          :traffic-source="`collection-${slug}`"
          :label="i === 0 ? 'Top Pick' : undefined"
        />
      </div>

      <div v-else class="py-16 text-center text-gray-400 mb-12">
        <p class="text-4xl mb-3">🔄</p>
        <p class="font-medium text-gray-600">Products loading soon</p>
        <p class="text-sm mt-1">Our auto-discovery system is populating this collection. Check back shortly.</p>
      </div>

      <!-- CTA Banner -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 text-white text-center mb-12">
        <h2 class="text-xl font-black mb-2">Don't miss a price drop</h2>
        <p class="text-primary-100 text-sm mb-4">We compare prices across eBay, Best Buy, and Walmart daily. Bookmark this page to always find the lowest deal.</p>
        <NuxtLink
          to="/shop"
          class="inline-block px-6 py-2.5 bg-white text-primary-700 font-bold text-sm rounded-xl hover:bg-primary-50 transition-colors"
        >
          Browse all deals →
        </NuxtLink>
      </div>

      <!-- FAQ -->
      <div class="mb-12 max-w-2xl">
        <h2 class="text-xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <details
            v-for="faq in seoPage.faqs"
            :key="faq.q"
            class="group bg-white rounded-xl border border-gray-100 px-5 py-4 cursor-pointer"
          >
            <summary class="font-semibold text-gray-800 text-sm list-none flex items-center justify-between gap-3">
              {{ faq.q }}
              <span class="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0">▾</span>
            </summary>
            <p class="text-sm text-gray-600 leading-relaxed mt-3 pt-3 border-t border-gray-100">{{ faq.a }}</p>
          </details>
        </div>
      </div>

      <!-- Related collections -->
      <div v-if="relatedPages.length">
        <h2 class="text-xl font-black text-gray-900 mb-4">Related Collections</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <NuxtLink
            v-for="related in relatedPages"
            :key="related.slug"
            :to="`/collections/${related.slug}`"
            class="group bg-white rounded-xl border border-gray-100 p-4 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <p class="font-semibold text-gray-800 text-sm group-hover:text-primary-600 transition-colors">{{ related.h1 }}</p>
            <p class="text-xs text-gray-400 mt-1 line-clamp-2">{{ related.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
