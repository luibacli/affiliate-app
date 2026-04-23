<script setup lang="ts">
const route = useRoute()
const page = computed(() => Number(route.query.page) || 1)
const category = computed(() => (route.query.category as string) || undefined)
const sort = computed(() => (route.query.sort as string) || 'newest')

const [{ data }, { data: recs }] = await Promise.all([
  useAsyncData(
    () => `home-p${page.value}-c${category.value ?? ''}-s${sort.value}`,
    () => $fetch<any>('/api/products', {
      query: { page: page.value, limit: 20, category: category.value, sort: sort.value },
    })
  ),
  useAsyncData('recommendations', () => $fetch<any>('/api/recommendations')),
])

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
]

useSeoMeta({
  title: 'DealHunt — Best Deals from Shopee, Lazada & Amazon',
  description: 'Compare prices and find the best deals across top e-commerce platforms.',
  ogTitle: 'DealHunt — Best Deals Aggregator',
  ogDescription: 'Discover top products with the best prices from Shopee, Lazada, and Amazon.',
  ogType: 'website',
})
</script>

<template>
  <div>

    <!-- Hero -->
    <HeroSection />

    <!-- Trust bar -->
    <TrustBar />

    <!-- Sticky category nav -->
    <CategoryNav />

    <div class="max-w-7xl mx-auto px-4">

      <!-- Featured sections -->
      <div v-if="recs" class="divide-y divide-gray-100">
        <FeaturedRow
          title="🔥 Best Value"
          :products="recs.bestValue"
          label="Best Value"
          traffic-source="homepage-best-value"
          view-all-link="/search?sort=price_asc"
        />
        <FeaturedRow
          title="⭐ Top Rated"
          :products="recs.topRated"
          label="Top Rated"
          traffic-source="homepage-top-rated"
          view-all-link="/search?sort=newest"
        />
        <FeaturedRow
          title="💸 Budget Picks"
          :products="recs.budgetPicks"
          label="Budget Pick"
          traffic-source="homepage-budget"
          view-all-link="/search?sort=price_asc"
        />
      </div>

      <!-- All products -->
      <section class="py-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 class="text-xl font-bold text-gray-900">
            All Products
            <span v-if="data?.total" class="text-sm font-normal text-gray-400 ml-2">
              {{ data.total.toLocaleString() }} items
            </span>
          </h2>

          <!-- Sort -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Sort:</span>
            <div class="flex gap-1">
              <NuxtLink
                v-for="opt in SORT_OPTIONS"
                :key="opt.value"
                :to="{ query: { ...route.query, sort: opt.value, page: 1 } }"
                :class="sort === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
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
            traffic-source="homepage-grid"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20 text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="text-lg font-medium">No products yet</p>
          <p class="text-sm mt-1">Products will appear here once added.</p>
        </div>

        <!-- Pagination -->
        <div v-if="(data?.totalPages ?? 0) > 1" class="flex items-center justify-center gap-2 mt-10">
          <NuxtLink
            v-if="page > 1"
            :to="{ query: { ...route.query, page: page - 1 } }"
            class="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition-all"
          >
            ← Prev
          </NuxtLink>
          <span class="px-4 py-2 text-sm text-gray-500">
            Page <strong class="text-gray-800">{{ page }}</strong> of {{ data?.totalPages }}
          </span>
          <NuxtLink
            v-if="page < (data?.totalPages ?? 0)"
            :to="{ query: { ...route.query, page: page + 1 } }"
            class="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition-all"
          >
            Next →
          </NuxtLink>
        </div>
      </section>
    </div>

  </div>
</template>
