<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { key, apiFetch } = useAdminAuth()

const apps = ref<any[]>([])
const loading = ref(false)
const activeFilter = ref('all')
const reviewModal = ref<any>(null)
const reviewNote = ref('')
const reviewLoading = ref(false)
const toast = useNuxtApp().$toast

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

const STATUS_BADGE: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

async function load() {
  if (!key.value) return
  loading.value = true
  try {
    apps.value = await apiFetch<any[]>('/api/admin/applications', { query: { status: activeFilter.value } })
  } catch {
    apps.value = []
  } finally {
    loading.value = false
  }
}

async function takeAction(id: string, action: string) {
  reviewLoading.value = true
  try {
    await apiFetch(`/api/admin/applications/${id}`, {
      method: 'POST',
      body: { action, note: reviewNote.value || undefined },
    })
    reviewModal.value = null
    reviewNote.value = ''
    await load()
  } catch (e: any) {
    alert(e?.data?.message ?? 'Action failed.')
  } finally {
    reviewLoading.value = false
  }
}

function openReview(app: any) {
  reviewModal.value = app
  reviewNote.value = app.reviewNote ?? ''
}

watch([key, activeFilter], load)
onMounted(load)
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Partner Applications</h1>
        <p class="text-sm text-gray-400 mt-0.5">Review and approve seller applications</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        @click="load"
      >
        <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Refresh
      </button>
    </div>

    <div v-if="!key" class="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-700">
      Enter your admin key in the sidebar to load applications.
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-1.5 flex-wrap">
      <button
        v-for="f in FILTERS"
        :key="f.value"
        @click="activeFilter = f.value"
        :class="activeFilter === f.value ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
        class="px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20 text-gray-400 text-sm gap-3">
      <svg class="animate-spin w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      Loading applications...
    </div>

    <!-- Empty -->
    <div v-else-if="!apps.length && key" class="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
      <p class="text-3xl mb-3">📋</p>
      <p class="font-semibold text-gray-600">No applications found</p>
      <p class="text-sm text-gray-400 mt-1">Applications will appear here once sellers apply.</p>
    </div>

    <!-- Applications list -->
    <div v-else-if="apps.length" class="space-y-3">
      <div
        v-for="app in apps"
        :key="app._id"
        class="bg-white rounded-2xl border border-gray-200 p-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <p class="font-bold text-gray-900">{{ app.businessName }}</p>
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" :class="STATUS_BADGE[app.status] ?? 'bg-gray-100 text-gray-600'">
                {{ app.status.replace('_', ' ') }}
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ app.userId?.name }} · {{ app.userId?.email }}</p>
            <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span><strong class="text-gray-700">Niche:</strong> {{ app.niche }}</span>
              <span v-if="app.websiteUrl">
                <strong class="text-gray-700">Website:</strong>
                <a :href="app.websiteUrl" target="_blank" class="text-blue-500 hover:underline ml-1">{{ app.websiteUrl }}</a>
              </span>
              <span><strong class="text-gray-700">Applied:</strong> {{ new Date(app.createdAt).toLocaleDateString() }}</span>
            </div>
            <p class="mt-3 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">{{ app.description }}</p>
            <p v-if="app.reviewNote" class="mt-2 text-xs text-gray-400 italic">Note: {{ app.reviewNote }}</p>
          </div>
          <button
            class="flex-shrink-0 bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl px-4 py-2 transition-colors"
            @click="openReview(app)"
          >
            Review
          </button>
        </div>
      </div>
    </div>

    <!-- Review modal -->
    <div v-if="reviewModal" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60" @click.self="reviewModal = null">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 class="font-bold text-gray-900 text-lg mb-1">Review Application</h3>
        <p class="text-sm text-gray-500 mb-4">{{ reviewModal.businessName }} — {{ reviewModal.userId?.email }}</p>

        <div class="mb-4">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Note (optional)</label>
          <textarea
            v-model="reviewNote"
            rows="3"
            placeholder="Add a note for the applicant..."
            class="w-full border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-sm outline-none resize-none"
          />
        </div>

        <div class="flex gap-2">
          <button
            :disabled="reviewLoading"
            @click="takeAction(reviewModal._id, 'review')"
            class="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            Mark Review
          </button>
          <button
            :disabled="reviewLoading"
            @click="takeAction(reviewModal._id, 'reject')"
            class="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            Reject
          </button>
          <button
            :disabled="reviewLoading"
            @click="takeAction(reviewModal._id, 'approve')"
            class="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl px-4 py-2.5 text-sm transition-colors disabled:opacity-50"
          >
            Approve
          </button>
        </div>

        <button @click="reviewModal = null" class="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors">
          Cancel
        </button>
      </div>
    </div>

  </div>
</template>
