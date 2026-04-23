<script setup lang="ts">
definePageMeta({ layout: 'admin', ssr: false })

const { apiFetch } = useAdminAuth()
const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const CATEGORIES = ['phones', 'laptops', 'accessories', 'gaming', 'fashion', 'home', 'beauty', 'sports']
const SOURCES = ['Shopee', 'Lazada', 'Amazon']

const form = reactive({
  title: '', description: '', price: '', originalPrice: '',
  affiliateUrl: '', imageUrl: '', category: '', source: '',
  rating: '', tags: '', compareGroupId: '',
})
const loading = ref(true)
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  const product = await apiFetch<any>(`/api/admin/products/${id}`)
    .catch(() => null)
  if (!product) { router.push('/admin/products'); return }

  Object.assign(form, {
    title: product.title ?? '',
    description: product.description ?? '',
    price: product.price ?? '',
    originalPrice: product.originalPrice ?? '',
    affiliateUrl: product.affiliateUrl ?? '',
    imageUrl: product.imageUrl ?? '',
    category: product.category ?? '',
    source: product.source ?? '',
    rating: product.rating ?? '',
    tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
    compareGroupId: product.compareGroupId ?? '',
  })
  loading.value = false
})

async function submit() {
  saving.value = true
  error.value = ''
  try {
    await apiFetch(`/api/admin/products/${id}`, { method: 'PUT', body: form })
    router.push('/admin/products')
  } catch (e: any) {
    error.value = e.data?.message ?? 'Failed to update product'
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!confirm('Delete this product permanently?')) return
  await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' })
  router.push('/admin/products')
}
</script>

<template>
  <div class="p-6 max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/products" class="text-gray-400 hover:text-gray-600">←</NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>
      <button @click="remove" class="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold">Delete</button>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Loading...</div>

    <form v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4" @submit.prevent="submit">
      <p v-if="error" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ error }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
          <input v-model="form.title" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Price ($) *</label>
          <input v-model="form.price" type="number" step="0.01" min="0" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Original Price ($)</label>
          <input v-model="form.originalPrice" type="number" step="0.01" min="0" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Category</label>
          <select v-model="form.category" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Source</label>
          <select v-model="form.source" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option v-for="s in SOURCES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Rating (0–5)</label>
          <input v-model="form.rating" type="number" step="0.1" min="0" max="5" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Compare Group ID</label>
          <input v-model="form.compareGroupId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Affiliate URL *</label>
          <input v-model="form.affiliateUrl" type="url" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
          <input v-model="form.imageUrl" type="url" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Tags (comma-separated)</label>
          <input v-model="form.tags" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
      </div>

      <button type="submit" :disabled="saving" class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all disabled:opacity-50">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>
  </div>
</template>
