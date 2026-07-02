<script setup lang="ts">
definePageMeta({ layout: false })

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value.trim(), password: password.value },
    })
    await navigateTo('/admin/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await $fetch('/api/auth/me')
    await navigateTo('/admin/dashboard')
  } catch {}
})
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
        <p class="text-gray-500 text-sm mt-1">Sign in to your admin panel</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 border border-white/[0.08] rounded-2xl p-6 space-y-4">

        <!-- Error -->
        <div v-if="error" class="bg-red-950/60 border border-red-800/60 rounded-xl px-4 py-3">
          <p class="text-sm text-red-300">{{ error }}</p>
        </div>

        <form class="space-y-4" @submit.prevent="login">
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Username</label>
            <input
              v-model="username"
              type="text"
              autocomplete="username"
              placeholder="admin"
              required
              class="w-full bg-gray-800 border border-white/[0.08] focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              required
              class="w-full bg-gray-800 border border-white/[0.08] focus:border-orange-400/60 focus:ring-1 focus:ring-orange-400/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
          >
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>
      </div>

      <!-- Setup link -->
      <p class="text-center mt-4 text-xs text-gray-600">
        First time?
        <NuxtLink to="/admin/setup" class="text-gray-400 hover:text-white transition-colors">
          Create admin account
        </NuxtLink>
      </p>

    </div>
  </div>
</template>
