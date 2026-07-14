<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-black text-gray-900 mb-2">Affiliate Disclosure</h1>
    <p class="text-gray-500 mb-10">Last updated: April 24, 2026</p>

    <section class="space-y-6 text-gray-700 leading-relaxed text-sm">

      <div class="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <p class="font-semibold text-amber-900 text-base mb-1">Important Notice</p>
        <p class="text-amber-800">
          WinRose is a participant in affiliate advertising programs. When you click a product link
          and make a qualifying purchase, we earn a commission — at <strong>no additional cost to you</strong>.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Programs We Participate In</h2>
        <ul class="list-disc list-inside space-y-2 text-gray-600">
          <li>
            <strong>Amazon Associates Program</strong> — WinRose is a participant in the Amazon Services LLC
            Associates Program, an affiliate advertising program designed to provide a means for sites to earn
            advertising fees by advertising and linking to Amazon.com and affiliated Amazon sites.
          </li>
          <li>
            <strong>Walmart Affiliate Program</strong> — We link to products on Walmart and may earn a commission
            on qualifying purchases made through our links.
          </li>
          <li>
            <strong>eBay Partner Network</strong> — We link to products on eBay and may earn a commission
            on qualifying purchases made through our links.
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">How We Identify Affiliate Links</h2>
        <p>
          All outbound product links on WinRose lead to third-party merchant websites through our
          <code class="bg-gray-100 px-1 rounded">/api/click</code> redirect system. These are affiliate links.
          You can identify them because they always open on the merchant's website,
          not on WinRose.
        </p>
        <p class="mt-2">
          CTAs labeled "Check Price", "View Deal", or "Buy on [Platform]" are affiliate links.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Our Editorial Independence</h2>
        <p>
          Affiliate commissions <strong>do not influence</strong> our product rankings, recommendations,
          or editorial content. Products are ranked based on:
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-gray-600">
          <li>Price-to-rating value score (objective algorithm)</li>
          <li>User ratings from the merchant platform</li>
          <li>Click popularity from our users (trending)</li>
          <li>Manual curation by our editorial team (Featured/Best Deal flags)</li>
        </ul>
        <p class="mt-2">We do not accept paid placements or sponsored listings at this time.</p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">FTC Compliance</h2>
        <p>
          This disclosure is provided in accordance with the U.S. Federal Trade Commission's guidelines
          on endorsements and testimonials (16 CFR Part 255). We are committed to transparency about
          our business relationships.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Questions</h2>
        <p>
          If you have questions about our affiliate relationships, please visit our
          <NuxtLink to="/contact" class="text-primary-600 hover:underline">Contact page</NuxtLink>.
        </p>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">

useHead({
  title: 'Affiliate Disclosure — WinRose',
  meta: [
    { name: 'description', content: 'WinRose affiliate disclosure. Learn about our participation in affiliate programs across leading global e-commerce platforms.' },
    { name: 'robots', content: 'noindex' },
  ],
})
</script>
