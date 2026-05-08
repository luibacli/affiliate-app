<script setup lang="ts">
const platforms = ['Amazon', 'Walmart', 'eBay', 'Target', 'Best Buy', 'Etsy']

const trustSignals = [
  {
    icon: '🔒',
    iconBg: 'bg-blue-50',
    title: 'Real Prices, No Markup',
    desc: 'Every price is pulled directly from the source platform. What you see is what you pay.',
  },
  {
    icon: '⚡',
    iconBg: 'bg-yellow-50',
    title: 'Updated Every 6 Hours',
    desc: 'Prices and availability refresh constantly so you never see outdated deals.',
  },
  {
    icon: '🎯',
    iconBg: 'bg-green-50',
    title: 'Verified Affiliate Links',
    desc: 'Every click goes through our tracking system. Safe, fast, and FTC-compliant.',
  },
  {
    icon: '🆓',
    iconBg: 'bg-purple-50',
    title: '100% Free, Always',
    desc: 'No subscriptions. No paywalls. We earn only from affiliate commissions — never from you.',
  },
]
</script>

<template>
  <section class="bg-white py-16 md:py-20 border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4">

      <!-- Platforms row -->
      <div class="text-center mb-14">
        <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
          Aggregating deals from
        </p>
        <div class="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
          <span
            v-for="p in platforms"
            :key="p"
            class="text-base sm:text-lg font-black text-gray-200 tracking-tight cursor-default select-none"
          >
            {{ p }}
          </span>
        </div>
      </div>

      <!-- Trust signals grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        <div
          v-for="signal in trustSignals"
          :key="signal.title"
          class="group flex flex-col gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <div
            :class="signal.iconBg"
            class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
          >
            {{ signal.icon }}
          </div>
          <div>
            <h3 class="font-extrabold text-gray-900 text-sm mb-1.5">{{ signal.title }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed">{{ signal.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Affiliate disclosure — trust builder -->
      <div class="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-lg flex-shrink-0">
          📋
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-gray-500 leading-relaxed">
            <strong class="text-gray-700">Affiliate Disclosure:</strong>
            SmartBuy Hub participates in affiliate programs. We earn commissions on qualifying purchases
            at no extra cost to you. This helps us keep the platform free and updated.
            <NuxtLink to="/disclosure" class="text-primary-600 hover:text-primary-700 underline ml-1">
              Full disclosure →
            </NuxtLink>
          </p>
        </div>
      </div>

    </div>
  </section>
</template>
