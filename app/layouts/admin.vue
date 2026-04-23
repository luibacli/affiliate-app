<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const route = useRoute()
const { key, authError } = useAdminAuth()
const showKey = ref(false)
const sidebarOpen = ref(false)

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
  { label: 'Products', to: '/admin/products', icon: '📦' },
  { label: '+ Add Product', to: '/admin/products/create', icon: '➕' },
  { label: 'Categories', to: '/admin/categories', icon: '🏷️' },
  { label: 'Amazon Import', to: '/admin/amazon', icon: '🛒' },
  { label: '← Storefront', to: '/', icon: '🏠' },
]

const isAuthenticated = computed(() => !!key.value)
const maskedKey = computed(() => key.value ? '••••••••' + key.value.slice(-6) : '')

watch(() => route.path, () => { sidebarOpen.value = false })
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">

    <!-- Mobile top bar -->
    <div class="lg:hidden flex items-center justify-between bg-gray-900 px-4 py-3 sticky top-0 z-30">
      <p class="font-black text-base">
        <span class="text-primary-400">SmartBuy</span><span class="text-accent-400"> Admin</span>
      </p>
      <button class="text-gray-300 hover:text-white p-1" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="lg:hidden fixed inset-0 z-20 bg-black/50"
      @click="sidebarOpen = false"
    />

    <div class="flex">
      <!-- Sidebar -->
      <aside
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed lg:static lg:translate-x-0 z-20 h-full lg:h-auto w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col transition-transform duration-200 ease-in-out lg:min-h-screen"
      >
        <!-- Brand (desktop only — mobile has its own bar) -->
        <div class="hidden lg:block px-5 py-5 border-b border-gray-700">
          <p class="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Admin Panel</p>
          <p class="font-black text-lg">
            <span class="text-primary-400">SmartBuy</span><span class="text-accent-400"> Marketplace</span>
          </p>
        </div>

        <!-- Auth error banner -->
        <div v-if="authError" class="mx-3 mt-3 bg-red-900/50 border border-red-700 rounded-lg px-3 py-2">
          <p class="text-xs text-red-300">{{ authError }}</p>
        </div>

        <!-- Nav -->
        <nav class="flex-1 py-4 space-y-0.5 px-2">
          <NuxtLink
            v-for="item in NAV"
            :key="item.to"
            :to="item.to"
            :class="route.path === item.to || (item.to !== '/admin/products' && route.path.startsWith(item.to))
              ? 'bg-primary-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Admin Key Section -->
        <div class="border-t border-gray-700 p-4 space-y-2">
          <p class="text-xs text-gray-400 uppercase tracking-widest">Admin Key</p>

          <!-- Authenticated state -->
          <div v-if="isAuthenticated && !showKey" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span class="text-xs text-gray-300 font-mono">{{ maskedKey }}</span>
            </div>
            <button
              class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              @click="showKey = true"
            >
              Change
            </button>
          </div>

          <!-- Key input -->
          <div v-if="!isAuthenticated || showKey" class="space-y-2">
            <p v-if="!isAuthenticated" class="text-xs text-yellow-400">
              ⚠ Enter key to unlock admin features
            </p>
            <input
              v-model="key"
              type="password"
              placeholder="Paste admin key here"
              class="w-full bg-gray-800 border border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition-colors"
              @blur="showKey = false"
            />
            <p class="text-xs text-gray-500">Found in your <code class="bg-gray-800 px-1 rounded">.env</code> file as <code class="bg-gray-800 px-1 rounded">ADMIN_KEY</code></p>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-auto min-w-0">
        <slot />
      </main>
    </div>

    <!-- Toast notifications -->
    <Toaster
      position="top-right"
      rich-colors
      :toast-options="{
        style: {
          fontFamily: '\'Inter\', system-ui, sans-serif',
          borderRadius: '12px',
          fontSize: '13px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
        },
      }"
    />
  </div>
</template>
