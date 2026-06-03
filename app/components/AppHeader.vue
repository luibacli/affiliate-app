<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
const mobileMenuOpen = ref(false)

watch(() => route.path, () => { mobileMenuOpen.value = false })

const isActive = (path: string) => {
  if (path === '/shop') {
    return route.path === '/shop'
      || route.path.startsWith('/category/')
      || route.path.startsWith('/best/')
  }
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-md border-b border-white/[0.07]">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2 sm:gap-4">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center flex-shrink-0 group">
        <span class="text-lg sm:text-xl font-black text-white tracking-tight leading-none">Win</span><span class="text-lg sm:text-xl font-black text-accent-400 tracking-tight leading-none">Rose</span>
      </NuxtLink>

      <!-- Search bar (hidden on homepage — hero has it) -->
      <div v-if="!isHome" class="flex-1 min-w-0 max-w-xl">
        <SearchBar />
      </div>
      <div v-else class="flex-1" />

      <!-- Desktop nav -->
      <nav class="hidden sm:flex items-center gap-0.5 flex-shrink-0">
        <NuxtLink
          to="/shop"
          :class="isActive('/shop') ? 'text-white bg-white/[0.09]' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150"
        >
          Shop
        </NuxtLink>
        <NuxtLink
          to="/search"
          :class="isActive('/search') ? 'text-white bg-white/[0.09]' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150"
        >
          Search
        </NuxtLink>
        <NuxtLink
          to="/best/phones"
          :class="isActive('/best/phones') ? 'text-white bg-white/[0.09]' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'"
          class="hidden md:flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150"
        >
          Best Deals
        </NuxtLink>

        <!-- Divider -->
        <div class="w-px h-4 bg-white/[0.1] mx-1" />

        <!-- Admin -->
        <NuxtLink
          to="/admin/dashboard"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-white/[0.2] rounded-lg transition-all duration-150"
        >
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Admin
        </NuxtLink>
      </nav>

      <!-- Mobile hamburger -->
      <button
        class="sm:hidden flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.07] transition-all"
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

    <!-- Mobile dropdown -->
    <div
      v-if="mobileMenuOpen"
      class="sm:hidden absolute left-0 right-0 top-full bg-gray-950 border-t border-white/[0.07] shadow-2xl z-40 px-4 py-3 space-y-0.5"
    >
      <NuxtLink
        to="/shop"
        :class="isActive('/shop') ? 'bg-white/[0.09] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'"
        class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all"
      >
        <span class="text-base leading-none">🛍️</span> Shop All Deals
      </NuxtLink>
      <NuxtLink
        to="/search"
        :class="isActive('/search') ? 'bg-white/[0.09] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'"
        class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all"
      >
        <span class="text-base leading-none">🔍</span> Search Products
      </NuxtLink>
      <NuxtLink
        to="/best/phones"
        :class="isActive('/best/') ? 'bg-white/[0.09] text-white' : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'"
        class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all"
      >
        <span class="text-base leading-none">🔥</span> Best Deals
      </NuxtLink>
      <div class="border-t border-white/[0.06] my-1.5" />
      <NuxtLink
        to="/admin/dashboard"
        class="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all border border-white/[0.08] hover:border-white/[0.15]"
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
