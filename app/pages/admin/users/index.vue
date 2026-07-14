<script setup lang="ts">
import { toast } from 'vue-sonner'
definePageMeta({ layout: 'admin', ssr: false })

const { isSuperAdmin, apiFetch } = useAdminAuth()

// Redirect if not superadmin
onMounted(async () => {
  if (!isSuperAdmin.value) await navigateTo('/admin/dashboard')
})

// ── State ────────────────────────────────────────────────────────────
const users = ref<any[]>([])
const loading = ref(false)

// Modal state
type ModalMode = 'create' | 'edit' | null
const mode = ref<ModalMode>(null)
const saving = ref(false)
const deleting = ref<string | null>(null)
const confirmDelete = ref<any>(null)

const form = reactive({
  _id: '',
  name: '',
  username: '',
  email: '',
  role: 'admin' as 'admin' | 'super_admin',
  password: '',
})

// ── Load ─────────────────────────────────────────────────────────────
async function load() {
  loading.value = true
  try {
    users.value = await apiFetch<any[]>('/api/admin/users')
  } catch {
    toast.error('Failed to load users.')
  } finally {
    loading.value = false
  }
}

onMounted(load)

// ── Modal helpers ─────────────────────────────────────────────────────
function openCreate() {
  Object.assign(form, { _id: '', name: '', username: '', email: '', role: 'admin', password: '' })
  mode.value = 'create'
}

function openEdit(u: any) {
  Object.assign(form, { _id: u._id, name: u.name, username: u.username, email: u.email, role: u.role, password: '' })
  mode.value = 'edit'
}

function closeModal() {
  mode.value = null
}

// ── Create ────────────────────────────────────────────────────────────
async function createUser() {
  saving.value = true
  try {
    await apiFetch('/api/admin/users', {
      method: 'POST',
      body: { name: form.name, username: form.username, email: form.email, role: form.role, password: form.password },
    })
    toast.success('User created.')
    closeModal()
    await load()
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to create user.')
  } finally {
    saving.value = false
  }
}

// ── Update ────────────────────────────────────────────────────────────
async function updateUser() {
  saving.value = true
  try {
    const body: any = { name: form.name, email: form.email, role: form.role }
    if (form.password) body.password = form.password
    await apiFetch(`/api/admin/users/${form._id}`, { method: 'PATCH', body })
    toast.success('User updated.')
    closeModal()
    await load()
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to update user.')
  } finally {
    saving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────
async function deleteUser() {
  if (!confirmDelete.value) return
  deleting.value = confirmDelete.value._id
  try {
    await apiFetch(`/api/admin/users/${confirmDelete.value._id}`, { method: 'DELETE' })
    toast.success('User deleted.')
    confirmDelete.value = null
    await load()
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to delete user.')
  } finally {
    deleting.value = null
  }
}

// ── Helpers ───────────────────────────────────────────────────────────
const ROLE_LABEL: Record<string, string> = { super_admin: 'Super Admin', admin: 'Admin' }
const ROLE_CLASS: Record<string, string> = {
  super_admin: 'bg-orange-50 text-orange-700 border-orange-200',
  admin: 'bg-blue-50 text-blue-700 border-blue-200',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-sm text-gray-400 mt-0.5">Manage admin accounts and permissions</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors"
        @click="openCreate"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add User
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div v-if="loading" class="py-20 flex items-center justify-center gap-3 text-gray-400 text-sm">
        <svg class="animate-spin w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Loading users…
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Username</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Created</th>
            <th class="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="u in users" :key="u._id" class="hover:bg-gray-50 transition-colors">
            <!-- Name + email -->
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <span class="text-xs font-bold text-orange-600 uppercase">{{ u.name?.charAt(0) }}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ u.name }}</p>
                  <p class="text-xs text-gray-400">{{ u.email }}</p>
                </div>
              </div>
            </td>
            <!-- Username -->
            <td class="px-5 py-4 hidden sm:table-cell">
              <span class="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">@{{ u.username }}</span>
            </td>
            <!-- Role badge -->
            <td class="px-5 py-4">
              <span :class="ROLE_CLASS[u.role]" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border">
                {{ ROLE_LABEL[u.role] ?? u.role }}
              </span>
            </td>
            <!-- Created -->
            <td class="px-5 py-4 text-gray-400 text-xs hidden md:table-cell">
              {{ fmtDate(u.createdAt) }}
            </td>
            <!-- Actions -->
            <td class="px-5 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  class="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  @click="openEdit(u)"
                >
                  Edit
                </button>
                <button
                  class="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  @click="confirmDelete = u"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!users.length">
            <td colspan="5" class="px-5 py-16 text-center text-sm text-gray-400">No users found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <div v-if="mode" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">

          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">
              {{ mode === 'create' ? 'Add New User' : 'Edit User' }}
            </h2>
            <button class="text-gray-400 hover:text-gray-600 transition-colors" @click="closeModal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="mode === 'create' ? createUser() : updateUser()">

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Jane Doe"
                  required
                  class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-all"
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</label>
                <input
                  v-model="form.username"
                  type="text"
                  placeholder="janedoe"
                  :required="mode === 'create'"
                  :disabled="mode === 'edit'"
                  class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="jane@example.com"
                required
                class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-all"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
              <select
                v-model="form.role"
                class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-all bg-white"
              >
                <option value="admin">Admin — Product management</option>
                <option value="super_admin">Super Admin — Full access</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Password
                <span v-if="mode === 'edit'" class="normal-case font-normal text-gray-400 ml-1">(leave blank to keep current)</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Min. 8 characters"
                :required="mode === 'create'"
                :minlength="mode === 'create' ? 8 : 0"
                class="w-full border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-all"
              />
            </div>

            <div class="flex gap-3 pt-1">
              <button
                type="button"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-50 transition-colors"
              >
                {{ saving ? 'Saving…' : (mode === 'create' ? 'Create User' : 'Save Changes') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="confirmDelete = null" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900">Delete user?</h3>
            <p class="text-sm text-gray-500 mt-1">
              <span class="font-semibold text-gray-700">{{ confirmDelete.name }}</span> (@{{ confirmDelete.username }}) will be permanently removed.
            </p>
          </div>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              @click="confirmDelete = null"
            >
              Cancel
            </button>
            <button
              :disabled="!!deleting"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
              @click="deleteUser"
            >
              {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
