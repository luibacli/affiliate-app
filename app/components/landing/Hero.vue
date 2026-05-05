<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-blue-800 text-white">
    <!-- Background shapes -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/[0.06] border border-white/10" />
      <div class="absolute top-1/2 -right-16 w-64 h-64 rounded-full bg-accent-500/10 border border-accent-400/10" />
      <div class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-400/10 border border-blue-300/10" />
      <svg class="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="lp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lp-grid)" />
      </svg>
    </div>

    <div class="relative max-w-5xl mx-auto px-4 py-20 md:py-32 text-center">

      <!-- Platform badges -->
      <div class="flex justify-center gap-2 mb-7 flex-wrap">
        <span
          v-for="p in ['Amazon', 'Walmart', 'Shopee', 'Lazada', 'More']"
          :key="p"
          class="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm"
        >
          {{ p }}
        </span>
      </div>

      <!-- Headline -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
        All the Best Deals<br class="hidden sm:block" />
        <span class="text-accent-400">in One Place</span>
      </h1>

      <!-- Subtext -->
      <p class="text-lg sm:text-xl md:text-2xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
        Discover products from Amazon, Walmart, and more —<br class="hidden md:block" />
        all in one platform.
      </p>

      <!-- Search bar -->
      <div class="max-w-xl mx-auto mb-8">
        <SearchBar :large="true" />
      </div>

      <!-- CTA buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 active:scale-95 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-accent-500/40 transition-all duration-150 hover:-translate-y-0.5"
        >
          Explore Deals
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
        <a
          href="#affiliate"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-lg rounded-2xl border border-white/25 backdrop-blur-sm transition-all duration-150"
        >
          Join as Affiliate
        </a>
      </div>

      <!-- Stats row -->
      <div class="flex justify-center items-center gap-6 sm:gap-10 mt-14 text-sm text-blue-200 flex-wrap">
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-white">1K+</p>
          <p class="text-blue-200 text-xs mt-0.5">Products tracked</p>
        </div>
        <div class="w-px h-10 bg-white/20 hidden sm:block" />
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-white">4+</p>
          <p class="text-blue-200 text-xs mt-0.5">Platforms</p>
        </div>
        <div class="w-px h-10 bg-white/20 hidden sm:block" />
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-white">Free</p>
          <p class="text-blue-200 text-xs mt-0.5">Always free to use</p>
        </div>
        <div class="w-px h-10 bg-white/20 hidden sm:block" />
        <div class="text-center">
          <p class="text-2xl sm:text-3xl font-black text-white">Daily</p>
          <p class="text-blue-200 text-xs mt-0.5">Price updates</p>
        </div>
      </div>
    </div>

    <!-- Bottom fade -->
    <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50/20 to-transparent pointer-events-none" />
  </section>
</template>
