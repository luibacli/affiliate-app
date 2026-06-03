<script setup lang="ts">
const steps = [
  {
    step: '01',
    icon: '🔍',
    iconBg: 'bg-primary-600/20 border border-primary-500/30',
    title: 'Search or Browse',
    desc: 'Search thousands of products or browse by category. We aggregate deals from Amazon, Walmart, eBay, and more.',
  },
  {
    step: '02',
    icon: '💡',
    iconBg: 'bg-accent-500/20 border border-accent-400/30',
    title: 'Compare Prices',
    desc: 'See the real price from every platform side by side. No markup, no hidden fees. Just the best deal, instantly.',
  },
  {
    step: '03',
    icon: '🛒',
    iconBg: 'bg-emerald-500/20 border border-emerald-400/30',
    title: 'Buy & Save',
    desc: 'Click "Check Price" and we redirect you straight to the best deal on the original platform. Fast, safe, free.',
  },
]
</script>

<template>
  <section class="bg-gray-900 text-white py-16 md:py-24">
    <div class="max-w-6xl mx-auto px-4">

      <!-- Header -->
      <div class="text-center mb-14">
        <span class="inline-block text-xs font-bold uppercase tracking-widest text-accent-400 bg-accent-400/10 border border-accent-400/20 px-3 py-1 rounded-full mb-4">
          How It Works
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
          Save More in 3 Simple Steps
        </h2>
        <p class="text-gray-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
          No account needed. No fees. Just better deals.
        </p>
      </div>

      <!-- Steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">

        <!-- Connector line (desktop) -->
        <div class="hidden md:block absolute top-14 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-primary-500/30 via-accent-400/40 to-emerald-500/30" />

        <div
          v-for="(step, i) in steps"
          :key="step.step"
          class="relative flex flex-col gap-5 p-6 sm:p-8 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-2xl transition-all duration-200"
        >
          <!-- Step number (large faded) -->
          <span class="absolute top-5 right-6 text-6xl font-black text-white/[0.05] leading-none select-none">
            {{ step.step }}
          </span>

          <!-- Icon -->
          <div
            :class="step.iconBg"
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          >
            {{ step.icon }}
          </div>

          <!-- Content -->
          <div>
            <h3 class="text-lg font-extrabold text-white mb-2">{{ step.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ step.desc }}</p>
          </div>

          <!-- Mobile step connector -->
          <div v-if="i < 2" class="md:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-px h-6 bg-white/10" />
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 active:scale-95 text-white font-bold text-base rounded-2xl shadow-xl shadow-primary-900/50 transition-all duration-150 hover:-translate-y-0.5"
        >
          Start Browsing Deals
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
