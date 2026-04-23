<script setup lang="ts">
const route = useRoute()
const { key } = useAdminAuth()
const showKey = ref(false)

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
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
      <!-- Brand -->
      <div class="px-5 py-5 border-b border-gray-700">
        <p class="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Admin Panel</p>
        <p class="font-black text-lg">
          <span class="text-primary-400">Deal</span><span class="text-accent-400">Hunt</span>
        </p>
      </div>

      <!-- Nav -->
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
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>
