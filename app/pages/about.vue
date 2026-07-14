<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-black text-gray-900 mb-2">About WinRose</h1>
    <p class="text-gray-500 mb-10">Your independent price comparison engine across top online shopping platforms worldwide.</p>

    <section class="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
      <p>
        WinRose is an independent affiliate price-comparison platform that helps consumers worldwide
        find the best product prices across major global e-commerce platforms.
        We aggregate product listings, track price history, and surface the best deals — all in one place.
      </p>

      <h2 class="text-xl font-bold text-gray-900 mt-8 mb-2">Our Mission</h2>
      <p>
        We believe every shopper deserves to make an informed purchase decision. WinRose provides free,
        unbiased price data so you can shop smarter — not harder. We never charge users for access to
        our comparison tools.
      </p>

      <h2 class="text-xl font-bold text-gray-900 mt-8 mb-2">How We Make Money</h2>
      <p>
        WinRose earns a small commission from affiliate programs on leading e-commerce platforms
        when you click through to a product and make a purchase.
        <strong>This never affects the price you pay</strong> — prices are always sourced directly from the
        merchant and updated regularly.
      </p>
      <p>
        Our editorial recommendations and rankings are based on objective criteria (price, rating,
        value score) and are <strong>not</strong> influenced by affiliate commission rates.
      </p>

      <h2 class="text-xl font-bold text-gray-900 mt-8 mb-2">What We Track</h2>
      <ul class="list-disc list-inside space-y-1 text-gray-600">
        <li>Real-time and historical prices across top global e-commerce platforms</li>
        <li>30-day lowest price tracking per product</li>
        <li>Trending products based on community interest</li>
        <li>Best-value scores (rating-to-price ratio)</li>
        <li>Product categories spanning electronics, home, fashion, and more</li>
      </ul>

      <h2 class="text-xl font-bold text-gray-900 mt-8 mb-2">Data Accuracy</h2>
      <p>
        We make every effort to keep product data accurate and up to date. Prices, availability,
        and product details are synced regularly. However, final prices and availability are always
        determined by the merchant at the time of purchase. We recommend verifying the final price
        on the merchant's website before completing any transaction.
      </p>

      <h2 class="text-xl font-bold text-gray-900 mt-8 mb-2">Contact Us</h2>
      <p>
        Have a question, spotted an error, or want to list your products?
        Visit our <NuxtLink to="/contact" class="text-primary-600 hover:underline">Contact page</NuxtLink>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">

useHead({
  title: 'About WinRose — Price Comparison & Deals in Southeast Asia',
  meta: [
    { name: 'description', content: 'WinRose is a free price comparison platform across top online shopping stores globally. Learn how we help you find the best deals and how our affiliate model works.' },
    { property: 'og:title', content: 'About WinRose' },
    { property: 'og:description', content: 'Free price comparison across leading e-commerce platforms worldwide. No bias. No markup.' },
  ],
})
</script>
