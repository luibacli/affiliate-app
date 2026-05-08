<script setup lang="ts">
definePageMeta({ layout: 'partner', middleware: 'partner' })

const products = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    products.value = await $fetch<any[]>('/api/partner/products')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Could not load products.'
  } finally {
    loading.value = false
  }
})

function statusLabel(isActive: boolean) {
  return isActive ? { label: 'Live', class: 'bg-green-100 text-green-700' } : { label: 'Pending Review', class: 'bg-yellow-100 text-yellow-700' }
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Products</h1>
        <p class="text-sm text-gray-400 mt-0.5">Products you've submitted to the marketplace</p>
      </div>
      <NuxtLink
        to="/partner/products/create"
        class="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors"
      >
        <span>+</span> Submit Product
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20 text-gray-400 text-sm gap-3">
      <svg class="animate-spin w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Loading products...
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-600">{{ error }}</div>

    <div v-else-if="!products.length" class="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
      <p class="text-3xl mb-3">📦</p>
      <h3 class="font-bold text-gray-700 mb-1">No products yet</h3>
      <p class="text-sm text-gray-400 mb-5">Submit your first affiliate product to get started.</p>
      <NuxtLink
        to="/partner/products/create"
        class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors"
      >
        Submit First Product
      </NuxtLink>
    </div>

    <div v-else class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Price</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Submitted</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="p in products" :key="p._id" class="hover:bg-gray-50 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <img v-if="p.imageUrl" :src="p.imageUrl" :alt="p.title" class="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                <div v-else class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">📦</div>
                <p class="font-medium text-gray-800 line-clamp-1">{{ p.title }}</p>
              </div>
            </td>
            <td class="px-5 py-4 hidden sm:table-cell">
              <span v-if="p.category" class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">{{ p.category }}</span>
              <span v-else class="text-gray-300">—</span>
            </td>
            <td class="px-5 py-4 text-gray-700 font-medium hidden md:table-cell">${{ p.price }}</td>
            <td class="px-5 py-4">
              <span class="text-xs px-2 py-1 rounded-full font-semibold" :class="statusLabel(p.isActive).class">
                {{ statusLabel(p.isActive).label }}
              </span>
            </td>
            <td class="px-5 py-4 text-gray-400 hidden lg:table-cell">{{ new Date(p.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
