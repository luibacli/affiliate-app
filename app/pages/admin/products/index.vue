<script setup lang="ts">
definePageMeta({ layout: 'admin', ssr: false })

const { key, apiFetch } = useAdminAuth()
const router = useRouter()

const page = ref(1)
const search = ref('')
const category = ref('')
const data = ref<any>(null)
const loading = ref(false)
const deleteId = ref<string | null>(null)

const CATEGORIES = ['phones', 'laptops', 'accessories', 'gaming', 'fashion', 'home', 'beauty', 'sports']

async function load() {
  if (!key.value) return
  loading.value = true
  data.value = await apiFetch('/api/admin/products', {
    query: { page: page.value, search: search.value || undefined, category: category.value || undefined },
  }).catch(() => null)
  loading.value = false
}

async function seed(drop = false) {
  if (!confirm(drop ? 'Drop all products and reseed?' : 'Seed sample products?')) return
  const res = await apiFetch<any>(`/api/admin/seed?drop=${drop}`, { method: 'POST' })
  alert(res.message)
  await load()
}

async function confirmDelete(id: string) {
  if (!confirm('Delete this product?')) return
  await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' })
  await load()
}

watch([key, page, category], load)
watch(search, useDebounceFn(load, 400))
onMounted(load)
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p v-if="data?.total" class="text-sm text-gray-500">{{ data.total }} total</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button @click="seed(false)" class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Seed Data</button>
        <button @click="seed(true)" class="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium">Reseed</button>
        <NuxtLink to="/admin/products/create" class="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold">+ Add Product</NuxtLink>
      </div>
    </div>

    <!-- Auth -->
    <div v-if="!key" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex gap-3 items-center">
      <input v-model="key" type="password" placeholder="Enter admin key" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4 flex-wrap">
      <input v-model="search" type="search" placeholder="Search products..." class="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary-400" />
      <select v-model="category" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
        <option value="">All categories</option>
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-16 text-gray-400">Loading...</div>

    <div v-else-if="data?.products?.length" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Source</th>
            <th class="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
            <th class="text-center px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Rating</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="p in data.products" :key="p._id" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img v-if="p.imageUrl" :src="p.imageUrl" :alt="p.title" class="w-10 h-10 object-contain rounded-lg bg-gray-100 flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-800 line-clamp-1">{{ p.title }}</p>
                  <p class="text-xs text-gray-400">{{ p.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">{{ p.category }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell text-gray-600">{{ p.source }}</td>
            <td class="px-4 py-3 text-right">
              <p class="font-bold text-primary-600">${{ p.price }}</p>
              <p v-if="p.originalPrice" class="text-xs text-gray-400 line-through">${{ p.originalPrice }}</p>
            </td>
            <td class="px-4 py-3 text-center hidden sm:table-cell">
              <span v-if="p.rating" class="text-yellow-500 text-xs font-semibold">⭐ {{ p.rating }}</span>
              <span v-else class="text-gray-300 text-xs">—</span>
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
  </div>
</template>
