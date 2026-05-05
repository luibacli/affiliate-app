<script setup lang="ts">
defineProps<{
  products: any[]
}>()
</script>

<template>
  <section class="bg-gray-50 py-14 md:py-20 border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4">

      <!-- Header -->
      <div class="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <span class="inline-block text-xs font-bold uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full mb-3">
            Featured Deals
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Trending Right Now 🔥
          </h2>
          <p class="text-gray-500 text-sm mt-1">Hand-picked deals from top platforms, updated daily.</p>
        </div>
        <NuxtLink
          to="/shop"
          class="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all"
        >
          View All
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Product grid -->
      <div
        v-if="products.length"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
      >
        <ProductCard
          v-for="product in products"
          :key="product._id"
          :product="product"
          label="Featured"
          traffic-source="landing-featured"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16 text-gray-400">
        <p class="text-4xl mb-3">🛍️</p>
        <p class="font-medium text-gray-500">Products loading...</p>
        <p class="text-sm mt-1">Check back in a moment.</p>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-10">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 active:scale-95 text-white font-bold text-lg rounded-2xl shadow-xl shadow-accent-500/30 transition-all duration-150 hover:-translate-y-0.5"
        >
          Explore All Deals
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
        <p class="text-xs text-gray-400 mt-3">No account needed. Free forever.</p>
      </div>
    </div>
  </section>
</template>
