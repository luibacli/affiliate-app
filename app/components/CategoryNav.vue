<script setup lang="ts">
const route = useRoute()
const active = computed(() => (route.query.category as string) ?? '')

const { data: apiCategories } = await useAsyncData('nav-categories', () =>
  $fetch<{ _id: string; count: number }[]>('/api/categories').catch(() => [])
)

const ICONS: Record<string, string> = {
  phones: '📱', laptops: '💻', accessories: '🎧', gaming: '🎮',
  fashion: '👗', home: '🏠', beauty: '💄', sports: '⚽',
}

const categories = computed(() => [
  { name: 'All', icon: '🛍️', slug: '' },
  ...(apiCategories.value ?? [])
    .filter((c) => c._id)
    .map((c) => ({
      name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
      icon: ICONS[c._id] ?? '🏷️',
      slug: c._id,
      count: c.count,
    })),
])
</script>

<template>
  <section class="bg-white border-b border-gray-100 sticky top-14 z-20 shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="cat.slug ? { path: '/', query: { category: cat.slug } } : '/'"
          :aria-current="active === cat.slug ? 'page' : undefined"
          :class="active === cat.slug
            ? 'bg-primary-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600'"
          class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
          <span v-if="cat.count" class="text-xs opacity-60">({{ cat.count }})</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
