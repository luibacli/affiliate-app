<template>
  <footer class="bg-gray-900 text-gray-400 text-sm mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <!-- Brand -->
        <div>
          <p class="font-black text-white text-xl tracking-tight">
            <span class="text-primary-400">Deal</span><span class="text-accent-400">Hunt</span>
          </p>
          <p class="text-xs mt-1 text-gray-500">Compare prices across Shopee, Lazada & Amazon</p>
        </div>

        <!-- Links -->
        <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
          <NuxtLink to="/search" class="hover:text-white transition-colors">Search</NuxtLink>
          <NuxtLink to="/best/phones" class="hover:text-white transition-colors">Best Deals</NuxtLink>
          <NuxtLink to="/sitemap.xml" class="hover:text-white transition-colors">Sitemap</NuxtLink>
          <NuxtLink to="/admin/dashboard" class="hover:text-white transition-colors">Admin</NuxtLink>
        </div>

        <!-- Copyright -->
        <div class="text-xs text-gray-600 text-right">
          <p>© 2026 DealHunt</p>
          <p class="mt-0.5">Links may earn affiliate commission.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
