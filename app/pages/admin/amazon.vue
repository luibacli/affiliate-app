<script setup lang="ts">
definePageMeta({ layout: 'admin', ssr: false })

const { headers, apiFetch } = useAdminAuth()

const query = ref('')
const results = ref<any[]>([])
const selected = ref<Set<string>>(new Set())
const searching = ref(false)
const importing = ref(false)
const message = ref('')
const error = ref('')

const search = async () => {
  if (!query.value.trim()) return
  searching.value = true
  error.value = ''
  results.value = []
  selected.value = new Set()
  try {
    results.value = await apiFetch<any[]>(`/api/admin/amazon/search?q=${encodeURIComponent(query.value.trim())}`)
  } catch (e: any) {
    error.value = e.data?.message ?? 'Search failed'
  } finally {
    searching.value = false
  }
}

const toggle = (asin: string) => {
  const s = new Set(selected.value)
  s.has(asin) ? s.delete(asin) : s.add(asin)
  selected.value = s
}

const toggleAll = () => {
  if (selected.value.size === results.value.length) {
    selected.value = new Set()
  } else {
    selected.value = new Set(results.value.map((r) => r.asin))
  }
}

const importSelected = async () => {
  const items = results.value.filter((r) => selected.value.has(r.asin))
  if (!items.length) return
  importing.value = true
  message.value = ''
  error.value = ''
  try {
    const res = await apiFetch<any>('/api/admin/amazon/import', {
      method: 'POST',
      body: { items },
    })
    message.value = `Done — ${res.created} imported, ${res.skipped} skipped${res.errors?.length ? `, ${res.errors.length} errors` : ''}`
    selected.value = new Set()
  } catch (e: any) {
    error.value = e.data?.message ?? 'Import failed'
  } finally {
    importing.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Amazon Product Import</h1>

    <!-- Search -->
    <form class="flex gap-3 mb-6" @submit.prevent="search">
      <input
        v-model="query"
        placeholder="Search Amazon (e.g. wireless earbuds)"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <button
        type="submit"
        :disabled="searching"
        class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
      >
        {{ searching ? 'Searching…' : 'Search' }}
      </button>
    </form>

    <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>
    <p v-if="message" class="text-green-600 text-sm mb-4 font-medium">{{ message }}</p>

    <!-- Results -->
    <div v-if="results.length">
      <div class="flex items-center justify-between mb-3">
        <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" :checked="selected.size === results.length" @change="toggleAll" class="rounded" />
          Select all ({{ results.length }})
        </label>
        <button
          :disabled="selected.size === 0 || importing"
          class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
          @click="importSelected"
        >
          {{ importing ? 'Importing…' : `Import ${selected.size} selected` }}
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="item in results"
          :key="item.asin"
          :class="selected.has(item.asin) ? 'ring-2 ring-primary-500 bg-primary-50' : 'bg-white'"
          class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 cursor-pointer transition-all"
          @click="toggle(item.asin)"
        >
          <input
            type="checkbox"
            :checked="selected.has(item.asin)"
            class="rounded flex-shrink-0"
            @click.stop="toggle(item.asin)"
          />
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.title"
            class="w-16 h-16 object-contain rounded bg-gray-50 flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 line-clamp-2">{{ item.title }}</p>
            <p class="text-xs text-gray-400 mt-0.5">ASIN: {{ item.asin }}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-base font-bold text-primary-600">${{ item.price?.toFixed(2) }}</p>
            <p v-if="item.originalPrice" class="text-xs text-gray-400 line-through">${{ item.originalPrice?.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <p v-else-if="!searching" class="text-gray-400 text-sm text-center py-12">
      Search Amazon to find products to import.
    </p>
  </div>
</template>
