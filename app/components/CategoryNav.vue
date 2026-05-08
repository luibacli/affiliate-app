<script setup lang="ts">
const route = useRoute()

const active = computed(() => {
  const slug = route.params.slug
  if (slug && (route.path.startsWith('/category/') || route.path.startsWith('/best/'))) {
    return Array.isArray(slug) ? slug[0] : slug
  }
  return (route.query.category as string) ?? ''
})

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
      name: c.label ?? (c._id.charAt(0).toUpperCase() + c._id.slice(1)),
      icon: c.icon ?? ICONS[c._id] ?? '🏷️',
      slug: c._id,
      count: c.count,
    })),
])
</script>

<template>
  <section class="bg-gray-900 border-b border-white/[0.07] sticky top-14 z-20">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex gap-1.5 overflow-x-auto py-2.5 scrollbar-hide">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="cat.slug ? `/category/${cat.slug}` : '/shop'"
          :aria-current="active === cat.slug ? 'page' : undefined"
          :class="active === cat.slug
            ? 'bg-white/[0.12] text-white border-white/[0.2]'
            : 'text-gray-500 hover:text-white hover:bg-white/[0.07] border-transparent hover:border-white/[0.1]'"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 border"
        >
          <span class="leading-none">{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
          <span v-if="cat.count" class="opacity-40 text-[10px]">{{ cat.count }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
