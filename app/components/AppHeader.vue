<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-0.5 flex-shrink-0 mr-2">
        <span class="text-xl font-black text-primary-600 tracking-tight">Deal</span>
        <span class="text-xl font-black text-accent-500 tracking-tight">Hunt</span>
      </NuxtLink>

      <!-- Search bar (hidden on homepage — hero has it) -->
      <div v-if="!isHome" class="flex-1 max-w-xl">
        <SearchBar />
      </div>
      <div v-else class="flex-1" />

      <!-- Nav links -->
      <nav class="flex items-center gap-1 flex-shrink-0">
        <NuxtLink
          to="/search"
          class="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Browse
        </NuxtLink>
        <NuxtLink
          to="/best/phones"
          class="hidden md:flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Best Deals
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
