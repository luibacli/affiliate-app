<script setup lang="ts">
const route = useRoute()
const category = route.params.category as string
const page = computed(() => Number(route.query.page) || 1)

const { data } = await useAsyncData(
  `best-${category}-p${page.value}`,
  () => $fetch<any>(`/api/best/${category}`, { query: { page: page.value, limit: 20 } })
)

const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: `Best ${category.charAt(0).toUpperCase() + category.slice(1)} Deals — Top Discounts`,
  description: `Shop the best ${category} products sorted by highest discount. Compare prices and save big.`,
  ogTitle: `Best ${category} Deals`,
  ogDescription: `Top-rated ${category} products with the biggest discounts across Shopee, Lazada, and Amazon.`,
  ogImage: `${siteUrl}/og-default.png`,
  ogType: 'website',
})

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/best/${category}` }],
})
</script>

<template>
  <div>
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-gray-500">
        <NuxtLink to="/" class="hover:text-primary-600 transition-colors">Home</NuxtLink>
        <span>›</span>
        <NuxtLink :to="`/category/${category}`" class="hover:text-primary-600 transition-colors capitalize">{{ category }}</NuxtLink>
        <span>›</span>
        <span class="text-gray-700">Best Deals</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-600 rounded-full">🔥 Hot Deals</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 capitalize">Best {{ category }} Deals</h1>
          <p v-if="data?.total" class="text-sm text-gray-400 mt-0.5">
            {{ data.total.toLocaleString() }} products — sorted by biggest discount
          </p>
        </div>
        <NuxtLink
          :to="`/category/${category}`"
          class="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          All {{ category }} →
        </NuxtLink>
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
          traffic-source="best-deals-page"
          label="Best Value"
        />
      </div>

      <EmptyState
        v-else
        icon="🏷️"
        title="No deals found"
        message="No discounted products in this category yet."
        action-label="Browse all"
        action-to="/"
      />

      <!-- Pagination -->
      <div v-if="(data?.totalPages ?? 0) > 1" class="flex items-center justify-center gap-2 mt-10">
        <NuxtLink
          v-if="page > 1"
          :to="{ query: { page: page - 1 } }"
          class="px-4 py-2 text-sm font-semibold text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition-all"
        >
          ← Prev
        </NuxtLink>
        <span class="px-4 py-2 text-sm text-gray-500">
          Page <strong class="text-gray-800">{{ page }}</strong> of {{ data?.totalPages }}
        </span>
        <NuxtLink
          v-if="page < (data?.totalPages ?? 0)"
          :to="{ query: { page: page + 1 } }"
          class="px-4 py-2 text-sm font-semibold text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition-all"
        >
          Next →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
