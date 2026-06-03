<script setup lang="ts">
import { toast } from 'vue-sonner'
definePageMeta({ layout: 'admin', ssr: false })

const { key, apiFetch, authError } = useAdminAuth()
const router = useRouter()

const page = ref(1)
const search = ref('')
const category = ref('')
const data = ref<any>(null)
const loading = ref(false)

// Bulk import
const showImport = ref(false)
const importJson = ref('')
const importLoading = ref(false)
const importResult = ref<any>(null)

async function bulkImport() {
  let items: any[]
  try { items = JSON.parse(importJson.value) } catch { toast.error('Invalid JSON'); return }
  if (!Array.isArray(items)) { toast.error('JSON must be an array of products'); return }
  importLoading.value = true
  importResult.value = null
  try {
    importResult.value = await apiFetch<any>('/api/admin/products/import', { method: 'POST', body: { products: items } })
    toast.success(`Imported ${importResult.value.created} products`)
    await load()
  } catch (e: any) {
    toast.error(e.data?.message ?? 'Import failed')
  } finally {
    importLoading.value = false
  }
}

const CATEGORIES = ['phones', 'laptops', 'accessories', 'gaming', 'fashion', 'home', 'beauty', 'sports']

async function load() {
  if (!key.value) return
  loading.value = true
  data.value = await apiFetch('/api/admin/products', {
    query: {
      page: page.value,
      search: search.value || undefined,
      category: category.value || undefined,
    },
  }).catch(() => null)
  loading.value = false
}

async function toggleActive(product: any) {
  try {
    await apiFetch(`/api/admin/products/${product._id}`, {
      method: 'PUT',
      body: { isActive: !product.isActive },
    })
    product.isActive = !product.isActive
    toast.success(product.isActive ? 'Product is now live' : 'Product hidden from storefront')
  } catch {
    toast.error('Failed to update status')
  }
}

async function seed(drop = false) {
  if (!confirm(drop ? 'Drop all products and reseed?' : 'Seed sample products?')) return
  try {
    const res = await apiFetch<any>(`/api/admin/seed?drop=${drop}`, { method: 'POST' })
    toast.success(res.message ?? 'Done')
    await load()
  } catch (e: any) {
    toast.error(e.data?.message ?? 'Seed failed')
  }
}

async function confirmDelete(id: string) {
  if (!confirm('Delete this product?')) return
  try {
    await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    toast.success('Product deleted')
    await load()
  } catch {
    toast.error('Failed to delete product')
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch([key, page, category], load)
watch(search, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(load, 400)
})
onMounted(load)
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p v-if="data?.total" class="text-sm text-gray-500">{{ data.total }} total</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button @click="seed(false)" class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Seed Data</button>
        <button @click="seed(true)" class="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium">Reseed</button>
        <button @click="showImport = true" class="px-3 py-2 text-sm bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium">Bulk Import</button>
        <NuxtLink to="/admin/products/create" class="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold">+ Add Product</NuxtLink>
      </div>
    </div>

    <!-- Auth error -->
    <div v-if="authError" class="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm text-red-700">
      <span>🔒</span> {{ authError }}
    </div>

    <!-- Auth key prompt -->
    <div v-if="!key && !authError" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex gap-3 items-center">
      <input v-model="key" type="password" placeholder="Enter admin key" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4 flex-wrap items-center">
      <div class="relative">
        <input v-model="search" type="search" placeholder="Search products..." class="border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary-400" />
        <span v-if="loading && search" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs animate-spin">⟳</span>
      </div>
      <select v-model="category" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
        <option value="">All categories</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-16 text-gray-400">
      <div class="inline-block w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-2" />
      <p class="text-sm">Loading products...</p>
    </div>

    <div v-else-if="data?.products?.length" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Source</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
            <th class="text-center px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Status</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="p in data.products" :key="p._id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="p.imageUrl" :src="p.imageUrl" :alt="p.title" class="w-10 h-10 object-contain rounded-lg bg-gray-100 flex-shrink-0" />
                <div v-else class="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-800 line-clamp-1">{{ p.title }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ p.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">{{ p.category }}</span>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell text-gray-600 text-xs">{{ p.source ?? '—' }}</td>
            <td class="px-4 py-3 text-right">
              <p class="font-bold text-primary-600">${{ p.price }}</p>
              <p v-if="p.originalPrice" class="text-xs text-gray-400 line-through">${{ p.originalPrice }}</p>
            </td>
            <td class="px-4 py-3 text-center hidden sm:table-cell">
              <button
                @click="toggleActive(p)"
                class="text-xs px-2.5 py-1 rounded-full font-semibold transition-colors"
                :class="p.isActive !== false ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'"
                :title="p.isActive !== false ? 'Click to hide' : 'Click to activate'"
              >
                {{ p.isActive !== false ? 'Live' : 'Pending' }}
              </button>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2 justify-end">
                <NuxtLink :to="`/admin/products/${p._id}`" class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Edit</NuxtLink>
                <button @click="confirmDelete(p._id)" class="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium">Del</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p class="text-xs text-gray-500">Page {{ page }} of {{ data.totalPages }}</p>
        <div class="flex gap-2">
          <button :disabled="page <= 1" @click="page--" class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40">← Prev</button>
          <button :disabled="page >= data.totalPages" @click="page++" class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40">Next →</button>
        </div>
      </div>
    </div>

    <div v-else-if="data" class="text-center py-16 text-gray-400">
      <p class="text-4xl mb-3">📦</p>
      <p class="font-medium">No products yet.</p>
      <p class="text-sm mt-1">Click "Seed Data" to populate with sample products.</p>
    </div>

    <!-- Bulk Import Modal -->
    <div v-if="showImport" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" @click.self="showImport = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-gray-900 text-lg">Bulk Import Products</h2>
          <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="showImport = false">✕</button>
        </div>
        <p class="text-sm text-gray-500">Paste a JSON array of products. Each item needs: <code class="bg-gray-100 px-1 rounded">title</code>, <code class="bg-gray-100 px-1 rounded">price</code>, <code class="bg-gray-100 px-1 rounded">affiliateUrl</code>.</p>
        <textarea
          v-model="importJson"
          rows="8"
          placeholder='[{"title":"Product Name","price":29.99,"affiliateUrl":"https://...","source":"Amazon"}]'
          class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
        <div v-if="importResult" :class="importResult.errors?.length ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'" class="border rounded-xl p-3 text-sm">
          <p class="font-semibold">{{ importResult.created }} created · {{ importResult.skipped }} skipped{{ importResult.errors?.length ? ` · ${importResult.errors.length} errors` : '' }}</p>
        </div>
        <div class="flex gap-2">
          <button
            :disabled="importLoading || !importJson.trim()"
            class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors"
            @click="bulkImport"
          >
            {{ importLoading ? 'Importing...' : 'Import' }}
          </button>
          <button class="px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors" @click="showImport = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
