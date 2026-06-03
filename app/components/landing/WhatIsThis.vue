<template>
  <section class="bg-white py-14 md:py-20 border-b border-gray-100">
    <div class="max-w-4xl mx-auto px-4 text-center">

      <span class="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
        What is WinRose?
      </span>

      <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
        One Platform. Every Deal.<br class="hidden sm:block" />
        <span class="text-primary-600">Zero Hassle.</span>
      </h2>

      <p class="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
        WinRose aggregates products from multiple top e-commerce platforms so you can compare prices and find the best deals in seconds — no more tab-switching.
      </p>

      <!-- Three value props inline -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div
          v-for="item in items"
          :key="item.label"
          class="flex flex-col items-center gap-2 p-5 rounded-2xl bg-gray-50 border border-gray-100"
        >
          <span class="text-3xl">{{ item.icon }}</span>
          <p class="font-bold text-gray-800 text-sm">{{ item.label }}</p>
          <p class="text-xs text-gray-500 leading-snug text-center">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  { icon: '🔗', label: 'Aggregates Platforms', desc: 'Products from Amazon, Walmart, eBay, and more in one feed.' },
  { icon: '💰', label: 'Best Price Always', desc: 'We surface the lowest prices and biggest discounts daily.' },
  { icon: '🤝', label: 'Powered by Affiliates', desc: 'Revenue comes from affiliate links — never from ads or subscriptions.' },
]
</script>
