<script setup lang="ts">
definePageMeta({ layout: 'partner', middleware: 'partner' })

const CATEGORIES = [
  'phones', 'laptops', 'accessories', 'gaming', 'fashion',
  'home', 'beauty', 'sports', 'books', 'kitchen', 'other',
]

const form = reactive({
  title: '',
  description: '',
  price: '',
  affiliateUrl: '',
  imageUrl: '',
  category: '',
})

const error = ref('')
const success = ref(false)
const loading = ref(false)

async function submit() {
  error.value = ''
  if (!form.title || !form.price || !form.affiliateUrl) {
    error.value = 'Title, price, and affiliate URL are required.'
    return
  }
  if (Number(form.price) <= 0) {
    error.value = 'Price must be greater than zero.'
    return
  }
  loading.value = true
  try {
    await $fetch('/api/partner/products', { method: 'POST', body: form })
    success.value = true
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to submit product. Please try again.'
  } finally {
    loading.value = false
  }
}

function reset() {
  Object.assign(form, { title: '', description: '', price: '', affiliateUrl: '', imageUrl: '', category: '' })
  success.value = false
  error.value = ''
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto space-y-6">

    <div class="flex items-center gap-3">
      <NuxtLink to="/partner/products" class="text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Submit Product</h1>
        <p class="text-sm text-gray-400 mt-0.5">New products require admin approval before going live</p>
      </div>
    </div>

    <!-- Success state -->
    <div v-if="success" class="bg-white rounded-2xl border border-gray-200 p-8 text-center">
      <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 class="font-bold text-gray-800 text-lg mb-1">Product Submitted</h2>
      <p class="text-sm text-gray-500 mb-6">Your product is pending admin review and will go live once approved.</p>
      <div class="flex items-center justify-center gap-3">
        <NuxtLink to="/partner/products" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors">
          View My Products
        </NuxtLink>
        <button @click="reset" class="bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors">
          Submit Another
        </button>
      </div>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submit" class="space-y-4">
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Product Title <span class="text-orange-500">*</span></label>
          <input v-model="form.title" type="text" placeholder="e.g. Sony WH-1000XM5 Wireless Headphones" class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Price (USD) <span class="text-orange-500">*</span></label>
            <input v-model="form.price" type="number" min="0.01" step="0.01" placeholder="29.99" class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
            <select v-model="form.category" class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition-colors bg-white">
              <option value="">Select category</option>
              <option v-for="c in CATEGORIES" :key="c" :value="c" class="capitalize">{{ c }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Affiliate URL <span class="text-orange-500">*</span></label>
          <input v-model="form.affiliateUrl" type="url" placeholder="https://amazon.com/dp/...?tag=yourcode" class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Image URL</label>
          <input v-model="form.imageUrl" type="url" placeholder="https://..." class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
          <textarea v-model="form.description" rows="3" placeholder="Short product description..." class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors resize-none" />
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{{ error }}</div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-3.5 text-sm transition-colors"
      >
        <span v-if="loading">Submitting...</span>
        <span v-else>Submit for Review</span>
      </button>
    </form>
  </div>
</template>
