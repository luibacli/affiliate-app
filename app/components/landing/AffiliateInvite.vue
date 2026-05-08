<script setup lang="ts">
const perks = [
  {
    icon: '📦',
    title: 'Post Any Product',
    desc: 'Submit listings from Amazon, Shopee, Lazada, or any platform using your affiliate link.',
  },
  {
    icon: '💸',
    title: 'Earn Commissions',
    desc: 'Get paid every time a user clicks through and completes a purchase. No caps.',
  },
  {
    icon: '📈',
    title: 'Track Performance',
    desc: 'Monitor your clicks, top products, and estimated earnings from your contributor dashboard.',
  },
  {
    icon: '🚀',
    title: 'Grow with SEO',
    desc: 'Your listings rank on Google. We handle the SEO infrastructure — you just share products.',
  },
]
</script>

<template>
  <section
    id="affiliate"
    class="relative overflow-hidden bg-[#07101f] text-white py-16 md:py-24"
  >
    <!-- Background accents -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <div class="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-[100px]" />
      <div class="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent-500/10 blur-[90px]" />
    </div>
    <div
      class="absolute inset-0 opacity-[0.15]"
      style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 32px 32px;"
    />

    <div class="relative z-10 max-w-7xl mx-auto px-4">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        <!-- Left: Text + CTA -->
        <div>
          <span class="inline-block text-xs font-bold uppercase tracking-widest text-accent-400 bg-accent-400/10 border border-accent-400/20 px-3 py-1 rounded-full mb-5">
            For Affiliates & Contributors
          </span>

          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Turn Product Links<br>
            into <span class="bg-gradient-to-r from-accent-400 to-yellow-300 bg-clip-text text-transparent inline-block">Real Income</span>
          </h2>

          <p class="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
            Join SmartBuy Hub as a contributor. Post affiliate product listings, drive clicks,
            and earn commissions on every qualifying purchase — no technical skills required.
          </p>

          <!-- CTA buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink
              to="/partner/apply"
              class="inline-flex items-center justify-center gap-2 px-7 py-4 bg-accent-500 hover:bg-accent-600 active:scale-95 text-white font-bold text-base rounded-2xl shadow-2xl shadow-accent-500/30 transition-all duration-150 hover:-translate-y-0.5"
            >
              Apply to Partner Hub
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </NuxtLink>
            <NuxtLink
              to="/partner/login"
              class="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/[0.07] hover:bg-white/[0.12] active:scale-95 text-white font-semibold text-base rounded-2xl border border-white/[0.15] transition-all duration-150"
            >
              Partner Sign In
            </NuxtLink>
          </div>

          <p class="text-xs text-gray-700 mt-5">
            Have questions?
            <NuxtLink to="/contact" class="text-gray-500 hover:text-white underline transition-colors">
              Contact us
            </NuxtLink>
          </p>
        </div>

        <!-- Right: Perks grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="perk in perks"
            :key="perk.title"
            class="flex flex-col gap-3 p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] transition-colors duration-200"
          >
            <span class="text-2xl leading-none">{{ perk.icon }}</span>
            <div>
              <h3 class="font-extrabold text-white text-sm mb-1">{{ perk.title }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">{{ perk.desc }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
