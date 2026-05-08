<script setup lang="ts">
definePageMeta({ layout: false })

const { login, isAuthenticated, fetchSession } = usePartnerAuth()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  await fetchSession()
  if (isAuthenticated.value) await navigateTo('/partner/dashboard')
})

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/partner/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4 font-sans">
    <div class="w-full max-w-md">

      <!-- Brand -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <p class="font-black text-2xl">
            <span class="text-orange-400">SmartBuy</span><span class="text-white"> Hub</span>
          </p>
        </NuxtLink>
        <p class="text-gray-400 text-sm mt-2">Partner Hub — Sign in to your account</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 border border-white/10 rounded-2xl p-8">
        <h1 class="text-lg font-bold text-white mb-6">Welcome back</h1>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full bg-gray-800 border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors"
            />
          </div>

          <div v-if="error" class="bg-red-900/40 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 text-sm transition-colors"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Not a partner yet?
          <NuxtLink to="/partner/apply" class="text-orange-400 hover:text-orange-300 font-medium transition-colors">Apply now</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
