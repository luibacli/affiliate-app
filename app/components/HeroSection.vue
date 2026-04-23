<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-blue-900 text-white">
    <!-- Decorative blobs -->
    <div class="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

    <div class="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">

      <!-- Platform pills -->
      <div class="flex justify-center gap-2 mb-6 flex-wrap">
        <span
          v-for="p in ['Shopee', 'Lazada', 'Amazon']"
          :key="p"
          class="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20"
        >
          {{ p }}
        </span>
      </div>

      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
        Find the Best Deals Across<br class="hidden sm:block" />
        <span class="text-accent-400">Shopee, Lazada & Amazon</span>
      </h1>

      <p class="text-base sm:text-lg text-blue-100 mb-8 max-w-xl mx-auto">
        Compare prices instantly and get the best value — all in one place.
      </p>

      <SearchBar :large="true" />

      <!-- Stats row -->
      <div class="flex justify-center gap-6 sm:gap-10 mt-10 text-sm text-blue-200 flex-wrap">
        <div class="text-center">
          <p class="text-2xl font-bold text-white">10K+</p>
          <p>Products tracked</p>
        </div>
        <div class="w-px bg-white/20 hidden sm:block" />
        <div class="text-center">
          <p class="text-2xl font-bold text-white">3</p>
          <p>Platforms</p>
        </div>
        <div class="w-px bg-white/20 hidden sm:block" />
        <div class="text-center">
          <p class="text-2xl font-bold text-white">Real-time</p>
          <p>Price updates</p>
        </div>
      </div>
    </div>
  </section>
</template>
