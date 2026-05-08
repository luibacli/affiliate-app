<script setup lang="ts">
const { data: apiCategories } = await useAsyncData('landing-category-grid', () =>
  $fetch<{ _id: string; count?: number; label?: string; icon?: string }[]>('/api/categories').catch(() => [])
)

const GRADIENT_MAP: Record<string, string> = {
  phones: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-100 hover:border-blue-200',
  laptops: 'bg-gradient-to-br from-slate-50 to-gray-100 border-slate-100 hover:border-slate-200',
  accessories: 'bg-gradient-to-br from-cyan-50 to-teal-100 border-cyan-100 hover:border-cyan-200',
  gaming: 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-100 hover:border-purple-200',
  fashion: 'bg-gradient-to-br from-pink-50 to-rose-100 border-pink-100 hover:border-pink-200',
  home: 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-100 hover:border-amber-200',
  beauty: 'bg-gradient-to-br from-rose-50 to-fuchsia-100 border-rose-100 hover:border-rose-200',
  sports: 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-100 hover:border-green-200',
  electronics: 'bg-gradient-to-br from-sky-50 to-blue-100 border-sky-100 hover:border-sky-200',
  toys: 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-100 hover:border-yellow-200',
}

const ICON_MAP: Record<string, string> = {
  phones: '📱', laptops: '💻', accessories: '🎧', gaming: '🎮',
  fashion: '👗', home: '🏠', beauty: '💄', sports: '⚽',
  electronics: '⚡', toys: '🧸',
}

const FALLBACK_CATEGORIES = [
  { slug: 'phones', name: 'Phones', icon: '📱' },
  { slug: 'laptops', name: 'Laptops', icon: '💻' },
  { slug: 'gaming', name: 'Gaming', icon: '🎮' },
  { slug: 'accessories', name: 'Accessories', icon: '🎧' },
  { slug: 'fashion', name: 'Fashion', icon: '👗' },
  { slug: 'home', name: 'Home', icon: '🏠' },
  { slug: 'beauty', name: 'Beauty', icon: '💄' },
  { slug: 'sports', name: 'Sports', icon: '⚽' },
]

const categories = computed(() => {
  const api = (apiCategories.value ?? []).filter(c => c._id)
  if (api.length === 0) return FALLBACK_CATEGORIES.slice(0, 8)
  return api.slice(0, 8).map(c => ({
    slug: c._id,
    name: c.label ?? (c._id.charAt(0).toUpperCase() + c._id.slice(1)),
    icon: c.icon ?? ICON_MAP[c._id] ?? '🏷️',
    count: c.count,
  }))
})
</script>

<template>
  <section class="bg-gray-50 py-16 md:py-20 border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4">

      <!-- Section header -->
      <div class="text-center mb-10">
        <span class="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3">
          Browse Categories
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Shop by Category</h2>
        <p class="text-gray-500 text-sm mt-2">Discover deals in every category, from every top platform.</p>
      </div>

      <!-- Category grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/category/${cat.slug}`"
          :class="GRADIENT_MAP[cat.slug] ?? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-100 hover:border-gray-200'"
          class="group relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col gap-3 border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <!-- Icon -->
          <span class="text-3xl sm:text-4xl leading-none">{{ cat.icon }}</span>

          <!-- Text -->
          <div>
            <p class="font-extrabold text-gray-900 text-sm sm:text-base leading-tight">{{ cat.name }}</p>
            <p v-if="cat.count" class="text-xs text-gray-400 mt-0.5 font-medium">{{ cat.count.toLocaleString() }} deals</p>
          </div>

          <!-- Arrow -->
          <svg
            class="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all absolute bottom-5 right-5"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- View all link -->
      <div class="text-center mt-8">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors group"
        >
          Browse all products
          <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
