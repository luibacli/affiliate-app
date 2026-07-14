<script setup lang="ts">
const totalDisplay = '10,000+'
</script>

<template>
  <section class="relative overflow-hidden bg-gray-900 text-white">

    <!-- Gradient orbs -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <div class="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary-600/[0.15] blur-[50px] will-change-transform" />
      <div class="absolute -bottom-32 -right-32 w-[350px] h-[350px] rounded-full bg-accent-500/[0.12] blur-[40px] will-change-transform" />
    </div>

    <!-- Dot grid -->
    <div
      class="absolute inset-0 opacity-[0.25]"
      style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0); background-size: 28px 28px;"
    />

    <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">

      <!-- Headline -->
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08] mb-4">
        Find the Best Deal.<br class="hidden sm:block">
        <span class="bg-gradient-to-r from-accent-400 to-yellow-300 bg-clip-text text-transparent inline-block">
          Compare in Seconds.
        </span>
      </h1>

      <p class="text-sm sm:text-base text-gray-400 mb-7 max-w-xl mx-auto leading-relaxed">
        Prices from Amazon, Walmart, eBay, AliExpress & more — all in one place, updated daily.
      </p>

      <!-- Search -->
      <div class="max-w-xl mx-auto mb-5">
        <SearchBar :large="true" />
      </div>

      <!-- Quick tags -->
      <div class="flex flex-wrap justify-center gap-1.5">
        <span class="text-xs text-gray-600 mr-0.5 self-center font-medium">Browse:</span>
        <NuxtLink
          v-for="tag in ['📱 Phones', '💻 Laptops', '🎮 Gaming', '🎧 Accessories', '👗 Fashion']"
          :key="tag"
          :to="`/search?q=${encodeURIComponent(tag.replace(/^\S+\s/, '').toLowerCase())}`"
          class="text-xs px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-white/[0.18] text-gray-400 hover:text-white transition-all duration-150"
        >
          {{ tag }}
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="flex justify-center flex-wrap gap-x-8 gap-y-2 mt-10 text-center">
        <div>
          <p class="text-2xl font-black text-white tabular-nums">{{ totalDisplay }}</p>
          <p class="text-xs text-gray-600 mt-0.5">Products</p>
        </div>
        <div class="w-px h-8 bg-white/[0.08] self-center hidden sm:block" />
        <div>
          <p class="text-2xl font-black text-white">4+</p>
          <p class="text-xs text-gray-600 mt-0.5">Platforms</p>
        </div>
        <div class="w-px h-8 bg-white/[0.08] self-center hidden sm:block" />
        <div>
          <p class="text-2xl font-black text-accent-400">Free</p>
          <p class="text-xs text-gray-600 mt-0.5">Always</p>
        </div>
      </div>
    </div>
  </section>
</template>
