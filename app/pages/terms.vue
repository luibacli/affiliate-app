<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-black text-gray-900 mb-2">Terms of Use</h1>
    <p class="text-gray-500 mb-10">Last updated: April 24, 2026</p>

    <section class="space-y-8 text-gray-700 leading-relaxed text-sm">

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using SmartBuy Marketplace ("the Site"), you agree to be bound by these Terms of Use.
          If you do not agree, please discontinue use of the Site.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">2. Nature of the Service</h2>
        <p>
          SmartBuy Marketplace is a price comparison and affiliate marketplace aggregator. We do <strong>not</strong> sell
          products directly. All purchases are made on third-party e-commerce platforms.
          We are not a party to any transaction between you and these merchants.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">3. Affiliate Disclosure</h2>
        <p>
          SmartBuy Marketplace participates in affiliate advertising programs. When you click a product link and make a
          qualifying purchase, SmartBuy Marketplace may earn a commission at <strong>no additional cost to you</strong>.
          This includes the Amazon Associates Program, Shopee Affiliate Program, and Lazada Affiliate Program.
        </p>
        <p class="mt-2">
          Our product rankings and recommendations are based on objective data (price, ratings, value score)
          and are not influenced by affiliate compensation.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">4. Price Accuracy</h2>
        <p>
          Product prices, availability, and details are sourced from third-party retailers and updated
          regularly. SmartBuy Marketplace does not guarantee the accuracy, completeness, or timeliness of this data.
          Always verify the final price on the merchant's website before purchase. SmartBuy Marketplace is not liable
          for any price discrepancies.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">5. Prohibited Use</h2>
        <p>You agree not to:</p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-gray-600">
          <li>Use automated scripts or bots to scrape or crawl the Site</li>
          <li>Attempt to circumvent rate limits or security measures</li>
          <li>Use the Site for any unlawful purpose</li>
          <li>Reproduce, republish, or redistribute site content without permission</li>
        </ul>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">6. Intellectual Property</h2>
        <p>
          All site content, design, and code are the property of SmartBuy Marketplace. Product images and descriptions
          are the property of their respective merchants and are used under applicable affiliate program
          guidelines.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">7. Limitation of Liability</h2>
        <p>
          SmartBuy Marketplace is provided "as is" without warranties of any kind. We are not liable for any indirect,
          incidental, or consequential damages arising from your use of the Site or from purchases made
          through affiliate links.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">8. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Continued use of the Site after
          changes are posted constitutes acceptance of the revised Terms.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">9. Contact</h2>
        <p>
          Questions about these Terms? Visit our <NuxtLink to="/contact" class="text-primary-600 hover:underline">Contact page</NuxtLink>.
        </p>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Terms of Use — SmartBuy Marketplace',
  meta: [
    { name: 'description', content: 'SmartBuy Marketplace Terms of Use. Understand your rights and obligations when using our price comparison platform.' },
    { name: 'robots', content: 'noindex' },
  ],
})
</script>
