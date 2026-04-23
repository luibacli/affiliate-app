<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const page = computed(() => Number(route.query.page) || 1)

const { data } = await useFetch('/api/products', {
  query: computed(() => ({ page: page.value, limit: 20, category: slug })),
})

useSeoMeta({
  title: computed(() => `${slug} — Best Deals`),
  description: computed(() => `Shop the best ${slug} products at unbeatable prices.`),
  ogTitle: computed(() => `${slug} Deals`),
  ogDescription: computed(() => `Browse top-rated ${slug} products with affiliate pricing.`),
  ogType: 'website',
})
</script>

<template>
  <main>
    <NuxtLink to="/">← All Categories</NuxtLink>
    <h1>{{ slug }}</h1>
    <p>{{ data?.total }} products</p>

    <div class="products-grid">
      <NuxtLink
        v-for="product in data?.products"
        :key="product._id"
        :to="`/products/${product.slug}`"
        class="product-card"
      >
        <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.title" />
        <h2>{{ product.title }}</h2>
        <p>${{ product.price }}</p>
      </NuxtLink>
    </div>

    <div class="pagination">
      <NuxtLink v-if="page > 1" :to="{ query: { page: page - 1 } }">Prev</NuxtLink>
      <span>Page {{ page }} of {{ data?.totalPages }}</span>
      <NuxtLink v-if="page < (data?.totalPages ?? 0)" :to="{ query: { page: page + 1 } }">Next</NuxtLink>
    </div>
  </main>
</template>
