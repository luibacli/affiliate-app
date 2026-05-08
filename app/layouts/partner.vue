<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const route = useRoute()
const { session, logout } = usePartnerAuth()
const sidebarOpen = ref(false)

const NAV = [
  { label: 'Dashboard', to: '/partner/dashboard', icon: '📊' },
  { label: 'My Products', to: '/partner/products', icon: '📦' },
  { label: 'Submit Product', to: '/partner/products/create', icon: '➕' },
  { label: 'Analytics', to: '/partner/analytics', icon: '📈' },
  { label: '← Storefront', to: '/', icon: '🏠' },
]

watch(() => route.path, () => { sidebarOpen.value = false })
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">

    <!-- Mobile top bar -->
    <div class="lg:hidden flex items-center justify-between bg-gray-900 px-4 py-3 sticky top-0 z-30">
      <p class="font-black text-base">
        <span class="text-orange-400">SmartBuy</span><span class="text-white"> Partner</span>
      </p>
      <button class="text-gray-300 hover:text-white p-1" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="lg:hidden fixed inset-0 z-20 bg-black/50" @click="sidebarOpen = false" />

    <div class="flex">
      <!-- Sidebar -->
      <aside
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed lg:static lg:translate-x-0 z-20 h-full lg:h-auto w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col transition-transform duration-200 ease-in-out lg:min-h-screen"
      >
        <!-- Brand -->
        <div class="hidden lg:block px-5 py-5 border-b border-gray-700">
          <p class="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Partner Hub</p>
          <p class="font-black text-lg">
            <span class="text-orange-400">SmartBuy</span><span class="text-white"> Hub</span>
          </p>
        </div>

        <!-- Nav -->
        <nav class="flex-1 py-4 space-y-0.5 px-2">
          <NuxtLink
            v-for="item in NAV"
            :key="item.to"
            :to="item.to"
            :class="route.path === item.to || (item.to !== '/partner/products' && route.path.startsWith(item.to) && item.to !== '/')
              ? 'bg-orange-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- User info + logout -->
        <div class="border-t border-gray-700 p-4">
          <div v-if="session" class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ session.name?.[0]?.toUpperCase() ?? 'P' }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white truncate">{{ session.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ session.email }}</p>
            </div>
          </div>
          <button
            class="w-full text-xs text-gray-400 hover:text-red-400 transition-colors text-left py-1"
            @click="logout"
          >
            Sign out
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-auto min-w-0">
        <slot />
      </main>
    </div>

    <Toaster position="top-right" rich-colors />
  </div>
</template>
