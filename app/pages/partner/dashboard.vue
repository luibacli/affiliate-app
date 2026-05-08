<script setup lang="ts">
definePageMeta({ layout: 'partner', middleware: 'partner' })

const { session, fetchSession } = usePartnerAuth()
const app = ref<any>(null)
const analytics = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  await fetchSession()
  const [appRes, analyticsRes] = await Promise.allSettled([
    $fetch('/api/partner/application'),
    $fetch('/api/partner/analytics'),
  ])
  if (appRes.status === 'fulfilled') app.value = appRes.value
  if (analyticsRes.status === 'fulfilled') analytics.value = analyticsRes.value
  loading.value = false
})

const isApproved = computed(() => app.value?.status === 'approved')
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">
        Welcome, {{ session?.name?.split(' ')[0] ?? 'Partner' }}
      </h1>
      <p class="text-sm text-gray-400 mt-0.5">Partner Hub Overview</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center gap-3 text-gray-400 text-sm py-20 justify-center">
      <svg class="animate-spin w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Loading your dashboard...
    </div>

    <template v-if="!loading">

      <!-- Application status banner (if not approved) -->
      <div v-if="app && !isApproved" class="rounded-2xl border p-5 flex items-start gap-4"
        :class="{
          'bg-yellow-50 border-yellow-200': app.status === 'under_review' || app.status === 'submitted',
          'bg-red-50 border-red-200': app.status === 'rejected',
        }"
      >
        <div class="text-2xl flex-shrink-0">
          {{ app.status === 'rejected' ? '❌' : '🔍' }}
        </div>
        <div>
          <p class="font-semibold text-gray-800 text-sm">
            {{ app.status === 'rejected' ? 'Application Not Approved' : 'Application Under Review' }}
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ app.status === 'rejected'
              ? 'Your application was not approved. You may re-apply after 30 days.'
              : 'We\'re reviewing your application. You\'ll get access once approved (24–48 hours).'
            }}
          </p>
          <NuxtLink to="/partner/status" class="text-xs text-orange-500 hover:underline mt-1 inline-block">View full status →</NuxtLink>
        </div>
      </div>

      <!-- KPI cards (approved only) -->
      <div v-if="isApproved && analytics" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Total Clicks</p>
          <p class="text-3xl font-black text-gray-900">{{ (analytics.total ?? 0).toLocaleString() }}</p>
          <p class="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Last 7 Days</p>
          <p class="text-3xl font-black text-orange-500">{{ (analytics.last7d ?? 0).toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Last 30 Days</p>
          <p class="text-3xl font-black text-gray-700">{{ (analytics.last30d ?? 0).toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Products</p>
          <p class="text-3xl font-black text-gray-900">{{ analytics.products ?? 0 }}</p>
          <p class="text-xs text-gray-400 mt-1">Listed</p>
        </div>
      </div>

      <!-- Quick actions (approved only) -->
      <div v-if="isApproved" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          to="/partner/products/create"
          class="bg-orange-500 hover:bg-orange-400 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors group"
        >
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">➕</div>
          <div>
            <p class="font-bold text-sm">Submit a Product</p>
            <p class="text-xs text-orange-100 mt-0.5">Add a new affiliate product listing</p>
          </div>
        </NuxtLink>
        <NuxtLink
          to="/partner/analytics"
          class="bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-2xl p-5 flex items-center gap-4 transition-colors group"
        >
          <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📈</div>
          <div>
            <p class="font-bold text-sm text-gray-800">View Analytics</p>
            <p class="text-xs text-gray-400 mt-0.5">See your click performance</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Top products (approved only) -->
      <div v-if="isApproved && analytics?.topProducts?.length" class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="font-bold text-gray-900">Top Products by Clicks</h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="(p, i) in analytics.topProducts.slice(0, 5)" :key="p.slug" class="px-5 py-3 flex items-center gap-3">
            <span class="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0"
              :class="i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : 'bg-gray-100 text-gray-500'">
              {{ Number(i) + 1 }}
            </span>
            <p class="flex-1 text-sm text-gray-700 font-medium truncate">{{ p.title ?? p.slug }}</p>
            <p class="text-sm font-bold text-gray-900 flex-shrink-0">{{ p.count.toLocaleString() }} clicks</p>
          </div>
        </div>
      </div>

      <!-- Empty state (approved but no products) -->
      <div v-if="isApproved && analytics?.products === 0" class="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
        <p class="text-3xl mb-3">📦</p>
        <h3 class="font-bold text-gray-700 mb-1">No products yet</h3>
        <p class="text-sm text-gray-400 mb-4">Submit your first affiliate product to start earning.</p>
        <NuxtLink
          to="/partner/products/create"
          class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors"
        >
          Submit First Product
        </NuxtLink>
      </div>

    </template>
  </div>
</template>
