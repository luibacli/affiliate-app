<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const [{ data: product, error }, { data: compare }, { data: related }, { data: priceHistory }] = await Promise.all([
  useAsyncData(`product-${slug}`, () => $fetch<any>(`/api/products/${slug}`)),
  useAsyncData(`compare-${slug}`, () => $fetch<any>(`/api/products/${slug}/compare`)),
  useAsyncData(`related-${slug}`, () => $fetch<any[]>(`/api/products/${slug}/related`)),
  useAsyncData(`price-history-${slug}`, () => $fetch<any[]>(`/api/products/${slug}/price-history`).catch(() => [])),
])

if (error.value) throw createError({ statusCode: 404, message: 'Product not found' })

const affiliateLink = computed(() =>
  product.value?._id
    ? `/api/click?product_id=${product.value._id}&source=product-detail`
    : '#'
)

const savings = computed(() => {
  const p = product.value
  if (!p?.originalPrice || !p?.price) return null
  return (p.originalPrice - p.price).toFixed(2)
})

useSeoMeta({
  title: computed(() => product.value?.title ?? ''),
  description: computed(() => product.value?.description ?? `Buy ${product.value?.title} at the best price.`),
  ogTitle: computed(() => product.value?.title ?? ''),
  ogDescription: computed(() => product.value?.description ?? ''),
  ogImage: computed(() => product.value?.imageUrl ?? ''),
  ogType: 'product',
})

useHead({
  script: computed(() =>
    product.value
      ? [{
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.value.title,
            description: product.value.description,
            image: product.value.imageUrl,
            offers: {
              '@type': 'Offer',
              price: product.value.price,
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: affiliateLink,
            },
          }),
        }]
      : []
  ),
})
</script>

<template>
  <main v-if="product">
    <NuxtLink to="/">← Back</NuxtLink>

    <article>
      <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.title" />
      <h1>{{ product.title }}</h1>

      <div class="pricing">
        <p class="price">${{ product.price }}</p>
        <p v-if="product.originalPrice" class="original-price">Was ${{ product.originalPrice }}</p>
        <p v-if="savings" class="savings">You save ${{ savings }}</p>
      </div>

      <p v-if="product.description">{{ product.description }}</p>

      <div class="meta">
        <NuxtLink v-if="product.category" :to="`/category/${product.category}`">
          {{ product.category }}
        </NuxtLink>
        <NuxtLink v-if="product.category" :to="`/best/${product.category}`">
          Best {{ product.category }} deals →
        </NuxtLink>
        <span v-for="tag in product.tags" :key="tag">{{ tag }}</span>
      </div>

      <a :href="affiliateLink" target="_blank" rel="noopener noreferrer sponsored" class="cta">
        Buy Now →
      </a>
    </article>

    <!-- Price Comparison -->
    <section v-if="(compare?.comparisons?.length ?? 0) > 1" class="price-comparison">
      <h2>Price Comparison</h2>
      <table>
        <thead><tr><th>Store</th><th>Price</th><th></th></tr></thead>
        <tbody>
          <tr v-for="item in compare!.comparisons" :key="item.slug" :class="{ current: item.slug === slug }">
            <td>{{ item.source ?? 'Store' }}</td>
            <td>${{ item.price }}</td>
            <td>
              <a v-if="item.slug !== slug" :href="`/api/click?product_id=${item._id}&source=price-compare`" target="_blank" rel="noopener noreferrer sponsored">Buy</a>
              <span v-else>Current</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Price History -->
    <section v-if="priceHistory?.length" class="price-history">
      <h2>Price History</h2>
      <table>
        <thead><tr><th>Date</th><th>Price</th><th>Source</th></tr></thead>
        <tbody>
          <tr v-for="entry in priceHistory" :key="String(entry.createdAt)">
            <td>{{ new Date(entry.createdAt).toLocaleDateString() }}</td>
            <td>${{ entry.price }}</td>
            <td>{{ entry.source }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Related Products -->
    <section v-if="related?.length" class="related-products">
      <h2>Related Products</h2>
      <div class="products-grid">
        <NuxtLink
          v-for="item in related"
          :key="item.slug"
          :to="`/products/${item.slug}`"
          class="product-card"
        >
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" />
          <h3>{{ item.title }}</h3>
          <p>${{ item.price }}</p>
          <span v-if="item.source" class="source">{{ item.source }}</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
