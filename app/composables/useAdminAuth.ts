import type { SessionUser } from '~/server/utils/session'

export const useAdminAuth = () => {
  const authError = useState<string>('admin_auth_error', () => '')
  const user = useState<SessionUser | null>('admin_user', () => null)

  async function fetchMe() {
    try {
      user.value = await $fetch<SessionUser>('/api/auth/me')
    } catch {
      user.value = null
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/admin/login')
  }

  const apiFetch = <T>(url: string, opts: any = {}) =>
    $fetch<T>(url, {
      ...opts,
      onResponseError({ response }) {
        if (response.status === 401) {
          authError.value = 'Session expired. Please log in again.'
          navigateTo('/admin/login')
        }
      },
    })

  return { user, authError, apiFetch, fetchMe, logout }
}
