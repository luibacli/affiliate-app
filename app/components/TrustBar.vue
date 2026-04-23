<template>
  <section class="bg-primary-50 border-y border-primary-100 py-6">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
        <div v-for="item in items" :key="item.text" class="flex items-center gap-3">
          <span class="text-2xl">{{ item.icon }}</span>
          <div class="text-left">
            <p class="text-sm font-bold text-gray-800">{{ item.text }}</p>
            <p class="text-xs text-gray-500">{{ item.sub }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  { icon: '🛡️', text: 'Trusted by Smart Shoppers', sub: 'Verified deals & real prices' },
  { icon: '🔄', text: 'Updated Prices Daily', sub: 'From Shopee, Lazada & Amazon' },
  { icon: '🚫', text: 'No Hidden Fees', sub: 'We never charge you anything' },
]
</script>
