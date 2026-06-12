<script setup lang="ts">
const route = useRoute()
const page = computed(() => Number(route.query.page) || 1)
const category = computed(() => (route.query.category as string) || undefined)
const sort = computed(() => (route.query.sort as string) || 'newest')

const { data } = await useAsyncData(
  () => `shop-p${page.value}-c${category.value ?? ''}-s${sort.value}`,
  () => $fetch<any>('/api/products', {
    query: { page: page.value, limit: 20, category: category.value, sort: sort.value },
  })
)
const { data: recs } = useAsyncData('recommendations', () => $fetch<any>('/api/recommendations'), { lazy: true })
const { data: trending } = useAsyncData('trending', () => $fetch<any[]>('/api/trending').catch(() => []), { lazy: true })

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
]

const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: 'Shop All Deals — WinRose',
  description: 'Browse thousands of products from top e-commerce platforms. Compare prices, find best deals, and save more on every purchase.',
  ogTitle: 'Shop Best Deals — WinRose',
  ogDescription: 'Browse and compare prices across Amazon, Walmart, Shopee, and more.',

  ogType: 'website',
  ogImage: `${siteUrl}/og-default.png`,
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/shop` }],
})
</script>

<template>
  <div>

    <!-- Dark hero with search -->
    <HeroSection />

    <!-- Dark trust bar -->
    <TrustBar />

    <!-- Dark sticky category nav -->
    <CategoryNav />

    <div class="max-w-7xl mx-auto px-4">

      <!-- Trending -->
      <FeaturedRow
        v-if="trending?.length"
        title="📈 Trending Now"
        :products="trending"
        label="Trending"
        traffic-source="shop-trending"
        view-all-link="/search?sort=newest"
      />

      <!-- Curated rows -->
      <div v-if="recs" class="divide-y divide-gray-100">
        <FeaturedRow
          title="🔥 Best Value"
          :products="recs.bestValue"
          label="Best Value"
          traffic-source="shop-best-value"
          view-all-link="/search?sort=price_asc"
        />
        <FeaturedRow
          title="⭐ Top Rated"
          :products="recs.topRated"
          label="Top Rated"
          traffic-source="shop-top-rated"
          view-all-link="/search?sort=newest"
        />
        <FeaturedRow
          title="💸 Budget Picks"
          :products="recs.budgetPicks"
          label="Budget Pick"
          traffic-source="shop-budget"
          view-all-link="/search?sort=price_asc"
        />
      </div>

      <!-- All products -->
      <section class="py-8 border-t border-gray-100">

        <!-- Section header + sort -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 class="text-xl font-black text-gray-900">
              All Products
              <span v-if="data?.total" class="text-sm font-normal text-gray-400 ml-2">
                {{ data.total.toLocaleString() }} items
              </span>
            </h2>
          </div>

          <!-- Sort pills -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-medium">Sort by:</span>
            <div class="flex gap-1">
              <NuxtLink
                v-for="opt in SORT_OPTIONS"
                :key="opt.value"
                :to="{ query: { ...route.query, sort: opt.value, page: 1 } }"
                :class="sort === opt.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
              >
                {{ opt.label }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Grid -->
        <div
          v-if="data?.products?.length"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          <ProductCard
            v-for="product in data.products"
            :key="product._id"
            :product="product"
            traffic-source="shop-grid"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20 text-gray-400">
          <svg class="w-14 h-14 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="text-base font-semibold text-gray-500">No products yet</p>
          <p class="text-sm mt-1">Products will appear here once added.</p>
        </div>

        <!-- Pagination -->
        <div v-if="(data?.totalPages ?? 0) > 1" class="flex items-center justify-center gap-2 mt-10">
          <NuxtLink
            v-if="page > 1"
            :to="{ query: { ...route.query, page: page - 1 } }"
            class="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            ← Prev
          </NuxtLink>
          <span class="px-4 py-2 text-sm text-gray-500">
            Page <strong class="text-gray-800">{{ page }}</strong> of {{ data?.totalPages }}
          </span>
          <NuxtLink
            v-if="page < (data?.totalPages ?? 0)"
            :to="{ query: { ...route.query, page: page + 1 } }"
            class="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Next →
          </NuxtLink>
        </div>
      </section>
    </div>

  </div>
</template>
