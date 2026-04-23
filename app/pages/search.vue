<script setup lang="ts">
const route = useRoute()

// SSR: render results for direct URL visits (crawlers, share links)
const { data: ssrData } = await useAsyncData(
  () => `search-${route.fullPath}`,
  () => $fetch('/api/search', {
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

// Client-side reactive search
const { query, minPrice, maxPrice, source, sort, page, results, pending, goToPage } = useSearch()

onMounted(() => {
  query.value = (route.query.q as string) || ''
  minPrice.value = route.query.minPrice ? Number(route.query.minPrice) : ''
  maxPrice.value = route.query.maxPrice ? Number(route.query.maxPrice) : ''
  source.value = (route.query.source as string) || ''
})

const display = computed(() => results.value ?? ssrData.value)

const SOURCES = ['Shopee', 'Lazada', 'Amazon']

useSeoMeta({
  title: computed(() => query.value ? `"${query.value}" — Search Results` : 'Search Products'),
  description: 'Search thousands of products. Filter by price and store.',
  robots: 'noindex, follow',
})
</script>

<template>
  <main>
    <NuxtLink to="/">← Home</NuxtLink>
    <h1>Search Products</h1>

    <div class="search-layout">
      <!-- Filters sidebar -->
      <aside class="filters">
        <label>
          Keyword
          <input v-model="query" type="search" placeholder="e.g. iPhone 13" />
        </label>

        <label>
          Min Price ($)
          <input v-model.number="minPrice" type="number" min="0" placeholder="0" />
        </label>

        <label>
          Max Price ($)
          <input v-model.number="maxPrice" type="number" min="0" placeholder="Any" />
        </label>

        <label>
          Source
          <select v-model="source">
            <option value="">All stores</option>
            <option v-for="s in SOURCES" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>

        <label>
          Sort by
          <select v-model="sort">
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>
        </label>
      </aside>

      <!-- Results -->
      <section class="results">
        <p v-if="pending">Searching...</p>
        <p v-else-if="display?.total === 0">No results found.</p>
        <p v-else-if="display?.total">{{ display.total }} results</p>

        <div class="products-grid">
          <NuxtLink
            v-for="product in display?.products"
            :key="product._id"
            :to="`/products/${product.slug}`"
            class="product-card"
          >
            <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.title" />
            <h2>{{ product.title }}</h2>
            <p class="price">${{ product.price }}</p>
            <p v-if="product.originalPrice" class="original">${{ product.originalPrice }}</p>
            <span v-if="product.source" class="source">{{ product.source }}</span>
          </NuxtLink>
        </div>

        <div class="pagination">
          <button :disabled="page <= 1" @click="goToPage(page - 1)">Prev</button>
          <span>Page {{ page }} of {{ display?.totalPages ?? 1 }}</span>
          <button :disabled="page >= (display?.totalPages ?? 1)" @click="goToPage(page + 1)">Next</button>
        </div>
      </section>
    </div>
  </main>
</template>
