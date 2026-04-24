<template>
  <section class="bg-white border-b border-gray-100">
    <div class="max-w-5xl mx-auto px-4 py-4">
      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <div
          v-for="item in items"
          :key="item.text"
          class="flex items-center gap-2.5 text-sm"
        >
          <span class="text-lg leading-none">{{ item.icon }}</span>
          <span class="font-semibold text-gray-700">{{ item.text }}</span>
          <span class="hidden sm:block text-gray-300">·</span>
          <span class="hidden sm:block text-xs text-gray-400">{{ item.sub }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  { icon: '✅', text: 'Real Prices, No Markup', sub: 'Direct from platforms' },
  { icon: '🔄', text: 'Updated Every 6 Hours', sub: 'Always fresh data' },
  { icon: '🔒', text: 'Secure & Private', sub: 'No tracking, no data selling' },
  { icon: '🚫', text: 'Completely Free', sub: 'We earn from affiliate links' },
]
</script>
