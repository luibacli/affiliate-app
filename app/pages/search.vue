<script setup lang="ts">
const route = useRoute()

const { data: ssrData } = await useAsyncData(
  () => `search-${route.fullPath}`,
  () => $fetch<any>('/api/search', {
    query: {
      q: route.query.q || undefined,
      minPrice: route.query.minPrice || undefined,
      maxPrice: route.query.maxPrice || undefined,
      source: route.query.source || undefined,
      page: Number(route.query.page) || 1,
      limit: 20,
    },
  })
)

const { query, minPrice, maxPrice, source, sort, page, results, pending, goToPage } = useSearch()

onMounted(() => {
  query.value = (route.query.q as string) || ''
  minPrice.value = route.query.minPrice ? Number(route.query.minPrice) : ''
  maxPrice.value = route.query.maxPrice ? Number(route.query.maxPrice) : ''
  source.value = (route.query.source as string) || ''
})

const display = computed(() => results.value ?? ssrData.value)

const SOURCES = ['Shopee', 'Lazada', 'Amazon']
const SORTS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
]

const showFilters = ref(false)

useSeoMeta({
  title: computed(() => query.value ? `"${query.value}" — Search Results` : 'Search Products — SmartBuy Marketplace'),
  description: 'Search thousands of products. Filter by price and store.',
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">

    <!-- Page header -->
    <div class="flex items-center justify-between mb-5 gap-3">
      <div>
        <h1 class="text-xl font-bold text-gray-900">
          <template v-if="query">Results for "<span class="text-primary-600">{{ query }}</span>"</template>
          <template v-else>Browse All Products</template>
        </h1>
        <p v-if="display?.total" class="text-sm text-gray-400 mt-0.5">{{ display.total.toLocaleString() }} products found</p>
      </div>

      <!-- Mobile filter toggle -->
      <button
        class="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        @click="showFilters = !showFilters"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
        </svg>
        Filters
      </button>
    </div>

    <div class="flex gap-6">

      <!-- Filters sidebar -->
      <aside
        :class="showFilters ? 'fixed inset-0 z-40 bg-black/30 lg:relative lg:bg-transparent lg:inset-auto' : 'hidden lg:block'"
        class="lg:w-60 lg:flex-shrink-0"
        @click.self="showFilters = false"
      >
        <div
          :class="showFilters ? 'translate-x-0' : ''"
          class="bg-white h-full lg:h-auto rounded-2xl border border-gray-200 p-5 space-y-5 shadow-lg lg:shadow-none w-72 lg:w-auto fixed lg:relative top-0 bottom-0 left-0 lg:top-auto lg:bottom-auto lg:left-auto"
        >
          <div class="flex items-center justify-between lg:hidden">
            <h3 class="font-bold text-gray-900">Filters</h3>
            <button class="text-gray-400 hover:text-gray-600" @click="showFilters = false">✕</button>
          </div>

          <!-- Keyword -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Keyword</label>
            <input
              v-model="query"
              type="search"
              placeholder="e.g. iPhone 15"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <!-- Price range -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Price Range</label>
            <div class="flex gap-2">
              <input
                v-model.number="minPrice"
                type="number"
                min="0"
                placeholder="Min"
                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                v-model.number="maxPrice"
                type="number"
                min="0"
                placeholder="Max"
                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <!-- Source -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Store</label>
            <div class="flex flex-col gap-1.5">
              <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input v-model="source" type="radio" value="" class="text-primary-600" />
                All Stores
              </label>
              <label
                v-for="s in SOURCES"
                :key="s"
                class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input v-model="source" type="radio" :value="s" class="text-primary-600" />
                {{ s }}
              </label>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Sort By</label>
            <select
              v-model="sort"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option v-for="s in SORTS" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>

          <!-- Apply button (mobile) -->
          <button
            class="lg:hidden w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
            @click="showFilters = false"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      <!-- Results -->
      <div class="flex-1 min-w-0">

        <!-- Sort pills (desktop) -->
        <div class="hidden lg:flex items-center gap-2 mb-4">
          <span class="text-xs text-gray-400 font-medium">Sort:</span>
          <button
            v-for="s in SORTS"
            :key="s.value"
            :class="sort === s.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            @click="sort = s.value"
          >
            {{ s.label }}
          </button>
        </div>

        <!-- Skeleton loading -->
        <LoadingSkeleton v-if="pending" :count="12" />

        <!-- Results grid -->
        <template v-else-if="display?.products?.length">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <ProductCard
              v-for="product in display.products"
              :key="product._id"
              :product="product"
              traffic-source="search-results"
            />
          </div>

          <!-- Pagination -->
          <div v-if="(display?.totalPages ?? 0) > 1" class="flex items-center justify-center gap-2 mt-10">
            <button
              :disabled="page <= 1"
              class="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              @click="goToPage(page - 1)"
            >
              ← Prev
            </button>
            <span class="px-4 py-2 text-sm text-gray-500">
              Page <strong class="text-gray-800">{{ page }}</strong> of {{ display.totalPages }}
            </span>
            <button
              :disabled="page >= (display?.totalPages ?? 1)"
              class="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              @click="goToPage(page + 1)"
            >
              Next →
            </button>
          </div>
        </template>

        <!-- Empty state -->
        <EmptyState
          v-else
          icon="🔍"
          title="No products found"
          message="Try different keywords or adjust your filters."
          action-label="Browse all"
          action-to="/search"
        />
      </div>
    </div>
  </div>
</template>
