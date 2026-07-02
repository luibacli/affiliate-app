<script setup lang="ts">
definePageMeta({ layout: 'admin', ssr: false })

const { apiFetch } = useAdminAuth()

const data = ref<any>(null)
const pending = ref(false)

async function load() {
  pending.value = true
  try {
    data.value = await apiFetch<any>('/api/admin/analytics')
  } finally {
    pending.value = false
  }
}

onMounted(load)

// SVG bar chart helpers
const CHART_W = 600
const CHART_H = 120
const BAR_GAP = 2

const chartBars = computed(() => {
  const trend = data.value?.dailyTrend ?? []
  if (!trend.length) return []
  const max = Math.max(...trend.map((d: any) => d.count), 1)
  const barW = (CHART_W / trend.length) - BAR_GAP
  return trend.map((d: any, i: number) => ({
    x: i * (barW + BAR_GAP),
    y: CHART_H - (d.count / max) * CHART_H,
    w: barW,
    h: (d.count / max) * CHART_H,
    count: d.count,
    date: d.date,
  }))
})

const growthColor = computed(() => {
  const g = data.value?.growth7d ?? 0
  return g > 0 ? 'text-green-600' : g < 0 ? 'text-red-500' : 'text-gray-400'
})

const growthIcon = computed(() => {
  const g = data.value?.growth7d ?? 0
  return g > 0 ? '↑' : g < 0 ? '↓' : '→'
})

const CATEGORY_ICONS: Record<string, string> = {
  phones: '📱', laptops: '💻', accessories: '🎧', gaming: '🎮',
  fashion: '👗', home: '🏠', beauty: '💄', sports: '⚽',
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p class="text-sm text-gray-400 mt-0.5">Click performance and conversion tracking</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        @click="load"
      >
        <svg class="w-4 h-4" :class="pending ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending && !data" class="flex items-center gap-3 text-gray-400 text-sm py-20 justify-center">
      <svg class="animate-spin w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Loading analytics...
    </div>

    <template v-if="data">

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Total Clicks</p>
          <p class="text-3xl font-black text-gray-900">{{ (data.total ?? 0).toLocaleString() }}</p>
          <p class="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Last 7 Days</p>
          <p class="text-3xl font-black text-primary-600">{{ (data.last7d ?? 0).toLocaleString() }}</p>
          <p class="text-xs mt-1" :class="growthColor">
            {{ growthIcon }} {{ Math.abs(data.growth7d ?? 0) }}% vs prev week
          </p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Last 30 Days</p>
          <p class="text-3xl font-black text-accent-500">{{ (data.last30d ?? 0).toLocaleString() }}</p>
          <p class="text-xs text-gray-400 mt-1">30-day window</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Avg / Day</p>
          <p class="text-3xl font-black text-gray-900">
            {{ data.last30d > 0 ? Math.round(data.last30d / 30).toLocaleString() : '0' }}
          </p>
          <p class="text-xs text-gray-400 mt-1">30-day average</p>
        </div>
      </div>

      <!-- Daily Trend Chart -->
      <div class="bg-white rounded-2xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-gray-900">Daily Clicks — Last 30 Days</h2>
          <span class="text-xs text-gray-400">{{ data.dailyTrend?.length ?? 0 }} days</span>
        </div>
        <div v-if="data.dailyTrend?.some((d: any) => d.count > 0)">
          <svg
            :viewBox="`0 0 ${CHART_W} ${CHART_H}`"
            class="w-full h-28"
            preserveAspectRatio="none"
          >
            <rect
              v-for="bar in chartBars"
              :key="bar.date"
              :x="bar.x"
              :y="bar.y"
              :width="bar.w"
              :height="bar.h"
              class="fill-primary-500 hover:fill-primary-400 transition-colors cursor-pointer"
              rx="1"
            >
              <title>{{ bar.date }}: {{ bar.count }} clicks</title>
            </rect>
          </svg>
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>{{ data.dailyTrend[0]?.date }}</span>
            <span>{{ data.dailyTrend[data.dailyTrend.length - 1]?.date }}</span>
          </div>
        </div>
        <div v-else class="h-28 flex items-center justify-center text-sm text-gray-400">
          No click data in the last 30 days yet.
        </div>
      </div>

      <!-- Source + Category row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Source breakdown -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="font-bold text-gray-900">Clicks by Traffic Source</h2>
            <p class="text-xs text-gray-400 mt-0.5">Which page position drives the most clicks</p>
          </div>
          <div v-if="data.bySource?.length" class="divide-y divide-gray-50">
            <div
              v-for="row in data.bySource"
              :key="row.source"
              class="px-5 py-3 flex items-center gap-3"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-700 truncate">{{ row.source ?? 'unknown' }}</p>
                <div class="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary-500 rounded-full transition-all"
                    :style="`width: ${row.pct}%`"
                  />
                </div>
              </div>
              <div class="flex-shrink-0 text-right">
                <p class="text-sm font-bold text-gray-900">{{ row.count.toLocaleString() }}</p>
                <p class="text-xs text-gray-400">{{ row.pct }}%</p>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-10 text-center text-sm text-gray-400">No source data yet.</div>
        </div>

        <!-- Category breakdown -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100">
            <h2 class="font-bold text-gray-900">Clicks by Category</h2>
            <p class="text-xs text-gray-400 mt-0.5">Last 30 days</p>
          </div>
          <div v-if="data.byCategory?.length" class="divide-y divide-gray-50">
            <div
              v-for="row in data.byCategory"
              :key="row.category"
              class="px-5 py-3 flex items-center gap-3"
            >
              <span class="text-xl flex-shrink-0">{{ CATEGORY_ICONS[row.category] ?? '🏷️' }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-700 capitalize">{{ row.category }}</p>
                <div class="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-accent-500 rounded-full transition-all"
                    :style="`width: ${row.pct}%`"
                  />
                </div>
              </div>
              <div class="flex-shrink-0 text-right">
                <p class="text-sm font-bold text-gray-900">{{ row.count.toLocaleString() }}</p>
                <p class="text-xs text-gray-400">{{ row.pct }}%</p>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-10 text-center text-sm text-gray-400">No category data yet.</div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="font-bold text-gray-900">Top Products by Clicks</h2>
            <p class="text-xs text-gray-400 mt-0.5">All-time highest performing products</p>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full">Top 10</span>
        </div>
        <div v-if="data.byProduct?.length">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Price</th>
                <th class="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Clicks</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="(row, i) in data.byProduct"
                :key="row._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-5 py-3">
                  <span
                    :class="i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-100 text-gray-500'"
                    class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black"
                  >{{ i + 1 }}</span>
                </td>
                <td class="px-5 py-3">
                  <NuxtLink
                    v-if="row.slug"
                    :to="`/products/${row.slug}`"
                    target="_blank"
                    class="font-medium text-primary-600 hover:text-primary-700 hover:underline line-clamp-1"
                  >
                    {{ row.title ?? row.slug }}
                  </NuxtLink>
                  <span v-else class="text-gray-500">{{ row.slug ?? '—' }}</span>
                </td>
                <td class="px-5 py-3 hidden md:table-cell">
                  <span v-if="row.category" class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">
                    {{ row.category }}
                  </span>
                  <span v-else class="text-gray-300">—</span>
                </td>
                <td class="px-5 py-3 text-gray-600 hidden sm:table-cell">
                  {{ row.price != null ? `$${row.price}` : '—' }}
                </td>
                <td class="px-5 py-3 text-right">
                  <span class="font-black text-gray-900">{{ row.count.toLocaleString() }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="px-5 py-10 text-center text-sm text-gray-400">
          No click data yet. Share your storefront to start tracking.
        </div>
      </div>

    </template>
  </div>
</template>
