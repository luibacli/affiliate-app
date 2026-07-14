<script setup lang="ts">
import { toast } from 'vue-sonner'
definePageMeta({ layout: 'admin', ssr: false })

const { apiFetch } = useAdminAuth()
const router = useRouter()

const CATEGORIES = ['phones', 'laptops', 'accessories', 'gaming', 'fashion', 'home', 'beauty', 'sports']
const SOURCES = ['Amazon', 'Walmart', 'eBay', 'AliExpress']

const CURRENCIES = ['USD', 'PHP', 'SGD', 'MYR', 'IDR', 'THB']

const form = reactive({
  title: '', description: '', price: '', originalPrice: '',
  affiliateUrl: '', imageUrl: '', category: 'phones',
  source: 'Amazon', currency: 'USD', rating: '', tags: '', compareGroupId: '',
  isFeatured: false, isTrending: false, isBestDeal: false,
})

const saving = ref(false)
const error = ref('')
const imagePreviewError = ref(false)

watch(() => form.imageUrl, () => { imagePreviewError.value = false })

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}
const slugPreview = computed(() => form.title ? slugify(form.title) : '')

async function submit() {
  saving.value = true
  error.value = ''
  try {
    const product = await apiFetch<any>('/api/admin/products', { method: 'POST', body: form })
    toast.success('Product created', {
      description: product?.title ?? form.title,
    })
    await new Promise(r => setTimeout(r, 600))
    router.push('/admin/products')
  } catch (e: any) {
    error.value = e.data?.message ?? 'Failed to create product'
    toast.error('Failed to create product', {
      description: error.value,
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/products" class="text-gray-400 hover:text-gray-600">←</NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Add Product</h1>
    </div>

    <form class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4" @submit.prevent="submit">
      <p v-if="error" class="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{{ error }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
          <input v-model="form.title" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <p v-if="slugPreview" class="text-xs text-gray-400 mt-1">
            Slug: <span class="font-mono text-gray-500">{{ slugPreview }}</span>
          </p>
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
          <label class="block text-xs font-semibold text-gray-600 mb-1">Currency</label>
          <select v-model="form.currency" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Rating (0–5)</label>
          <input v-model="form.rating" type="number" step="0.1" min="0" max="5" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Compare Group ID</label>
          <input v-model="form.compareGroupId" placeholder="e.g. iphone-15-pro-max" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Affiliate URL *</label>
          <input v-model="form.affiliateUrl" type="url" required class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
          <input v-model="form.imageUrl" type="url" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <div v-if="form.imageUrl && !imagePreviewError" class="mt-2 flex items-center gap-3">
            <img
              :src="form.imageUrl"
              class="w-16 h-16 object-contain rounded-xl border border-gray-200 bg-gray-50"
              @error="imagePreviewError = true"
            />
            <span class="text-xs text-gray-400">Preview</span>
          </div>
          <p v-if="imagePreviewError" class="text-xs text-red-500 mt-1">⚠ Image failed to load — check the URL</p>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Tags (comma-separated)</label>
          <input v-model="form.tags" placeholder="apple, iphone, 5g" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>

        <!-- Flags -->
        <div class="sm:col-span-2">
          <label class="block text-xs font-semibold text-gray-600 mb-2">Product Flags</label>
          <div class="flex flex-wrap gap-4">
            <label v-for="flag in ['isFeatured', 'isTrending', 'isBestDeal']" :key="flag" class="flex items-center gap-2 cursor-pointer select-none">
              <input v-model="(form as any)[flag]" type="checkbox" class="w-4 h-4 rounded accent-primary-600" />
              <span class="text-sm font-medium text-gray-700 capitalize">{{ flag.replace('is', '') }}</span>
            </label>
          </div>
        </div>
      </div>

      <button type="submit" :disabled="saving" class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all disabled:opacity-50">
        {{ saving ? 'Saving...' : 'Create Product' }}
      </button>
    </form>
  </div>
</template>
