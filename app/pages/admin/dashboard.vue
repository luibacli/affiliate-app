<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { key, headers, apiFetch } = useAdminAuth()
const router = useRouter()

const data = ref<any>(null)
const pending = ref(false)
const authError = ref(false)

async function load() {
  if (!key.value) return
  pending.value = true
  authError.value = false
  try {
    data.value = await apiFetch<any>('/api/admin/analytics')
  } catch {
    authError.value = true
  } finally {
    pending.value = false
  }
}

onMounted(load)
watch(key, load)
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

    <!-- Auth prompt -->
    <div v-if="!key" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700 mb-6">
      Enter your admin key in the sidebar to load analytics.
    </div>

    <div v-if="authError" class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
      Invalid admin key. Check your key and try again.
    </div>

    <div v-if="pending" class="flex items-center gap-3 text-gray-500 text-sm py-12 justify-center">
      <svg class="animate-spin w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Loading analytics...
    </div>

    <template v-if="data && !pending">
      <!-- Summary cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Clicks</p>
          <p class="text-3xl font-black text-gray-900">{{ (data.total ?? 0).toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Last 7 Days</p>
          <p class="text-3xl font-black text-primary-600">{{ (data.last7d ?? 0).toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Last 30 Days</p>
          <p class="text-3xl font-black text-accent-500">{{ (data.last30d ?? 0).toLocaleString() }}</p>
        </div>
      </div>

      <!-- Top products -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold text-gray-900">Top Products by Clicks</h2>
          <span class="text-xs text-gray-400">Top 10</span>
        </div>
        <div v-if="data.byProduct?.length">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th class="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Clicks</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(row, i) in data.byProduct" :key="row._id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-3 text-gray-400 text-xs">{{ i + 1 }}</td>
                <td class="px-5 py-3">
                  <NuxtLink v-if="row.slug" :to="`/products/${row.slug}`" class="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                    {{ row.title ?? row.slug }}
                  </NuxtLink>
                  <span v-else class="text-gray-500">{{ row.slug ?? '—' }}</span>
                </td>
                <td class="px-5 py-3 text-gray-600">${{ row.price ?? '—' }}</td>
                <td class="px-5 py-3 text-right font-bold text-gray-900">{{ row.count.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="px-5 py-8 text-center text-sm text-gray-400">No click data yet.</div>
      </div>

      <!-- Source breakdown -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100">
          <h2 class="font-bold text-gray-900">Clicks by Traffic Source</h2>
        </div>
        <div v-if="data.bySource?.length">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                <th class="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Clicks</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="row in data.bySource" :key="row.source" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-3 text-gray-700 font-medium">{{ row.source ?? 'unknown' }}</td>
                <td class="px-5 py-3 text-right font-bold text-gray-900">{{ row.count.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="px-5 py-8 text-center text-sm text-gray-400">No source data yet.</div>
      </div>

      <button
        class="mt-6 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        @click="load"
      >
        ↻ Refresh
      </button>
    </template>
  </div>
</template>
