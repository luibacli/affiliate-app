<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message: string } }>()
const handleError = () => clearError({ redirect: '/' })
const is404 = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 font-sans">
    <div class="text-center max-w-md">
      <p class="text-8xl font-black text-primary-600 mb-2">{{ error.statusCode }}</p>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        {{ is404 ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p class="text-gray-500 mb-8 text-sm">
        {{ is404 ? "We couldn't find that page. Try searching for what you need." : error.message }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          @click="handleError"
        >
          Back to Home
        </button>
        <NuxtLink
          to="/search"
          class="px-6 py-3 border border-gray-300 hover:border-primary-400 text-gray-700 font-semibold rounded-xl transition-colors"
        >
          Search Deals
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
