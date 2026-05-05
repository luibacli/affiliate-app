<template>
  <section class="bg-white py-14 md:py-20 border-t border-gray-100">
    <div class="max-w-6xl mx-auto px-4">

      <div class="text-center mb-12">
        <span class="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-4">
          Why SmartBuy Hub
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Built for Smarter Shopping
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="b in benefits"
          :key="b.title"
          class="group flex flex-col gap-3 p-6 rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
        >
          <div
            :class="b.iconBg"
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-200"
          >
            {{ b.icon }}
          </div>
          <h3 class="font-extrabold text-gray-900 text-base">{{ b.title }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed">{{ b.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const benefits = [
  {
    icon: '⚡',
    iconBg: 'bg-yellow-50',
    title: 'Compare Instantly',
    desc: 'See prices from multiple platforms side by side — no tab-switching required.',
  },
  {
    icon: '⏱️',
    iconBg: 'bg-blue-50',
    title: 'Save Time',
    desc: 'We do the browsing for you. Find the best deal in under 30 seconds.',
  },
  {
    icon: '🌐',
    iconBg: 'bg-green-50',
    title: 'All Platforms in One',
    desc: 'Amazon, Walmart, Shopee, Lazada — all aggregated and searchable together.',
  },
  {
    icon: '🆓',
    iconBg: 'bg-purple-50',
    title: '100% Free',
    desc: 'No subscriptions, no paywalls. SmartBuy Hub is always free for shoppers.',
  },
]
</script>
