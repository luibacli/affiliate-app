<script setup lang="ts">
const { data: statsData } = await useAsyncData('hero-stats-lp', () =>
  $fetch<any>('/api/products', { query: { limit: 1 } }).catch(() => null)
)

const totalDisplay = computed(() => {
  const t = statsData.value?.total ?? 0
  if (t >= 10000) return `${Math.floor(t / 1000)}K+`
  if (t >= 1000) return `${(t / 1000).toFixed(1)}K+`
  return t > 0 ? `${t}+` : '1K+'
})

const stats = computed(() => [
  { value: totalDisplay.value, label: 'Products tracked' },
  { value: '4+', label: 'Platforms' },
  { value: 'Daily', label: 'Price updates' },
  { value: 'Free', label: 'Always & forever' },
])

const trending = ['iPhone 16', 'MacBook Air', 'Gaming Chair', 'AirPods Pro', 'Smart Watch']
</script>

<template>
  <section class="relative overflow-hidden bg-gray-950 text-white">

    <!-- Gradient orbs -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <div class="absolute -top-64 -left-64 w-[900px] h-[900px] rounded-full bg-primary-600/[0.18] blur-[130px]" />
      <div class="absolute -bottom-56 -right-56 w-[750px] h-[750px] rounded-full bg-accent-500/[0.14] blur-[110px]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-700/[0.07] blur-[80px]" />
    </div>

    <!-- Dot grid -->
    <div
      class="absolute inset-0"
      style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0); background-size: 28px 28px;"
    />

    <!-- Top shimmer line -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

      <!-- Platform badges -->
      <div class="flex justify-center items-center gap-2 flex-wrap pt-14 sm:pt-20 mb-10 sm:mb-12">
        <span class="text-xs text-gray-600 font-medium mr-1 hidden sm:inline">Deals from:</span>
        <span
          v-for="p in ['Amazon', 'Walmart', 'eBay', 'Target', '+ More']"
          :key="p"
          class="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.11] text-gray-400 cursor-default"
        >{{ p }}</span>
      </div>

      <!-- Headline -->
      <div class="text-center mb-8 sm:mb-10">
        <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-black tracking-tight leading-[1.05] mb-5">
          <span class="text-white">All the Best Deals</span><br>
          <span class="bg-gradient-to-r from-accent-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent inline-block">
            in One Place.
          </span>
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Compare prices from top platforms instantly —<br class="hidden md:block">
          free, real-time, and updated daily.
        </p>
      </div>

      <!-- Search -->
      <div class="max-w-2xl mx-auto mb-7">
        <SearchBar :large="true" />
      </div>

      <!-- Trending chips -->
      <div class="flex flex-wrap justify-center items-center gap-1.5 mb-12 sm:mb-14">
        <span class="text-xs text-gray-600 mr-0.5 font-medium">Trending:</span>
        <NuxtLink
          v-for="tag in trending"
          :key="tag"
          :to="`/search?q=${encodeURIComponent(tag)}`"
          class="text-xs px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.11] border border-white/[0.09] hover:border-white/[0.2] text-gray-500 hover:text-white transition-all duration-150"
        >
          {{ tag }}
        </NuxtLink>
      </div>

      <!-- Stats bar -->
      <div class="border-t border-white/[0.06]">
        <div class="flex flex-wrap justify-center sm:grid sm:grid-cols-4 sm:divide-x sm:divide-white/[0.06]">
          <div
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="flex flex-col items-center py-8 px-8 sm:px-4"
          >
            <span
              class="text-3xl sm:text-4xl font-black tabular-nums"
              :class="i === 3 ? 'text-accent-400' : 'text-white'"
            >{{ stat.value }}</span>
            <span class="text-xs text-gray-600 mt-1.5 font-medium text-center">{{ stat.label }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Section cut — the white section below creates natural contrast -->
  </section>
</template>
