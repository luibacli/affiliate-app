export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host') || ''
  const path = getRequestURL(event).pathname

  // Skip internal Nuxt assets, API routes, and static files
  if (
    path.startsWith('/_') ||
    path.startsWith('/api/') ||
    path === '/favicon.ico' ||
    path.startsWith('/public/')
  ) return

  const isAdminHost = host.startsWith('admin.')

  // Block /admin/** on public domain
  if (!isAdminHost && path.startsWith('/admin')) {
    return sendRedirect(event, '/', 302)
  }
})
