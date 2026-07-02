export default defineEventHandler((event) => {
  const { adminSubdomain } = useRuntimeConfig()

  // Subdomain enforcement is opt-in. Without it (e.g. on Vercel without a
  // custom domain) /admin/** is reachable on the main domain — session auth
  // is the only gate, which is sufficient.
  if (!adminSubdomain) return

  const host = getRequestHeader(event, 'host') || ''
  const path = getRequestURL(event).pathname

  if (
    path.startsWith('/_') ||
    path.startsWith('/api/') ||
    path === '/favicon.ico' ||
    path.startsWith('/public/')
  ) return

  const isAdminHost = host === adminSubdomain || host.startsWith('admin.')

  if (!isAdminHost && path.startsWith('/admin')) {
    return sendRedirect(event, '/', 302)
  }
})
