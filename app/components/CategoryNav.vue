<script setup lang="ts">
const CATEGORIES = [
  { name: 'All', icon: '🛍️', slug: '' },
  { name: 'Phones', icon: '📱', slug: 'phones' },
  { name: 'Laptops', icon: '💻', slug: 'laptops' },
  { name: 'Accessories', icon: '🎧', slug: 'accessories' },
  { name: 'Gaming', icon: '🎮', slug: 'gaming' },
  { name: 'Fashion', icon: '👗', slug: 'fashion' },
  { name: 'Home', icon: '🏠', slug: 'home' },
  { name: 'Beauty', icon: '💄', slug: 'beauty' },
  { name: 'Sports', icon: '⚽', slug: 'sports' },
]

const route = useRoute()
const active = computed(() => (route.query.category as string) ?? '')
</script>

<template>
  <section class="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
        <NuxtLink
          v-for="cat in CATEGORIES"
          :key="cat.slug"
          :to="cat.slug ? { path: '/', query: { category: cat.slug } } : '/'"
          :class="active === cat.slug
            ? 'bg-primary-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600'"
          class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
