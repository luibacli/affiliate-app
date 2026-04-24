<script setup lang="ts">
import { toast } from 'vue-sonner'
definePageMeta({ layout: 'admin', ssr: false })

const { apiFetch } = useAdminAuth()

const page = ref(1)
const unreadOnly = ref(false)
const data = ref<any>(null)
const loading = ref(false)
const expanded = ref<string | null>(null)

async function load() {
  loading.value = true
  data.value = await apiFetch('/api/admin/messages', {
    query: { page: page.value, unread: unreadOnly.value ? 'true' : undefined },
  }).catch(() => null)
  loading.value = false
}

async function markRead(msg: any) {
  if (msg.read) return
  try {
    await apiFetch(`/api/admin/messages/${msg._id}`, { method: 'PATCH', body: { read: true } })
    msg.read = true
    if (data.value?.unreadCount > 0) data.value.unreadCount--
  } catch {}
}

async function remove(id: string) {
  if (!confirm('Delete this message?')) return
  try {
    await apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    toast.success('Message deleted')
    await load()
  } catch {
    toast.error('Failed to delete message')
  }
}

function toggle(id: string, msg: any) {
  if (expanded.value === id) {
    expanded.value = null
  } else {
    expanded.value = id
    markRead(msg)
  }
}

const SUBJECT_LABELS: Record<string, string> = {
  general: 'General',
  data: 'Data Correction',
  privacy: 'Privacy / Data',
  partnership: 'Partnership',
  other: 'Other',
}

watch([page, unreadOnly], load)
onMounted(load)
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p v-if="data" class="text-sm text-gray-500 mt-0.5">
          {{ data.total }} total
          <span v-if="data.unreadCount > 0" class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            {{ data.unreadCount }} unread
          </span>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input v-model="unreadOnly" type="checkbox" class="w-4 h-4 accent-primary-600" />
          Unread only
        </label>
        <button
          class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
          @click="load"
        >
          Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16 text-gray-400">
      <div class="inline-block w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-2" />
      <p class="text-sm">Loading messages...</p>
    </div>

    <div v-else-if="data?.messages?.length" class="space-y-2">
      <div
        v-for="msg in data.messages"
        :key="msg._id"
        :class="!msg.read ? 'border-primary-200 bg-white' : 'border-gray-100 bg-gray-50'"
        class="border rounded-2xl overflow-hidden transition-all"
      >
        <!-- Row -->
        <button
          class="w-full text-left px-5 py-4 flex items-start gap-4"
          @click="toggle(msg._id, msg)"
        >
          <!-- Unread dot -->
          <span
            :class="!msg.read ? 'bg-primary-600' : 'bg-transparent'"
            class="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
          />

          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="font-semibold text-gray-900 text-sm">{{ msg.name }}</span>
              <span class="text-xs text-gray-400">{{ msg.email }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {{ SUBJECT_LABELS[msg.subject] ?? msg.subject }}
              </span>
              <span class="text-xs text-gray-400 ml-auto">
                {{ new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
              </span>
            </div>
            <p class="text-sm text-gray-500 mt-0.5 truncate">{{ msg.message }}</p>
          </div>

          <svg
            :class="expanded === msg._id ? 'rotate-180' : ''"
            class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform mt-1"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Expanded body -->
        <div v-if="expanded === msg._id" class="px-5 pb-5 pt-0 border-t border-gray-100">
          <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mt-3">{{ msg.message }}</p>
          <div class="flex items-center gap-3 mt-4">
            <a
              :href="`mailto:${msg.email}?subject=Re: ${SUBJECT_LABELS[msg.subject] ?? msg.subject}`"
              class="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
            >
              Reply via Email
            </a>
            <button
              v-if="!msg.read"
              class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl font-medium"
              @click.stop="markRead(msg)"
            >
              Mark as read
            </button>
            <button
              class="px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium ml-auto"
              @click.stop="remove(msg._id)"
            >
              Delete
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-3">From IP: {{ msg.ip ?? 'unknown' }}</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="data.totalPages > 1" class="flex items-center justify-between pt-4">
        <p class="text-xs text-gray-500">Page {{ page }} of {{ data.totalPages }}</p>
        <div class="flex gap-2">
          <button :disabled="page <= 1" @click="page--" class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40">← Prev</button>
          <button :disabled="page >= data.totalPages" @click="page++" class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-40">Next →</button>
        </div>
      </div>
    </div>

    <div v-else-if="data" class="text-center py-20 text-gray-400">
      <p class="text-4xl mb-3">✉️</p>
      <p class="font-medium text-gray-600">{{ unreadOnly ? 'No unread messages' : 'No messages yet' }}</p>
      <p class="text-sm mt-1">Messages submitted through the contact form will appear here.</p>
    </div>
  </div>
</template>
