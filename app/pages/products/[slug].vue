<script setup lang="ts">
import { formatPrice } from '~/composables/usePrice'

const route = useRoute()
const slug = route.params.slug as string

const [{ data: product, error }, { data: compare }, { data: related }, { data: priceHistory }] = await Promise.all([
  useAsyncData(`product-${slug}`, () => $fetch<any>(`/api/products/${slug}`)),
  useAsyncData(`compare-${slug}`, () => $fetch<any>(`/api/products/${slug}/compare`)),
  useAsyncData(`related-${slug}`, () => $fetch<any[]>(`/api/products/${slug}/related`)),
  useAsyncData(`price-history-${slug}`, () => $fetch<any[]>(`/api/products/${slug}/price-history`).catch(() => [])),
])

if (error.value) throw createError({ statusCode: 404, message: 'Product not found' })

const affiliateLink = computed(() =>
  product.value?._id ? `/api/click?product_id=${product.value._id}&source=product-detail` : '#'
)

const savings = computed(() => {
  const p = product.value
  if (!p?.originalPrice || !p?.price || p.originalPrice <= p.price) return null
  return (p.originalPrice - p.price).toFixed(2)
})

const discountPct = computed(() => {
  const p = product.value
  if (!p?.originalPrice || !p?.price || p.originalPrice <= p.price) return 0
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
})

const isPriceDrop = computed(() => {
  if (!product.value?.lastPriceDrop) return false
  return new Date(product.value.lastPriceDrop) >= new Date(Date.now() - 7 * 86400000)
})

const isLowestPrice30d = computed(() => {
  if (!priceHistory.value?.length || !product.value) return false
  const since30d = Date.now() - 30 * 86400000
  const recent = priceHistory.value.filter((h: any) => new Date(h.createdAt).getTime() >= since30d)
  if (recent.length < 2) return false
  const min = Math.min(...recent.map((h: any) => h.price))
  return product.value.price <= min
})

const SOURCE_COLORS: Record<string, string> = {
  Shopee: 'bg-orange-100 text-orange-700',
  Lazada: 'bg-blue-100 text-blue-700',
  Amazon: 'bg-yellow-100 text-yellow-800',
}

const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: computed(() => product.value?.title ?? ''),
  description: computed(() => product.value?.description ?? `Buy ${product.value?.title} at the best price.`),
  ogTitle: computed(() => product.value?.title ?? ''),
  ogDescription: computed(() => product.value?.description ?? ''),
  ogImage: computed(() => product.value?.imageUrl ?? `${siteUrl}/og-default.png`),
  ogType: 'product',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/products/${slug}` }],
  script: computed(() => {
    if (!product.value) return []
    const scripts: any[] = [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.value.title,
          description: product.value.description,
          image: product.value.imageUrl,
          ...(product.value.rating > 0 && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.value.rating,
              bestRating: 5,
              reviewCount: 1,
            },
          }),
          offers: {
            '@type': 'Offer',
            price: product.value.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${siteUrl}/products/${slug}`,
          },
        }),
      },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            ...(product.value.category ? [{
              '@type': 'ListItem',
              position: 2,
              name: product.value.category.charAt(0).toUpperCase() + product.value.category.slice(1),
              item: `${siteUrl}/category/${product.value.category}`,
            }] : []),
            { '@type': 'ListItem', position: product.value.category ? 3 : 2, name: product.value.title },
          ],
        }),
      },
    ]
    return scripts
  }),
})
</script>

<template>
  <div v-if="product" class="pb-20 lg:pb-0">
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-gray-500">
        <NuxtLink to="/" class="hover:text-primary-600 transition-colors">Home</NuxtLink>
        <span>›</span>
        <NuxtLink v-if="product.category" :to="`/category/${product.category}`" class="hover:text-primary-600 transition-colors capitalize">
          {{ product.category }}
        </NuxtLink>
        <span v-if="product.category">›</span>
        <span class="text-gray-700 truncate max-w-xs">{{ product.title }}</span>
      </div>
    </div>

    <!-- Product hero -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        <!-- Image panel -->
        <div class="relative">
          <div class="sticky top-20">
            <!-- Badges -->
            <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              <span v-if="isPriceDrop" class="text-xs font-bold bg-green-500 text-white px-2.5 py-1 rounded-full shadow">
                🔻 Price Drop
              </span>
              <span v-if="discountPct > 0" class="text-xs font-bold bg-red-500 text-white px-2.5 py-1 rounded-full shadow">
                -{{ discountPct }}% OFF
              </span>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden aspect-square flex items-center justify-center p-6">
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.title"
                class="w-full h-full object-contain"
              />
              <div v-else class="text-gray-200">
                <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Details panel -->
        <div class="flex flex-col gap-5">
          <!-- Source + category -->
          <div class="flex items-center gap-2 flex-wrap">
            <span
              v-if="product.source"
              :class="SOURCE_COLORS[product.source] ?? 'bg-gray-100 text-gray-600'"
              class="text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {{ product.source }}
            </span>
            <NuxtLink
              v-if="product.category"
              :to="`/category/${product.category}`"
              class="text-xs font-medium text-primary-600 hover:text-primary-700 px-2.5 py-1 rounded-full bg-primary-50 capitalize transition-colors"
            >
              {{ product.category }}
            </NuxtLink>
          </div>

          <!-- Title -->
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{{ product.title }}</h1>

          <!-- Rating -->
          <div v-if="product.rating > 0" class="flex items-center gap-2">
            <div class="flex">
              <span
                v-for="i in 5"
                :key="i"
                :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'"
                class="text-xl"
              >★</span>
            </div>
            <span class="text-sm font-semibold text-gray-700">{{ product.rating.toFixed(1) }}</span>
          </div>

          <!-- Pricing -->
          <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div class="flex items-baseline gap-3 mb-1 flex-wrap">
              <span class="text-4xl font-black text-primary-600">{{ formatPrice(product.price, product.currency) }}</span>
              <span v-if="product.originalPrice && product.originalPrice > product.price" class="text-lg text-gray-400 line-through">
                {{ formatPrice(product.originalPrice, product.currency) }}
              </span>
            </div>
            <p v-if="savings" class="text-sm font-semibold text-green-600">
              You save {{ formatPrice(Number(savings), product.currency) }} ({{ discountPct }}% off)
            </p>
            <!-- Lowest price badge -->
            <div v-if="isLowestPrice30d" class="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              🏷️ Lowest price in 30 days!
            </div>
          </div>

          <!-- Main CTA -->
          <a
            :href="affiliateLink"
            target="_blank"
            rel="noopener noreferrer sponsored"
            class="w-full py-4 text-center text-lg font-black text-white bg-accent-500 hover:bg-accent-600 active:scale-95 transition-all duration-150 rounded-2xl shadow-lg shadow-accent-200 flex items-center justify-center gap-2"
          >
            Check Price Now 🔥
          </a>

          <!-- Trust signals -->
          <div class="flex items-center gap-4 text-xs text-gray-400 justify-center">
            <span class="flex items-center gap-1">✅ Verified price</span>
            <span class="flex items-center gap-1">🔒 Secure redirect</span>
            <span class="flex items-center gap-1">🚫 No hidden fees</span>
          </div>

          <!-- FTC-required affiliate disclosure near CTA -->
          <p class="text-xs text-gray-400 text-center">
            Affiliate link — SmartBuy Hub may earn a commission if you purchase.
            <NuxtLink to="/disclosure" class="underline hover:text-gray-600">Disclosure</NuxtLink>
          </p>

          <!-- Description -->
          <p v-if="product.description" class="text-gray-600 text-sm leading-relaxed">{{ product.description }}</p>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Best deals link -->
          <NuxtLink
            v-if="product.category"
            :to="`/best/${product.category}`"
            class="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            See all best {{ product.category }} deals →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Price Comparison -->
    <div v-if="(compare?.comparisons?.length ?? 0) > 1" class="bg-white border-t border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">💰 Price Comparison</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="item in compare.comparisons"
            :key="item.slug"
            :class="item.slug === slug ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white'"
            class="flex items-center justify-between p-4 rounded-xl border"
          >
            <div>
              <span
                :class="SOURCE_COLORS[item.source] ?? 'bg-gray-100 text-gray-600'"
                class="text-xs font-semibold px-2 py-0.5 rounded-full"
              >
                {{ item.source ?? 'Store' }}
              </span>
              <p class="text-lg font-bold text-gray-900 mt-1">${{ item.price }}</p>
              <p v-if="item.slug === slug" class="text-xs text-primary-600 font-medium">Current page</p>
            </div>
            <a
              v-if="item.slug !== slug"
              :href="`/api/click?product_id=${item._id}&source=price-compare`"
              target="_blank"
              rel="noopener noreferrer sponsored"
              class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Buy
            </a>
            <span v-else class="text-xs text-primary-600 font-semibold">✓ Here</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Price History -->
    <div v-if="priceHistory?.length" class="border-t border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">📈 Price History</h2>
        <div class="overflow-x-auto rounded-2xl border border-gray-200">
          <table class="w-full text-sm min-w-[360px] bg-white">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(entry, i) in priceHistory"
                :key="String(entry.createdAt)"
                :class="i === 0 ? 'bg-green-50' : ''"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 text-gray-600">{{ new Date(entry.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</td>
                <td class="px-4 py-3 font-bold text-gray-900">${{ entry.price }}</td>
                <td class="px-4 py-3">
                  <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full capitalize">{{ entry.source }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="related?.length" class="border-t border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900">Related Products</h2>
          <NuxtLink
            v-if="product.category"
            :to="`/category/${product.category}`"
            class="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View all
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <ProductCard
            v-for="item in related"
            :key="item.slug ?? item._id"
            :product="item"
            traffic-source="product-related"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Sticky mobile CTA bar -->
  <Teleport to="body">
    <div class="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur border-t border-gray-200 shadow-2xl px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 truncate">{{ product?.title }}</p>
        <p class="text-base font-black text-primary-600">${{ product?.price?.toFixed(2) }}</p>
      </div>
      <a
        :href="affiliateLink"
        target="_blank"
        rel="noopener noreferrer sponsored"
        class="flex-shrink-0 px-5 py-2.5 text-sm font-black text-white bg-accent-500 hover:bg-accent-600 active:scale-95 transition-all rounded-xl shadow-lg"
      >
        Check Price 🔥
      </a>
    </div>
  </Teleport>
</template>
