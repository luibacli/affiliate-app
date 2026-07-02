<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const route = useRoute()
const { user, isSuperAdmin, authError, apiFetch, fetchMe, logout } = useAdminAuth()
const sidebarOpen = ref(false)
const unreadCount = ref(0)

const NAV = [
  { label: 'Dashboard',      to: '/admin/dashboard',        icon: '📊', superOnly: false },
  { label: 'Products',       to: '/admin/products',         icon: '📦', superOnly: false },
  { label: '+ Add Product',  to: '/admin/products/create',  icon: '➕', superOnly: false },
  { label: 'Categories',     to: '/admin/categories',       icon: '🏷️', superOnly: false },
  { label: 'Amazon Import',  to: '/admin/amazon',           icon: '🛒', superOnly: false },
  { label: 'eBay Import',    to: '/admin/ebay',             icon: '🏷️', superOnly: false },
  { label: 'Best Buy Import',to: '/admin/bestbuy',          icon: '🛍️', superOnly: false },
  { label: 'Walmart Import', to: '/admin/walmart',          icon: '🏪', superOnly: false },
  { label: 'Messages',       to: '/admin/messages',         icon: '✉️', superOnly: true  },
  { label: 'User Management',to: '/admin/users',            icon: '👥', superOnly: true  },
]

const visibleNAV = computed(() =>
  NAV.filter(item => !item.superOnly || isSuperAdmin.value)
)

const storefrontUrl = computed(() => {
  if (import.meta.server) return '/'
  const { protocol, hostname, port } = window.location
  const publicHost = hostname.startsWith('admin.') ? hostname.slice(6) : hostname
  const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : ''
  return `${protocol}//${publicHost}${portSuffix}`
})

async function fetchUnread() {
  if (!user.value) return
  try {
    const res = await apiFetch<any>('/api/admin/messages', { query: { page: 1 } })
    unreadCount.value = res?.unreadCount ?? 0
  } catch {}
}

watch(() => route.path, () => { sidebarOpen.value = false })

onMounted(async () => {
  await fetchMe()
  if (!user.value) {
    await navigateTo('/admin/login')
    return
  }
  await fetchUnread()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">

    <!-- Mobile top bar -->
    <div class="lg:hidden flex items-center justify-between bg-gray-900 px-4 py-3 sticky top-0 z-30">
      <p class="font-black text-base">
        <span class="text-primary-400">WinRose</span><span class="text-accent-400"> Admin</span>
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
            <span class="text-primary-400">WinRose</span><span class="text-accent-400"> Marketplace</span>
          </p>
        </div>

        <!-- Auth error banner -->
        <div v-if="authError" class="mx-3 mt-3 bg-red-900/50 border border-red-700 rounded-lg px-3 py-2">
          <p class="text-xs text-red-300">{{ authError }}</p>
        </div>

        <!-- Nav -->
        <nav class="flex-1 py-4 space-y-0.5 px-2">
          <NuxtLink
            v-for="item in visibleNAV"
            :key="item.to"
            :to="item.to"
            :class="route.path === item.to || (item.to !== '/admin/products' && route.path.startsWith(item.to))
              ? 'bg-primary-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <span>{{ item.icon }}</span>
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="item.to === '/admin/messages' && unreadCount > 0"
              class="ml-auto min-w-[20px] text-center px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold leading-none"
            >{{ unreadCount }}</span>
          </NuxtLink>

          <div class="border-t border-gray-700 my-2" />

          <a
            :href="storefrontUrl"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <span>🏠</span>
            <span>← Storefront</span>
          </a>
        </nav>

        <!-- User info + logout -->
        <div class="border-t border-gray-700 p-4">
          <div v-if="user" class="space-y-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                <span class="text-orange-400 text-xs font-bold uppercase">{{ user.name?.charAt(0) }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold text-white truncate">{{ user.name }}</p>
                <p class="text-xs text-gray-500 truncate">@{{ user.username }}</p>
              </div>
            </div>
            <button
              class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              @click="logout"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign Out
            </button>
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
