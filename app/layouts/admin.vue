<script setup lang="ts">
const route = useRoute()
const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
  { label: 'Products', to: '/admin/products', icon: '📦' },
  { label: '+ Add Product', to: '/admin/products/create', icon: '➕' },
  { label: 'Amazon Import', to: '/admin/amazon', icon: '🛒' },
  { label: '← Storefront', to: '/', icon: '🏠' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <!-- Sidebar -->
    <aside class="w-56 bg-gray-900 text-white flex-shrink-0 flex flex-col">
      <div class="px-5 py-5 border-b border-gray-700">
        <p class="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Admin</p>
        <p class="font-bold text-lg text-white">DealHunt</p>
      </div>
      <nav class="flex-1 py-4 space-y-0.5 px-2">
        <NuxtLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          :class="route.path === item.to
            ? 'bg-primary-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>
