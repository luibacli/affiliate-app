<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const page = computed(() => Number(route.query.page) || 1)

const { data } = await useAsyncData(
  `category-${slug}-p${page.value}`,
  () => $fetch<any>('/api/products', {
    query: { page: page.value, limit: 20, category: slug },
  })
)

const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: computed(() => `${slug.charAt(0).toUpperCase() + slug.slice(1)} Deals — Best Prices`),
  description: computed(() => `Shop the best ${slug} products at unbeatable prices. Compare across Shopee, Lazada & Amazon.`),
  ogTitle: computed(() => `${slug} Deals — DealHunt`),
  ogDescription: computed(() => `Browse top-rated ${slug} products with affiliate pricing.`),
  ogImage: `${siteUrl}/og-default.png`,
  ogType: 'website',
})

useHead({
  link: computed(() => [{
    rel: 'canonical',
    href: page.value === 1 ? `${siteUrl}/category/${slug}` : `${siteUrl}/category/${slug}?page=${page.value}`,
  }]),
})
</script>

<template>
  <div>
    <!-- Breadcrumb -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-gray-500">
        <NuxtLink to="/" class="hover:text-primary-600 transition-colors">Home</NuxtLink>
        <span>›</span>
        <span class="text-gray-700 capitalize">{{ slug }}</span>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 capitalize">{{ slug }}</h1>
          <p v-if="data?.total" class="text-sm text-gray-400 mt-0.5">{{ data.total.toLocaleString() }} products</p>
        </div>
        <NuxtLink
          :to="`/best/${slug}`"
          class="flex items-center gap-1 text-sm font-semibold text-accent-500 hover:text-accent-600 transition-colors"
        >
          🔥 Best {{ slug }} deals →
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
          traffic-source="category-page"
        />
      </div>

      <EmptyState
        v-else
        icon="📦"
        title="No products in this category"
        message="Check back soon or browse other categories."
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
