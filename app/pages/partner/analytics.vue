<script setup lang="ts">
definePageMeta({ layout: 'partner', middleware: 'partner' })

const data = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    data.value = await $fetch('/api/partner/analytics')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">

    <div>
      <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
      <p class="text-sm text-gray-400 mt-0.5">Click performance for your affiliate products</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20 text-gray-400 text-sm gap-3">
      <svg class="animate-spin w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Loading analytics...
    </div>

    <template v-else-if="data">
      <!-- KPI cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Total Clicks</p>
          <p class="text-3xl font-black text-gray-900">{{ (data.total ?? 0).toLocaleString() }}</p>
          <p class="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Last 7 Days</p>
          <p class="text-3xl font-black text-orange-500">{{ (data.last7d ?? 0).toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Last 30 Days</p>
          <p class="text-3xl font-black text-gray-700">{{ (data.last30d ?? 0).toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Products</p>
          <p class="text-3xl font-black text-gray-900">{{ data.products ?? 0 }}</p>
        </div>
      </div>

      <!-- Top products table -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="font-bold text-gray-900">Top Products by Clicks</h2>
          <p class="text-xs text-gray-400 mt-0.5">Your best performing affiliate links</p>
        </div>
        <div v-if="data.topProducts?.length">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Price</th>
                <th class="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Clicks</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(row, i) in data.topProducts" :key="row.slug" class="hover:bg-gray-50">
                <td class="px-5 py-3">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black"
                    :class="i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-100 text-gray-500'">
                    {{ Number(i) + 1 }}
                  </span>
                </td>
                <td class="px-5 py-3 font-medium text-gray-700">{{ row.title ?? row.slug }}</td>
                <td class="px-5 py-3 text-gray-500 hidden sm:table-cell">${{ row.price ?? '—' }}</td>
                <td class="px-5 py-3 text-right font-black text-gray-900">{{ row.count.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="px-5 py-12 text-center text-sm text-gray-400">
          No click data yet. Share your product links to start tracking.
        </div>
      </div>
    </template>
  </div>
</template>
