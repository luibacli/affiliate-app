<template>
  <section
    id="affiliate"
    class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 text-white py-16 md:py-24"
  >
    <!-- Background accents -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-600/10 border border-primary-500/10" />
      <div class="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent-500/10 border border-accent-400/10" />
      <svg class="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="aff-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#aff-grid)" />
      </svg>
    </div>

    <div class="relative max-w-4xl mx-auto px-4 text-center">

      <!-- Badge -->
      <span class="inline-block text-xs font-bold uppercase tracking-widest text-accent-400 bg-accent-400/10 border border-accent-400/20 px-3 py-1 rounded-full mb-6">
        For Affiliates & Contributors
      </span>

      <!-- Headline -->
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
        Earn by Sharing<br class="hidden sm:block" />
        <span class="text-accent-400">Products You Love</span>
      </h2>

      <!-- Description -->
      <p class="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
        Join SmartBuy Hub as a contributor. Post affiliate product listings, drive clicks, and earn commissions on every qualifying purchase — no technical skills needed.
      </p>

      <!-- Benefits grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
        <div
          v-for="perk in perks"
          :key="perk.label"
          class="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <span class="text-2xl">{{ perk.icon }}</span>
          <p class="font-bold text-white text-sm">{{ perk.label }}</p>
          <p class="text-xs text-gray-400 text-center leading-snug">{{ perk.desc }}</p>
        </div>
      </div>

      <!-- CTA buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 active:scale-95 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-accent-500/30 transition-all duration-150 hover:-translate-y-0.5"
        >
          Become a Contributor
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-lg rounded-2xl border border-white/20 transition-all duration-150"
        >
          Start Earning
        </NuxtLink>
      </div>

      <p class="text-xs text-gray-600 mt-6">
        Have questions? <NuxtLink to="/contact" class="text-gray-400 hover:text-white underline transition-colors">Contact us</NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const perks = [
  { icon: '📦', label: 'Post Any Product', desc: 'Submit listings from any platform with your affiliate link.' },
  { icon: '💸', label: 'Earn Commissions', desc: 'Get paid when users click through and make a purchase.' },
  { icon: '📈', label: 'Track Performance', desc: 'Monitor clicks and earnings from your contributor dashboard.' },
]
</script>
