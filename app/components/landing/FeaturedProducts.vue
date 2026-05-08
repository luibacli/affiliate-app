<script setup lang="ts">
const props = defineProps<{
  newest: any[]
  trending: any[]
  bestValue: any[]
  topRated: any[]
  budgetPicks: any[]
}>()

const activeTab = ref('trending')

const tabs = [
  { key: 'trending', label: '🔥 Trending', icon: '🔥' },
  { key: 'newest', label: '🆕 New Arrivals', icon: '🆕' },
  { key: 'best', label: '💰 Best Value', icon: '💰' },
  { key: 'rated', label: '⭐ Top Rated', icon: '⭐' },
  { key: 'budget', label: '💸 Budget', icon: '💸' },
]

const currentProducts = computed(() => {
  switch (activeTab.value) {
    case 'trending': return props.trending.slice(0, 8)
    case 'newest': return props.newest.slice(0, 8)
    case 'best': return props.bestValue.slice(0, 8)
    case 'rated': return props.topRated.slice(0, 8)
    case 'budget': return props.budgetPicks.slice(0, 8)
    default: return props.trending.slice(0, 8)
  }
})

const currentLabel = computed(() => {
  const map: Record<string, string> = {
    trending: 'Trending',
    newest: undefined as any,
    best: 'Best Value',
    rated: 'Top Rated',
    budget: 'Budget Pick',
  }
  return map[activeTab.value] ?? undefined
})

const trafficSource = computed(() => `landing-${activeTab.value}`)
</script>

<template>
  <section class="bg-white py-16 md:py-24 border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4">

      <!-- Section header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span class="inline-block text-xs font-bold uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full mb-3">
            Featured Deals
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Deals Worth Clicking
          </h2>
          <p class="text-gray-500 text-sm mt-1">Hand-picked from top platforms, updated daily.</p>
        </div>
        <NuxtLink
          to="/shop"
          class="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group"
        >
          View all deals
          <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Tab switcher -->
      <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="activeTab === tab.key
            ? 'bg-gray-900 text-white shadow-sm'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800'"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Product grid -->
      <div
        v-if="currentProducts.length"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
      >
        <ProductCard
          v-for="product in currentProducts"
          :key="product._id"
          :product="product"
          :label="currentLabel"
          :traffic-source="trafficSource"
        />
      </div>

      <!-- Empty / Loading -->
      <div v-else class="text-center py-16 text-gray-300">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="i in 8"
            :key="i"
            class="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse"
          />
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-bold text-base rounded-2xl shadow-lg transition-all duration-150 hover:-translate-y-0.5"
        >
          Explore All Deals
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
        <p class="text-xs text-gray-400 mt-3">No sign-up needed · Free forever · Updated daily</p>
      </div>

    </div>
  </section>
</template>
