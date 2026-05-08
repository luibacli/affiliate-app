<template>
  <footer class="bg-gray-950 text-gray-500 text-sm border-t border-white/[0.06] mt-auto">
    <div class="max-w-7xl mx-auto px-4 pt-10 pb-6">

      <!-- Top -->
      <div class="flex flex-col md:flex-row items-start md:items-start justify-between gap-8 mb-8">

        <!-- Brand -->
        <div class="max-w-xs">
          <p class="font-black text-xl tracking-tight leading-none mb-2">
            <span class="text-white">SmartBuy</span><span class="text-accent-400">Hub</span>
          </p>
          <p class="text-xs text-gray-600 leading-relaxed">
            Compare prices across Amazon, Shopee, Lazada & more — all in one place, free forever.
          </p>
        </div>

        <!-- Links columns -->
        <div class="flex flex-wrap gap-x-12 gap-y-6">
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Browse</p>
            <div class="flex flex-col gap-2 text-xs">
              <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
              <NuxtLink to="/shop" class="hover:text-white transition-colors">Shop</NuxtLink>
              <NuxtLink to="/search" class="hover:text-white transition-colors">Search</NuxtLink>
              <NuxtLink to="/best/phones" class="hover:text-white transition-colors">Best Deals</NuxtLink>
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Company</p>
            <div class="flex flex-col gap-2 text-xs">
              <NuxtLink to="/about" class="hover:text-white transition-colors">About</NuxtLink>
              <NuxtLink to="/contact" class="hover:text-white transition-colors">Contact</NuxtLink>
              <NuxtLink to="/sitemap.xml" class="hover:text-white transition-colors">Sitemap</NuxtLink>
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Legal</p>
            <div class="flex flex-col gap-2 text-xs">
              <NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacy Policy</NuxtLink>
              <NuxtLink to="/terms" class="hover:text-white transition-colors">Terms of Use</NuxtLink>
              <NuxtLink to="/disclosure" class="hover:text-white transition-colors">Affiliate Disclosure</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/[0.05] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p class="text-xs text-gray-700 leading-relaxed max-w-lg">
          <strong class="text-gray-600">Affiliate Disclosure:</strong>
          SmartBuyHub participates in affiliate programs and earns commissions on qualifying purchases at no extra cost to you.
          <NuxtLink to="/disclosure" class="text-gray-500 hover:text-white underline ml-1 transition-colors">Learn more</NuxtLink>
        </p>
        <p class="text-xs text-gray-700 flex-shrink-0">© 2026 SmartBuyHub. All rights reserved.</p>
      </div>

    </div>
  </footer>
</template>
