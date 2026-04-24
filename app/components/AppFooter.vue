<template>
  <footer class="bg-gray-900 text-gray-400 text-sm mt-auto">
    <div class="max-w-7xl mx-auto px-4 pt-10 pb-6">
      <!-- Top row -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
        <!-- Brand -->
        <div>
          <p class="font-black text-white text-xl tracking-tight">
            <span class="text-primary-400">SmartBuy</span><span class="text-accent-400"> Marketplace</span>
          </p>
          <p class="text-xs mt-1 text-gray-500">Compare prices across top online shopping platforms globally</p>
        </div>

        <!-- Navigation links -->
        <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
          <NuxtLink to="/search" class="hover:text-white transition-colors">Search</NuxtLink>
          <NuxtLink to="/best/phones" class="hover:text-white transition-colors">Best Deals</NuxtLink>
          <NuxtLink to="/about" class="hover:text-white transition-colors">About</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-white transition-colors">Contact</NuxtLink>
          <NuxtLink to="/sitemap.xml" class="hover:text-white transition-colors">Sitemap</NuxtLink>
        </div>
      </div>

      <!-- Affiliate disclosure bar -->
      <div class="border-t border-gray-800 pt-4 text-xs text-gray-600">
        <p class="mb-2">
          <strong class="text-gray-500">Affiliate Disclosure:</strong>
          SmartBuy Marketplace participates in affiliate programs from leading e-commerce platforms worldwide.
          We earn commissions on qualifying purchases at no extra cost to you.
          <NuxtLink to="/disclosure" class="text-gray-500 hover:text-white underline ml-1">Learn more</NuxtLink>
        </p>
        <div class="flex flex-wrap gap-x-4 gap-y-1 justify-between items-center">
          <div class="flex gap-x-4 gap-y-1 flex-wrap">
            <NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-white transition-colors">Terms of Use</NuxtLink>
            <NuxtLink to="/disclosure" class="hover:text-white transition-colors">Affiliate Disclosure</NuxtLink>
          </div>
          <p class="text-gray-700">© 2026 SmartBuy Marketplace. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
