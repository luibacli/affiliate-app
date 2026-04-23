<script setup lang="ts">
const route = useRoute()
const category = route.params.category as string
const page = computed(() => Number(route.query.page) || 1)

const { data } = await useAsyncData(
  `best-${category}-p${page.value}`,
  () => $fetch(`/api/best/${category}`, { query: { page: page.value, limit: 20 } })
)

useSeoMeta({
  title: `Best ${category} Deals — Top Discounts`,
  description: `Shop the best ${category} products sorted by highest discount. Compare prices and save.`,
  ogTitle: `Best ${category} Deals`,
  ogDescription: `Top-rated ${category} products with the biggest discounts across Shopee, Lazada, and Amazon.`,
  ogType: 'website',
})
</script>

<template>
  <main>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink :to="`/category/${category}`">All {{ category }}</NuxtLink>
    </nav>

    <h1>Best {{ category }} Deals</h1>
    <p v-if="data?.total">{{ data.total }} products — sorted by biggest discount</p>

    <div class="products-grid">
      <NuxtLink
        v-for="product in data?.products"
        :key="product._id"
        :to="`/products/${product.slug}`"
        class="product-card"
      >
        <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.title" />
        <span v-if="product.discountPct > 0" class="badge">
          -{{ Math.round(product.discountPct * 100) }}%
        </span>
        <h2>{{ product.title }}</h2>
        <p class="price">${{ product.price }}</p>
        <p v-if="product.originalPrice" class="original">${{ product.originalPrice }}</p>
        <span v-if="product.source" class="source">{{ product.source }}</span>
      </NuxtLink>
    </div>

    <div class="pagination">
      <NuxtLink v-if="page > 1" :to="{ query: { page: page - 1 } }">Prev</NuxtLink>
      <span>Page {{ page }} of {{ data?.totalPages }}</span>
      <NuxtLink v-if="page < (data?.totalPages ?? 0)" :to="{ query: { page: page + 1 } }">Next</NuxtLink>
    </div>
  </main>
</template>
