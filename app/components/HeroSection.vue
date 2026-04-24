<script setup lang="ts">
const { data: statsData } = await useAsyncData('hero-stats', () =>
  $fetch<any>('/api/products', { query: { limit: 1 } }).catch(() => null)
)

const totalDisplay = computed(() => {
  const t = statsData.value?.total ?? 0
  if (t >= 10000) return `${Math.floor(t / 1000)}K+`
  if (t >= 1000) return `${(t / 1000).toFixed(1)}K+`
  return t > 0 ? `${t}+` : '1K+'
})
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-blue-800 text-white">
    <!-- Lightweight geometric shapes (no GPU-heavy blur) -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/[0.06] border border-white/10" />
      <div class="absolute top-1/2 -right-16 w-64 h-64 rounded-full bg-accent-500/10 border border-accent-400/10" />
      <div class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-400/10 border border-blue-300/10" />
      <div class="absolute bottom-10 right-1/4 w-40 h-40 rounded-full bg-white/[0.04] border border-white/5" />
      <!-- Subtle grid pattern -->
      <svg class="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    <div class="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">

      <!-- Platform pills -->
      <div class="flex justify-center gap-2 mb-6 flex-wrap">
        <span
          v-for="p in ['Global Platforms', 'Real-Time Prices', 'Best Deals Daily']"
          :key="p"
          class="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm"
        >
          {{ p }}
        </span>
      </div>

      <!-- Headline -->
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight mb-4">
        Find the Best Deals Across<br class="hidden sm:block" />
        <span class="text-accent-400">Top Online Shopping Platforms</span>
      </h1>

      <p class="text-base sm:text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto leading-relaxed">
        Compare prices instantly and save more — we track thousands of products across top e-commerce platforms so you don't have to.
      </p>

      <!-- Search bar -->
      <SearchBar :large="true" />

      <!-- Trending tags -->
      <div class="flex flex-wrap justify-center gap-2 mt-5">
        <span class="text-xs text-blue-200 mr-1 self-center">Trending:</span>
        <NuxtLink
          v-for="tag in ['iPhone', 'Laptops', 'Headphones', 'Gaming', 'Smart Watch']"
          :key="tag"
          :to="`/search?q=${encodeURIComponent(tag)}`"
          class="text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-blue-100 hover:text-white transition-all duration-150"
        >
          {{ tag }}
        </NuxtLink>
      </div>

      <!-- Stats row -->
      <div class="flex justify-center items-center gap-6 sm:gap-10 mt-10 text-sm text-blue-200 flex-wrap">
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-white tabular-nums">{{ totalDisplay }}</p>
          <p class="text-blue-200 text-xs mt-0.5">Products tracked</p>
        </div>
        <div class="w-px h-10 bg-white/20 hidden sm:block" />
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-white">3</p>
          <p class="text-blue-200 text-xs mt-0.5">Platforms</p>
        </div>
        <div class="w-px h-10 bg-white/20 hidden sm:block" />
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-white">Real&#8209;time</p>
          <p class="text-blue-200 text-xs mt-0.5">Price updates</p>
        </div>
        <div class="w-px h-10 bg-white/20 hidden sm:block" />
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-white">Free</p>
          <p class="text-blue-200 text-xs mt-0.5">Always free to use</p>
        </div>
      </div>
    </div>

    <!-- Bottom fade -->
    <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50/20 to-transparent pointer-events-none" />
  </section>
</template>
