<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-4 flex-shrink-0 mr-2">
        <span class="text-xl font-black text-primary-600 tracking-tight">SMART HUB</span>
        <span class="text-xl font-black text-accent-500 tracking-tight">MARKETPLACE</span>
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
        <NuxtLink
          to="/admin/dashboard"
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-white hover:bg-gray-800 border border-gray-200 hover:border-gray-800 rounded-lg transition-all"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="hidden sm:inline">Admin</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
