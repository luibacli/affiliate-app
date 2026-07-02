const AUTH_PAGES = ['/admin/login', '/admin/setup']

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const hostname = window.location.hostname
  const isAdminHost = hostname.startsWith('admin.')
  const isAdminRoute = to.path.startsWith('/admin')
  const isAuthPage = AUTH_PAGES.includes(to.path)

  // Block all /admin/** routes on the public domain
  if (isAdminRoute && !isAdminHost) {
    return navigateTo('/')
  }

  // On admin subdomain, redirect non-admin routes to dashboard
  // (but allow auth pages through — they handle their own logic)
  if (!isAdminRoute && isAdminHost && !isAuthPage) {
    return navigateTo('/admin/dashboard')
  }
})
