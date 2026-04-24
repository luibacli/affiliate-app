<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-black text-gray-900 mb-2">Contact Us</h1>
    <p class="text-gray-500 mb-10">Questions, feedback, or data correction requests — we read every message.</p>

    <form class="space-y-5" @submit.prevent="submit">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1" for="name">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Your name"
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1" for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="your@email.com"
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1" for="subject">Subject</label>
        <select
          id="subject"
          v-model="form.subject"
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="general">General Inquiry</option>
          <option value="data">Incorrect Product Data</option>
          <option value="privacy">Privacy / Data Request</option>
          <option value="partnership">Business Partnership</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1" for="message">Message</label>
        <textarea
          id="message"
          v-model="form.message"
          required
          rows="5"
          placeholder="Describe your question or request..."
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      <button
        type="submit"
        :disabled="sending"
        class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg text-sm transition-colors"
      >
        {{ sending ? 'Sending...' : 'Send Message' }}
      </button>

      <p v-if="success" class="text-sm text-emerald-600 font-medium text-center">
        Message sent! We'll get back to you within 2 business days.
      </p>
      <p v-if="error" class="text-sm text-red-600 font-medium text-center">
        Something went wrong. Please try again.
      </p>
    </form>

    <div class="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 space-y-1">
      <p><strong class="text-gray-700">Response time:</strong> Within 2 business days</p>
      <p><strong class="text-gray-700">Affiliate inquiries:</strong> Please include your platform/site URL</p>
      <p><strong class="text-gray-700">Data removal requests:</strong> Reference our <NuxtLink to="/privacy" class="text-primary-600 hover:underline">Privacy Policy</NuxtLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({ name: '', email: '', subject: 'general', message: '' })
const sending = ref(false)
const success = ref(false)
const error = ref(false)

async function submit() {
  sending.value = true
  success.value = false
  error.value = false
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...form },
    })
    success.value = true
    form.name = ''
    form.email = ''
    form.message = ''
    form.subject = 'general'
  } catch {
    error.value = true
  } finally {
    sending.value = false
  }
}

useHead({
  title: 'Contact SmartBuy Marketplace — Get in Touch',
  meta: [
    { name: 'description', content: 'Contact SmartBuy Marketplace for product data corrections, partnership inquiries, privacy requests, or general questions about our price comparison platform.' },
  ],
})
</script>
