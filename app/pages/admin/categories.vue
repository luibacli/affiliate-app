<script setup lang="ts">
definePageMeta({ layout: 'admin', ssr: false })

const { apiFetch } = useAdminAuth()

const categories = ref<any[]>([])
const loading = ref(true)
const saving = ref<string | null>(null)

async function load() {
  loading.value = true
  categories.value = await apiFetch<any[]>('/api/admin/categories').catch(() => [])
  loading.value = false
}

async function save(cat: any) {
  saving.value = cat.slug
  await apiFetch(`/api/admin/categories/${cat.slug}`, {
    method: 'PUT',
    body: { icon: cat.icon, label: cat.label, sortOrder: cat.sortOrder },
  }).catch(() => {})
  saving.value = null
}

onMounted(load)
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
        <p class="text-sm text-gray-500 mt-0.5">Customize icons and labels shown in the storefront nav.</p>
      </div>
      <button @click="load" class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Refresh</button>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Loading categories...</div>

    <div v-else-if="categories.length" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Slug</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Icon</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Label</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Products</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Sort Order</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="cat in categories" :key="cat.slug" class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{{ cat.slug }}</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ cat.icon }}</span>
                <input
                  v-model="cat.icon"
                  class="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-400"
                  maxlength="4"
                />
              </div>
            </td>
            <td class="px-4 py-3">
              <input
                v-model="cat.label"
                class="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                :placeholder="cat.slug"
              />
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="text-gray-500 font-medium">{{ cat.count.toLocaleString() }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <input
                v-model.number="cat.sortOrder"
                type="number"
                class="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </td>
            <td class="px-4 py-3">
              <button
                :disabled="saving === cat.slug"
                class="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                @click="save(cat)"
              >
                {{ saving === cat.slug ? '...' : 'Save' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-20 text-gray-400">
      <p class="text-4xl mb-3">🏷️</p>
      <p class="font-medium">No categories found.</p>
      <p class="text-sm mt-1">Add products with categories first.</p>
    </div>
  </div>
</template>
