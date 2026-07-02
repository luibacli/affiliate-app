<script setup lang="ts">
definePageMeta({ layout: false })

const form = reactive({ username: '', email: '', name: '', password: '' })
const error = ref('')
const success = ref(false)
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/setup', { method: 'POST', body: { ...form } })
    success.value = true
    setTimeout(() => navigateTo('/admin/login'), 2000)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Setup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Brand -->
      <div class="text-center mb-8">
        <p class="text-2xl font-black tracking-tight">
          <span class="text-white">Win</span><span class="text-orange-400">Rose</span>
          <span class="text-gray-500 font-normal text-base ml-2">Admin</span>
        </p>
        <p class="text-gray-500 text-sm mt-1">Create your admin account</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 border border-white/[0.08] rounded-2xl p-6 space-y-4">

        <!-- Success -->
        <div v-if="success" class="bg-green-950/60 border border-green-800/60 rounded-xl px-4 py-3 text-center">
          <p class="text-sm text-green-300 font-medium">Account created! Redirecting to login…</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-red-950/60 border border-red-800/60 rounded-xl px-4 py-3">
          <p class="text-sm text-red-300">{{ error }}</p>
        </div>

        <form v-if="!success" class="space-y-4" @submit.prevent="submit">
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              required
              class="w-full bg-gray-800 border border-white/[0.08] focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Username</label>
            <input
              v-model="form.username"
              type="text"
              autocomplete="username"
              placeholder="admin"
              required
              class="w-full bg-gray-800 border border-white/[0.08] focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
            <input
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
              class="w-full bg-gray-800 border border-white/[0.08] focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
            <input
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              placeholder="Min. 8 characters"
              required
              minlength="8"
              class="w-full bg-gray-800 border border-white/[0.08] focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
          >
            {{ loading ? 'Creating…' : 'Create Account' }}
          </button>
        </form>
      </div>

      <p class="text-center mt-4 text-xs text-gray-600">
        Already have an account?
        <NuxtLink to="/admin/login" class="text-gray-400 hover:text-white transition-colors">
          Sign in
        </NuxtLink>
      </p>

    </div>
  </div>
</template>
