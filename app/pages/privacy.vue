<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
    <p class="text-gray-500 mb-10">Last updated: April 24, 2026</p>

    <section class="space-y-8 text-gray-700 leading-relaxed text-sm">

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
        <p>WinRose collects minimal data necessary to operate the service:</p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-gray-600">
          <li><strong>Usage data:</strong> Pages visited, search terms entered, and product links clicked — used to improve recommendations and identify trending products.</li>
          <li><strong>Device/browser data:</strong> IP address, browser type, and operating system — used for rate limiting, security, and analytics.</li>
          <li><strong>Contact form data:</strong> Name and email address if you contact us voluntarily.</li>
        </ul>
        <p class="mt-2">We do <strong>not</strong> require account registration. We do <strong>not</strong> collect payment information.</p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
        <ul class="list-disc list-inside space-y-1 text-gray-600">
          <li>To operate and improve WinRose's product comparison and search features</li>
          <li>To calculate trending and best-value product rankings</li>
          <li>To detect and prevent abuse (rate limiting, spam prevention)</li>
          <li>To respond to support requests</li>
          <li>To comply with legal obligations</li>
        </ul>
        <p class="mt-2">We do <strong>not</strong> sell your personal data to third parties.</p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">3. Affiliate Links & Third Parties</h2>
        <p>
          WinRose participates in affiliate programs including the Amazon Associates Program, Shopee Affiliate,
          and Lazada Affiliate. When you click a product link and make a purchase, we may earn a commission.

          These third-party platforms have their own privacy policies and data collection practices.
          We encourage you to review their policies:
        </p>
        <ul class="list-disc list-inside mt-2 space-y-1 text-gray-600">
          <li>Amazon Privacy Notice: <span class="text-primary-600">amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ</span></li>
          <li>Walmart Privacy Policy: <span class="text-primary-600">walmart.com/help/article/walmart-privacy-policy/3bb97b8f3f0443279b6a5cb77d5e6244</span></li>
          <li>eBay Privacy Notice: <span class="text-primary-600">ebay.com/help/policies/member-behaviour-policies/ebay-privacy-policy</span></li>
        </ul>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">4. Cookies</h2>
        <p>
          WinRose uses session-level and analytics cookies to maintain site functionality. We do not use
          cross-site tracking cookies. You may disable cookies in your browser settings; however, some
          features may not function correctly.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">5. Data Retention</h2>
        <p>
          Anonymized click/usage data is retained for up to 90 days for analytics purposes.
          Contact form submissions are retained only as long as necessary to respond.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">6. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of any personal data we hold about you
          by contacting us at the address on our <NuxtLink to="/contact" class="text-primary-600 hover:underline">Contact page</NuxtLink>.
          We will respond within 30 days.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">7. Children's Privacy</h2>
        <p>
          WinRose is not directed at children under 13. We do not knowingly collect personal information
          from children. If you believe a child has provided us with personal data, please contact us.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes are effective when posted to this page.
          Continued use of WinRose after changes constitutes acceptance of the updated policy.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">9. Contact</h2>
        <p>
          Questions about this policy? Visit our <NuxtLink to="/contact" class="text-primary-600 hover:underline">Contact page</NuxtLink>.
        </p>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">

useHead({
  title: 'Privacy Policy — WinRose',
  meta: [
    { name: 'description', content: 'WinRose Privacy Policy. Learn how we collect, use, and protect your data on our price comparison platform.' },
    { name: 'robots', content: 'noindex' },
  ],
})
</script>
