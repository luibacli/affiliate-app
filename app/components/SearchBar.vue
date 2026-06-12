<script setup lang="ts">
defineProps<{ large?: boolean }>()
const query = ref('')
const router = useRouter()
const suggestions = ref<any[]>([])
const showSuggestions = ref(false)
const loading = ref(false)
const activeIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const fetchSuggestions = async (q: string) => {
  if (q.trim().length < 2) { suggestions.value = []; showSuggestions.value = false; return }
  loading.value = true
  try {
    suggestions.value = await $fetch<any[]>('/api/search/autocomplete', { query: { q: q.trim() } })
    showSuggestions.value = suggestions.value.length > 0
    activeIndex.value = -1
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
  activeIndex.value = -1
  router.push(`/products/${item.slug}`)
}

const submit = () => {
  if (activeIndex.value >= 0 && suggestions.value[activeIndex.value]) {
    select(suggestions.value[activeIndex.value])
    return
  }
  showSuggestions.value = false
  const q = query.value.trim()
  if (q) router.push(`/search?q=${encodeURIComponent(q)}`)
}

const onKeydown = (e: KeyboardEvent) => {
  if (!showSuggestions.value) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, -1)
  } else if (e.key === 'Escape') {
    showSuggestions.value = false
    activeIndex.value = -1
    inputRef.value?.blur()
  }
}

const onBlur = () => setTimeout(() => { showSuggestions.value = false; activeIndex.value = -1 }, 150)
</script>

<template>
  <div
    :class="large ? 'max-w-2xl' : 'max-w-md'"
    class="w-full mx-auto relative"
    role="combobox"
    :aria-expanded="showSuggestions"
    aria-haspopup="listbox"
  >
    <form class="w-full" @submit.prevent="submit">
      <div class="relative flex items-center">
        <!-- Search icon / loading spinner -->
        <div class="absolute left-4 pointer-events-none">
          <svg
            v-if="!loading"
            :class="large ? 'w-5 h-5' : 'w-4 h-4'"
            class="text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <svg
            v-else
            :class="large ? 'w-5 h-5' : 'w-4 h-4'"
            class="text-primary-400 animate-spin"
            fill="none" viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>

        <input
          ref="inputRef"
          v-model="query"
          type="search"
          placeholder="Search products, brands, categories..."
          :class="large
            ? 'text-base py-4 pr-24 sm:pr-36 pl-12'
            : 'text-sm py-3 pr-11 sm:pr-28 pl-10'"
          class="w-full rounded-2xl border border-gray-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 text-gray-800 transition-shadow"
          autocomplete="off"
          aria-autocomplete="list"
          :aria-activedescendant="activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined"
          @blur="onBlur"
          @keydown="onKeydown"
        />
        <button
          type="submit"
          class="absolute right-2 font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all rounded-xl"
          :class="large
            ? 'px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm'
            : 'p-2 sm:px-4 sm:py-2 sm:text-xs'"
        >
          <!-- Large mode: short text on mobile, full on desktop -->
          <template v-if="large">
            <span class="sm:hidden">Search</span>
            <span class="hidden sm:inline">Search Deals</span>
          </template>
          <!-- Normal mode: icon on mobile, text on desktop -->
          <template v-else>
            <svg class="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span class="hidden sm:inline">Search Deals</span>
          </template>
        </button>
      </div>
    </form>

    <!-- Autocomplete dropdown -->
    <ul
      v-if="showSuggestions"
      id="search-listbox"
      role="listbox"
      class="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden divide-y divide-gray-50"
    >
      <li
        v-for="(item, idx) in suggestions"
        :id="`suggestion-${idx}`"
        :key="item.slug"
        role="option"
        :aria-selected="activeIndex === idx"
        :class="activeIndex === idx ? 'bg-primary-50 border-l-2 border-primary-500' : 'hover:bg-gray-50'"
        class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
        @mousedown.prevent="select(item)"
        @mousemove="activeIndex = idx"
      >
        <div class="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.title"
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-contain p-0.5"
          />
          <svg v-else class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">{{ item.title }}</p>
          <p class="text-xs text-primary-600 font-bold">${{ item.price?.toFixed(2) }}</p>
        </div>
        <span v-if="item.source" class="text-xs text-gray-400 flex-shrink-0 font-medium">{{ item.source }}</span>
      </li>

      <!-- View all results -->
      <li
        class="px-4 py-2.5 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        @mousedown.prevent="submit"
      >
        <span class="text-xs font-semibold text-primary-600">
          See all results for "{{ query }}" →
        </span>
      </li>
    </ul>
  </div>
</template>
