<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
const mobileMenuOpen = ref(false)

watch(() => route.path, () => { mobileMenuOpen.value = false })
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2 sm:gap-3">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <span class="text-lg sm:text-xl font-black text-primary-600 tracking-tight">SmartBuy</span>
        <span class="hidden sm:inline text-xl font-black text-accent-500 tracking-tight">Marketplace</span>
      </NuxtLink>

      <!-- Search bar (hidden on homepage — hero has it) -->
      <div v-if="!isHome" class="flex-1 min-w-0 max-w-xl">
        <SearchBar />
      </div>
      <div v-else class="flex-1" />

      <!-- Desktop Nav links -->
      <nav class="hidden sm:flex items-center gap-1 flex-shrink-0">
        <NuxtLink
          to="/shop"
          class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Shop
        </NuxtLink>
        <NuxtLink
          to="/search"
          class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Search
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
          Admin
        </NuxtLink>
      </nav>

      <!-- Mobile: hamburger button -->
      <button
        class="sm:hidden flex-shrink-0 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle navigation menu"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile dropdown menu (overlay, doesn't affect CategoryNav sticky offset) -->
    <div
      v-if="mobileMenuOpen"
      class="sm:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl z-40 px-4 py-3 space-y-1"
    >
      <NuxtLink
        to="/shop"
        class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
      >
        <span class="text-base">🛍️</span> Shop All Deals
      </NuxtLink>
      <NuxtLink
        to="/search"
        class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
      >
        <span class="text-base">🔍</span> Search Products
      </NuxtLink>
      <NuxtLink
        to="/best/phones"
        class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
      >
        <span class="text-base">🔥</span> Best Deals
      </NuxtLink>
      <NuxtLink
        to="/admin/dashboard"
        class="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:text-white hover:bg-gray-800 rounded-xl transition-all border border-gray-200 hover:border-gray-800"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        Admin Panel
      </NuxtLink>
    </div>
  </header>
</template>
