<script setup lang="ts">
definePageMeta({ layout: 'admin', ssr: false })

const { apiFetch } = useAdminAuth()

const query = ref('')
const results = ref<any[]>([])
const selected = ref<Set<string>>(new Set())
const category = ref('')
const compareGroupId = ref('')
const searching = ref(false)
const importing = ref(false)
const message = ref('')
const error = ref('')

const CATEGORIES = ['phones', 'laptops', 'accessories', 'gaming', 'fashion', 'home', 'beauty', 'sports']

async function search() {
  if (!query.value.trim()) return
  searching.value = true
  error.value = ''
  message.value = ''
  results.value = []
  selected.value = new Set()
  try {
    results.value = await apiFetch<any[]>(`/api/admin/ebay/search?q=${encodeURIComponent(query.value.trim())}`)
  } catch (e: any) {
    error.value = e.data?.message ?? 'Search failed. Check your eBay API credentials.'
  } finally {
    searching.value = false
  }
}

const toggle = (id: string) => {
  const s = new Set(selected.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selected.value = s
}

const toggleAll = () => {
  selected.value = selected.value.size === results.value.length
    ? new Set()
    : new Set(results.value.map(r => r.ebayItemId))
}

async function importSelected() {
  const items = results.value
    .filter(r => selected.value.has(r.ebayItemId))
    .map(r => ({
      ...r,
      category: category.value || undefined,
      compareGroupId: compareGroupId.value.trim() || undefined,
    }))
  if (!items.length) return

  importing.value = true
  message.value = ''
  error.value = ''
  try {
    const res = await apiFetch<any>('/api/admin/ebay/import', { method: 'POST', body: { items } })
    message.value = `Done — ${res.created} imported, ${res.skipped} already existed${res.errors?.length ? `, ${res.errors.length} errors` : ''}`
    selected.value = new Set()
    compareGroupId.value = ''
  } catch (e: any) {
    error.value = e.data?.message ?? 'Import failed'
  } finally {
    importing.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">eBay Product Import</h1>
      <p class="text-sm text-gray-500 mt-1">Search eBay and import products with your affiliate tag embedded automatically.</p>
    </div>

    <!-- Search -->
    <form class="flex gap-3 mb-4" @submit.prevent="search">
      <input
        v-model="query"
        placeholder="Search eBay (e.g. Sony WH-1000XM5)"
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <button
        type="submit"
        :disabled="searching || !query.trim()"
        class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
      >
        {{ searching ? 'Searching…' : 'Search' }}
      </button>
    </form>

    <!-- Import options — only shown when results exist -->
    <div v-if="results.length" class="flex flex-wrap gap-3 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div class="flex-1 min-w-[180px]">
        <label class="block text-xs font-semibold text-gray-600 mb-1">Category</label>
        <select v-model="category" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
          <option value="">— None —</option>
          <option v-for="c in CATEGORIES" :key="c" :value="c" class="capitalize">{{ c }}</option>
        </select>
      </div>
      <div class="flex-1 min-w-[220px]">
        <label class="block text-xs font-semibold text-gray-600 mb-1">Compare Group ID <span class="text-gray-400 font-normal">(optional — links same product across stores)</span></label>
        <input
          v-model="compareGroupId"
          placeholder="e.g. sony-wh1000xm5"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
    </div>

    <p v-if="error" class="text-red-600 text-sm mb-4 bg-red-50 rounded-lg px-3 py-2">{{ error }}</p>
    <p v-if="message" class="text-green-700 text-sm mb-4 bg-green-50 rounded-lg px-3 py-2 font-medium">{{ message }}</p>

    <!-- Results -->
    <div v-if="results.length">
      <div class="flex items-center justify-between mb-3">
        <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
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

      <div class="space-y-2">
        <div
          v-for="item in results"
          :key="item.ebayItemId"
          :class="selected.has(item.ebayItemId) ? 'ring-2 ring-primary-500 bg-primary-50' : 'bg-white hover:bg-gray-50'"
          class="flex items-center gap-4 p-4 rounded-xl border border-gray-200 cursor-pointer transition-all"
          @click="toggle(item.ebayItemId)"
        >
          <input type="checkbox" :checked="selected.has(item.ebayItemId)" class="rounded flex-shrink-0" @click.stop="toggle(item.ebayItemId)" />
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.title"
            class="w-16 h-16 object-contain rounded bg-gray-50 flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 line-clamp-2">{{ item.title }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-400">ID: {{ item.ebayItemId }}</span>
              <span class="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{{ item.condition }}</span>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-base font-bold text-primary-600">${{ item.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <p v-else-if="!searching" class="text-gray-400 text-sm text-center py-16">
      Search eBay to find products to import.
    </p>
  </div>
</template>
