<script setup lang="ts">
definePageMeta({ layout: false })

const NICHES = [
  'Electronics', 'Fashion & Apparel', 'Home & Garden', 'Health & Beauty',
  'Sports & Outdoors', 'Gaming', 'Books & Education', 'Food & Kitchen',
  'Travel & Outdoors', 'General Merchandise',
]

const form = reactive({
  name: '',
  email: '',
  password: '',
  businessName: '',
  niche: '',
  websiteUrl: '',
  description: '',
})

const error = ref('')
const loading = ref(false)
const submitted = ref(false)

async function submit() {
  error.value = ''
  if (!form.name || !form.email || !form.password || !form.businessName || !form.niche || !form.description) {
    error.value = 'Please fill in all required fields.'
    return
  }
  if (form.password.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  loading.value = true
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: form })
    submitted.value = true
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 font-sans">
    <div class="max-w-2xl mx-auto px-4 py-12">

      <!-- Brand -->
      <div class="mb-10">
        <NuxtLink to="/" class="inline-block mb-6">
          <p class="font-black text-xl">
            <span class="text-orange-400">SmartBuy</span><span class="text-white"> Hub</span>
          </p>
        </NuxtLink>
        <h1 class="text-3xl font-black text-white">Become a Partner</h1>
        <p class="text-gray-400 mt-2">Join the Partner Hub and start earning with affiliate products.</p>
      </div>

      <!-- Success state -->
      <div v-if="submitted" class="bg-gray-900 border border-white/10 rounded-2xl p-8 text-center">
        <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">Application Submitted</h2>
        <p class="text-gray-400 text-sm mb-6">
          We'll review your application within 24–48 hours and send a decision to <strong class="text-white">{{ form.email }}</strong>.
        </p>
        <NuxtLink
          to="/partner/status"
          class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
        >
          View Application Status
        </NuxtLink>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="space-y-6">

        <!-- Account details -->
        <div class="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 class="text-sm font-bold text-white uppercase tracking-widest">Account Details</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Full Name <span class="text-orange-400">*</span></label>
              <input v-model="form.name" type="text" placeholder="Your name" class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email <span class="text-orange-400">*</span></label>
              <input v-model="form.email" type="email" autocomplete="email" placeholder="you@example.com" class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Password <span class="text-orange-400">*</span></label>
            <input v-model="form.password" type="password" autocomplete="new-password" placeholder="Min 8 characters" class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
          </div>
        </div>

        <!-- Partner profile -->
        <div class="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 class="text-sm font-bold text-white uppercase tracking-widest">Partner Profile</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Business Name <span class="text-orange-400">*</span></label>
              <input v-model="form.businessName" type="text" placeholder="Your brand or business" class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Primary Niche <span class="text-orange-400">*</span></label>
              <select v-model="form.niche" class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors">
                <option value="" disabled>Select a niche</option>
                <option v-for="n in NICHES" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Website or Social Profile</label>
            <input v-model="form.websiteUrl" type="url" placeholder="https://yoursite.com" class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">What will you submit? <span class="text-orange-400">*</span></label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Briefly describe the types of affiliate products you plan to list..."
              class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors resize-none"
            />
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-900/40 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-4 text-sm transition-colors"
        >
          <span v-if="loading">Submitting Application...</span>
          <span v-else>Submit Application</span>
        </button>

        <p class="text-center text-sm text-gray-500">
          Already a partner?
          <NuxtLink to="/partner/login" class="text-orange-400 hover:text-orange-300 font-medium transition-colors">Sign in</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>
