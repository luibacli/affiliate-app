<script setup lang="ts">
defineProps<{
  title: string
  products: any[]
  trafficSource: string
  label: string
  viewAllLink?: string
}>()
</script>

<template>
  <section v-if="products?.length" class="py-8 first:pt-4">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">{{ title }}</h2>
        <NuxtLink
          v-if="viewAllLink"
          :to="viewAllLink"
          class="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Horizontal scroll with right-fade hint on mobile -->
      <div class="relative">
        <div class="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
          <div
            v-for="product in products"
            :key="product._id"
            class="flex-shrink-0 w-40 sm:w-52"
          >
            <ProductCard :product="product" :label="label" :traffic-source="trafficSource" />
          </div>
          <!-- Trailing spacer so last card isn't flush against edge -->
          <div class="flex-shrink-0 w-2 sm:hidden" />
        </div>
        <!-- Right fade: scroll hint for mobile -->
        <div class="pointer-events-none absolute right-0 top-0 bottom-3 w-10 bg-gradient-to-l from-white to-transparent sm:hidden" />
      </div>
    </div>
  </section>
</template>
