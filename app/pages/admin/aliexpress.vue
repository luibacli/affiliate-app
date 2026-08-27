<script setup lang="ts">
definePageMeta({ layout: 'admin', ssr: false })

const { apiFetch } = useAdminAuth()

type Draft = {
  aliexpressProductId: string
  title: string
  description: string
  price: number
  originalPrice: number | null
  discountPercent: number
  currency: string
  affiliateUrl: string
  imageUrl: string
  rating: number
  positiveFeedback: number | null
  sales180Day: number
  priceMayVary: boolean
  couponCode: string | null
  commissionRate: number
  warnings: string[]
  alreadyImported: boolean
}

const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref('')
const drafts = ref<Draft[]>([])
const stats = ref<any>(null)
const selected = ref<Set<string>>(new Set())
const category = ref('')
const autoBestDeal = ref(true)
const autoTrending = ref(true)
const parsing = ref(false)
const importing = ref(false)
const message = ref('')
const error = ref('')

const selectedDrafts = computed(() =>
  drafts.value.filter((d) => selected.value.has(d.aliexpressProductId))
)
const warningCount = computed(() => drafts.value.filter((d) => d.warnings.length).length)
const newCount = computed(() => drafts.value.filter((d) => !d.alreadyImported).length)
// Mirrors the server's rank-based cap so the labels state the real count.
const badgeCap = computed(() =>
  Math.min(20, Math.max(1, Math.round(selectedDrafts.value.length * 0.1)))
)

const onFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  parsing.value = true
  error.value = ''
  message.value = ''
  drafts.value = []
  stats.value = null
  selected.value = new Set()
  fileName.value = file.name

  try {
    const form = new FormData()
    form.append('file', file)
    const res = await apiFetch<any>('/api/admin/aliexpress/parse', { method: 'POST', body: form })

    drafts.value = res.drafts
    stats.value = res
    category.value = res.detectedCategory || ''
    // Pre-select everything not already in the catalog.
    selected.value = new Set(
      res.drafts.filter((d: Draft) => !d.alreadyImported).map((d: Draft) => d.aliexpressProductId)
    )
  } catch (e: any) {
    error.value = e.data?.message ?? 'Could not read that file'
    fileName.value = ''
  } finally {
    parsing.value = false
  }
}

const toggle = (id: string) => {
  const s = new Set(selected.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selected.value = s
}

const toggleAll = () => {
  selected.value =
    selected.value.size === drafts.value.length
      ? new Set()
      : new Set(drafts.value.map((d) => d.aliexpressProductId))
}

const selectNewOnly = () => {
  selected.value = new Set(
    drafts.value.filter((d) => !d.alreadyImported).map((d) => d.aliexpressProductId)
  )
}

const importSelected = async () => {
  if (!selectedDrafts.value.length) return
  importing.value = true
  message.value = ''
  error.value = ''
  try {
    const res = await apiFetch<any>('/api/admin/aliexpress/import', {
      method: 'POST',
      body: {
        items: selectedDrafts.value,
        category: category.value,
        autoBestDeal: autoBestDeal.value,
        autoTrending: autoTrending.value,
      },
    })
    message.value = `Done — ${res.created} created, ${res.updated} updated, ${res.skipped} skipped${
      res.errors?.length ? ` (${res.errors.length} errors)` : ''
    }`
    // Reflect the new state so a second click can't double-create.
    drafts.value = drafts.value.map((d) =>
      selected.value.has(d.aliexpressProductId) ? { ...d, alreadyImported: true } : d
    )
    selected.value = new Set()
  } catch (e: any) {
    error.value = e.data?.message ?? 'Import failed'
  } finally {
    importing.value = false
  }
}

const reset = () => {
  drafts.value = []
  stats.value = null
  selected.value = new Set()
  fileName.value = ''
  message.value = ''
  error.value = ''
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-1">AliExpress Import</h1>
    <p class="text-sm text-gray-500 mb-6">
      Upload an AliExpress Portals export (.xls / .xlsx). Products are matched on Product ID, so
      re-uploading a batch updates prices instead of creating duplicates.
    </p>

    <!-- Upload -->
    <div class="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-white text-center">
      <input
        ref="fileInput"
        type="file"
        accept=".xls,.xlsx"
        class="hidden"
        @change="onFileChange"
      />
      <button
        :disabled="parsing"
        class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
        @click="fileInput?.click()"
      >
        {{ parsing ? 'Reading…' : 'Choose export file' }}
      </button>
      <p v-if="fileName" class="text-xs text-gray-500 mt-3">
        {{ fileName }}
        <button class="text-primary-600 hover:underline ml-2" @click="reset">clear</button>
      </p>
      <p v-else class="text-xs text-gray-400 mt-3">
        Name files <code class="bg-gray-100 px-1 rounded">aliexpress_{category}_batch_{n}.xls</code>
        to auto-fill the category.
      </p>
    </div>

    <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>
    <p v-if="message" class="text-green-600 text-sm mb-4 font-medium">{{ message }}</p>

    <template v-if="drafts.length">
      <!-- Parse summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="p-3 bg-white rounded-xl border border-gray-200">
          <p class="text-xl font-black text-gray-900">{{ drafts.length }}</p>
          <p class="text-xs text-gray-500">Valid products</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-gray-200">
          <p class="text-xl font-black text-primary-600">{{ newCount }}</p>
          <p class="text-xs text-gray-500">New to catalog</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-gray-200">
          <p class="text-xl font-black text-amber-600">{{ warningCount }}</p>
          <p class="text-xs text-gray-500">With warnings</p>
        </div>
        <div class="p-3 bg-white rounded-xl border border-gray-200">
          <p class="text-xl font-black text-gray-400">{{ stats?.invalidRows ?? 0 }}</p>
          <p class="text-xs text-gray-500">Unusable rows</p>
        </div>
      </div>

      <!-- Import settings -->
      <div class="mb-5 p-4 bg-white rounded-xl border border-gray-200 flex flex-wrap items-end gap-5">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Category</label>
          <input
            v-model="category"
            placeholder="e.g. home-appliances"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pb-2">
          <input v-model="autoBestDeal" type="checkbox" class="rounded" />
          Badge Best Deal — top {{ badgeCap }} by discount
        </label>
        <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pb-2">
          <input v-model="autoTrending" type="checkbox" class="rounded" />
          Badge Trending — top {{ badgeCap }} by sales
        </label>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              :checked="selected.size === drafts.length"
              class="rounded"
              @change="toggleAll"
            />
            Select all ({{ drafts.length }})
          </label>
          <button class="text-sm text-primary-600 hover:underline" @click="selectNewOnly">
            New only ({{ newCount }})
          </button>
        </div>
        <button
          :disabled="selected.size === 0 || importing"
          class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
          @click="importSelected"
        >
          {{ importing ? 'Importing…' : `Import ${selected.size} selected` }}
        </button>
      </div>

      <!-- Preview -->
      <div class="space-y-2">
        <div
          v-for="d in drafts"
          :key="d.aliexpressProductId"
          :class="selected.has(d.aliexpressProductId) ? 'ring-2 ring-primary-500 bg-primary-50' : 'bg-white'"
          class="flex items-start gap-4 p-3 rounded-xl border border-gray-200 cursor-pointer transition-all"
          @click="toggle(d.aliexpressProductId)"
        >
          <input
            type="checkbox"
            :checked="selected.has(d.aliexpressProductId)"
            class="rounded flex-shrink-0 mt-1"
            @click.stop="toggle(d.aliexpressProductId)"
          />
          <img
            v-if="d.imageUrl"
            :src="d.imageUrl"
            :alt="d.title"
            loading="lazy"
            class="w-16 h-16 object-contain rounded bg-gray-50 flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 line-clamp-2">{{ d.title }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-1">
              <span class="text-xs text-gray-400">ID: {{ d.aliexpressProductId }}</span>
              <span v-if="d.sales180Day" class="text-xs text-gray-500">
                {{ d.sales180Day.toLocaleString() }} sold
              </span>
              <span v-if="d.positiveFeedback" class="text-xs text-gray-500">
                {{ d.positiveFeedback }}% positive → ★{{ d.rating.toFixed(1) }}
              </span>
              <span v-if="d.commissionRate" class="text-xs text-emerald-600 font-medium">
                {{ d.commissionRate }}% commission
              </span>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-1.5">
              <span
                v-if="d.alreadyImported"
                class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
              >
                Already in catalog — will update
              </span>
              <span
                v-for="w in d.warnings"
                :key="w"
                class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800"
              >
                ⚠ {{ w }}
              </span>
              <span
                v-if="d.couponCode"
                class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700"
              >
                🎟 {{ d.couponCode }}
              </span>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-base font-bold text-primary-600">${{ d.price.toFixed(2) }}</p>
            <p v-if="d.originalPrice" class="text-xs text-gray-400 line-through">
              ${{ d.originalPrice.toFixed(2) }}
            </p>
            <p v-if="d.discountPercent" class="text-xs font-bold text-red-500">
              -{{ d.discountPercent }}%
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
