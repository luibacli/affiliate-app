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

      <!-- Horizontal scroll -->
      <div class="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
        <div
          v-for="product in products"
          :key="product._id"
          class="flex-shrink-0 w-44 sm:w-52"
        >
          <ProductCard :product="product" :label="label" :traffic-source="trafficSource" />
        </div>
      </div>
    </div>
  </section>
</template>
