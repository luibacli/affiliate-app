<script setup lang="ts">
const props = defineProps<{ large?: boolean }>()
const query = ref('')
const router = useRouter()
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
const loading = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const fetchSuggestions = async (q: string) => {
  if (q.trim().length < 2) { suggestions.value = []; showSuggestions.value = false; return }
  loading.value = true
  try {
    suggestions.value = await $fetch<any[]>('/api/search/autocomplete', { query: { q: q.trim() } })
    showSuggestions.value = suggestions.value.length > 0
  } catch {
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

watch(query, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchSuggestions(val), 300)
})

const select = (item: any) => {
  showSuggestions.value = false
  query.value = ''
  router.push(`/products/${item.slug}`)
}

const submit = () => {
  showSuggestions.value = false
  const q = query.value.trim()
  if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
}

const onBlur = () => setTimeout(() => { showSuggestions.value = false }, 150)
</script>

<template>
  <div
    :class="large ? 'max-w-2xl' : 'max-w-md'"
    class="w-full mx-auto relative"
  >
    <form class="w-full" @submit.prevent="submit">
      <div class="relative flex items-center">
        <svg
          class="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="query"
          type="search"
          placeholder="Search products, brands, categories..."
          :class="large ? 'text-base py-4 pr-36' : 'text-sm py-3 pr-28'"
          class="w-full pl-12 rounded-2xl border border-gray-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 text-gray-800"
          autocomplete="off"
          @blur="onBlur"
        />
        <button
          type="submit"
          :class="large ? 'px-6 py-2.5 text-sm' : 'px-4 py-2 text-xs'"
          class="absolute right-2 font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all rounded-xl"
        >
          Search Deals
        </button>
      </div>
    </form>

    <!-- Autocomplete dropdown -->
    <ul
      v-if="showSuggestions"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
    >
      <li
        v-for="item in suggestions"
        :key="item.slug"
        class="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
        @mousedown.prevent="select(item)"
      >
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          :alt="item.title"
          class="w-8 h-8 object-contain rounded flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">{{ item.title }}</p>
          <p class="text-xs text-primary-600 font-semibold">${{ item.price?.toFixed(2) }}</p>
        </div>
        <span
          v-if="item.source"
          class="text-xs text-gray-400 flex-shrink-0"
        >{{ item.source }}</span>
      </li>
    </ul>
  </div>
</template>
