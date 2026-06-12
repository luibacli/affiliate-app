<template>
  <section class="relative overflow-hidden bg-gray-950 text-white py-20 md:py-28">

    <!-- Background orbs -->
    <div class="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-[350px] h-[350px] rounded-full bg-primary-600/15 blur-[50px] will-change-transform" />
      <div class="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-accent-500/12 blur-[40px] will-change-transform" />
    </div>
    <div
      class="absolute inset-0 opacity-[0.2]"
      style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 28px 28px;"
    />

    <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">

      <!-- Badge -->
      <span class="inline-block text-xs font-bold uppercase tracking-widest text-accent-400 bg-accent-400/10 border border-accent-400/20 px-3 py-1 rounded-full mb-6">
        Ready to Save?
      </span>

      <!-- Headline -->
      <h2 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5">
        Start Finding the<br>
        <span class="bg-gradient-to-r from-accent-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent inline-block">
          Best Deals Today.
        </span>
      </h2>

      <!-- Subtext -->
      <p class="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-10">
        Join thousands of smart shoppers comparing prices across every major platform.
        Free, fast, and no sign-up required.
      </p>

      <!-- CTA buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <NuxtLink
          to="/shop"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 active:scale-95 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-accent-500/30 transition-all duration-150 hover:-translate-y-0.5"
        >
          Explore All Deals
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.07] hover:bg-white/[0.12] active:scale-95 text-white font-bold text-lg rounded-2xl border border-white/[0.15] transition-all duration-150"
        >
          Join as Affiliate
        </NuxtLink>
      </div>

      <!-- Micro trust signals -->
      <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-600 font-medium">
        <span class="flex items-center gap-1.5">
          <span class="text-green-500">✓</span> No account required
        </span>
        <span class="flex items-center gap-1.5">
          <span class="text-green-500">✓</span> 100% free to use
        </span>
        <span class="flex items-center gap-1.5">
          <span class="text-green-500">✓</span> Real-time prices
        </span>
        <span class="flex items-center gap-1.5">
          <span class="text-green-500">✓</span> Secure redirects
        </span>
      </div>

    </div>
  </section>
</template>
