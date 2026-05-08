type SessionUser = { userId: string; role: string; name: string; email: string }

export const usePartnerAuth = () => {
  const session = useState<SessionUser | null>('partner_session', () => null)
  const sessionLoaded = useState<boolean>('partner_session_loaded', () => false)

  async function fetchSession() {
    try {
      session.value = await $fetch<SessionUser>('/api/auth/me')
    } catch {
      session.value = null
    } finally {
      sessionLoaded.value = true
    }
  }

  async function login(email: string, password: string) {
    await $fetch('/api/auth/login', { method: 'POST', body: { email, password } })
    await fetchSession()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    session.value = null
    sessionLoaded.value = false
    await navigateTo('/partner/login')
  }

  const isAuthenticated = computed(() => !!session.value)

  return { session, sessionLoaded, fetchSession, login, logout, isAuthenticated }
}
