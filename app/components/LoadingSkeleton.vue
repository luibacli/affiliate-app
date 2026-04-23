<script setup lang="ts">
defineProps<{ count?: number }>()
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
    <div
      v-for="i in (count ?? 10)"
      :key="i"
      class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
    >
      <div class="w-full h-44 bg-gray-200" />
      <div class="p-3 space-y-2">
        <div class="h-3 bg-gray-200 rounded w-1/3" />
        <div class="h-3 bg-gray-200 rounded w-full" />
        <div class="h-3 bg-gray-200 rounded w-4/5" />
        <div class="h-5 bg-gray-200 rounded w-1/2 mt-3" />
        <div class="h-9 bg-gray-200 rounded-xl mt-2" />
      </div>
    </div>
  </div>
</template>
