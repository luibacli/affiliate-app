<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'partner' })

const { session, fetchSession } = usePartnerAuth()
const app = ref<any>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await fetchSession()
  try {
    app.value = await $fetch('/api/partner/application')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Could not load application.'
  } finally {
    loading.value = false
  }
})

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string; message: string }> = {
  submitted: {
    label: 'Submitted',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    icon: '📬',
    message: 'Your application has been received and is awaiting review.',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    icon: '🔍',
    message: 'Our team is currently reviewing your application. Expect a decision within 24 hours.',
  },
  approved: {
    label: 'Approved',
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    icon: '✅',
    message: 'Congratulations! Your application has been approved. You can now access the Partner Hub.',
  },
  rejected: {
    label: 'Not Approved',
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    icon: '❌',
    message: 'Your application was not approved at this time. You may re-apply after 30 days.',
  },
}

const status = computed(() => app.value ? (STATUS_CONFIG[app.value.status] ?? STATUS_CONFIG.submitted) : null)
</script>

<template>
  <div class="min-h-screen bg-gray-950 font-sans flex items-center justify-center px-4">
    <div class="w-full max-w-lg">

      <div class="mb-8">
        <NuxtLink to="/" class="inline-block mb-4">
          <p class="font-black text-xl">
            <span class="text-orange-400">WinRose</span><span class="text-white"> Hub</span>
          </p>
        </NuxtLink>
        <h1 class="text-2xl font-black text-white">Application Status</h1>
      </div>

      <div v-if="loading" class="bg-gray-900 border border-white/10 rounded-2xl p-8 text-center">
        <div class="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto" />
        <p class="text-gray-400 text-sm mt-3">Loading...</p>
      </div>

      <div v-else-if="error" class="bg-red-900/30 border border-red-700/50 rounded-2xl p-6 text-red-300 text-sm">
        {{ error }}
      </div>

      <div v-else-if="app && status" class="bg-gray-900 border border-white/10 rounded-2xl p-8">

        <!-- Status badge -->
        <div class="flex items-center gap-4 mb-6">
          <div :class="status.bg" class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            {{ status.icon }}
          </div>
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-widest mb-1">Application Status</p>
            <p class="text-2xl font-black" :class="status.color">{{ status.label }}</p>
          </div>
        </div>

        <p class="text-gray-300 text-sm mb-6">{{ status.message }}</p>

        <!-- Application details -->
        <div class="space-y-3 text-sm border-t border-white/10 pt-5">
          <div class="flex justify-between">
            <span class="text-gray-500">Business</span>
            <span class="text-white font-medium">{{ app.businessName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Niche</span>
            <span class="text-white">{{ app.niche }}</span>
          </div>
          <div v-if="app.websiteUrl" class="flex justify-between">
            <span class="text-gray-500">Website</span>
            <a :href="app.websiteUrl" target="_blank" class="text-orange-400 hover:underline truncate max-w-xs">{{ app.websiteUrl }}</a>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Submitted</span>
            <span class="text-white">{{ new Date(app.createdAt).toLocaleDateString() }}</span>
          </div>
          <div v-if="app.reviewNote" class="bg-gray-800 rounded-xl p-3 mt-2">
            <p class="text-xs text-gray-400 mb-1">Note from reviewer</p>
            <p class="text-sm text-gray-200">{{ app.reviewNote }}</p>
          </div>
        </div>

        <div class="mt-6">
          <NuxtLink
            v-if="app.status === 'approved'"
            to="/partner/dashboard"
            class="block text-center bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
          >
            Go to Partner Hub
          </NuxtLink>
          <NuxtLink
            v-else
            to="/"
            class="block text-center bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl px-6 py-3 text-sm transition-colors"
          >
            Back to Storefront
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>
