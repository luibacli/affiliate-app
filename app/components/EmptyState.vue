<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
  icon?: string
  actionLabel?: string
  actionTo?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center px-4">
    <div class="text-5xl mb-4">{{ icon ?? '🔍' }}</div>
    <h3 class="text-lg font-bold text-gray-700 mb-1">{{ title ?? 'Nothing here yet' }}</h3>
    <p class="text-sm text-gray-400 mb-6 max-w-xs">{{ message ?? 'Try adjusting your search or filters.' }}</p>
    <NuxtLink
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors"
    >
      {{ actionLabel }}
    </NuxtLink>
  </div>
</template>
