<script setup lang="ts">
const items = [
  { icon: '✅', text: 'Real prices' },
  { icon: '⚡', text: 'Updated every 6h' },
  { icon: '🔒', text: 'Secure links' },
  { icon: '🆓', text: 'Always free' },
]
</script>

<template>
  <section class="bg-gray-900 border-b border-white/[0.06]">
    <div class="max-w-5xl mx-auto px-4 py-2.5">
      <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
        <div
          v-for="item in items"
          :key="item.text"
          class="flex items-center gap-1.5 text-xs font-medium text-gray-500"
        >
          <span class="leading-none">{{ item.icon }}</span>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
