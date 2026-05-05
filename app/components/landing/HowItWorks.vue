<template>
  <section class="bg-gray-50 py-14 md:py-20">
    <div class="max-w-5xl mx-auto px-4">

      <div class="text-center mb-12">
        <span class="inline-block text-xs font-bold uppercase tracking-widest text-accent-500 bg-accent-500/10 px-3 py-1 rounded-full mb-4">
          How It Works
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
          3 Simple Steps
        </h2>
      </div>

      <!-- Steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

        <!-- Connector lines (desktop only) -->
        <div class="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 via-accent-300 to-primary-200 z-0" />

        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="relative z-10 flex flex-col items-center text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <!-- Number + Icon -->
          <div class="relative mb-5">
            <div
              :class="step.bg"
              class="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <span class="text-3xl">{{ step.icon }}</span>
            </div>
            <span class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center shadow">
              {{ i + 1 }}
            </span>
          </div>

          <h3 class="text-lg font-extrabold text-gray-900 mb-2">{{ step.title }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-10">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-150"
        >
          Start Browsing Deals
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    icon: '🔍',
    bg: 'bg-primary-50',
    title: 'Browse Products',
    desc: 'Search or browse thousands of products across Amazon, Walmart, Shopee, and more.',
  },
  {
    icon: '👆',
    bg: 'bg-accent-50',
    title: 'Click the Deal',
    desc: 'Found what you want? Hit "Check Price" and we track the click through our affiliate system.',
  },
  {
    icon: '🛒',
    bg: 'bg-green-50',
    title: 'Buy from Partner Platform',
    desc: 'Complete your purchase on the original platform — at the same price, guaranteed.',
  },
]
</script>
