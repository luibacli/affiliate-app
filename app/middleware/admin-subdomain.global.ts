const AUTH_PAGES = ['/admin/login', '/admin/setup']

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { adminSubdomain } = useRuntimeConfig().public

  // Only enforce subdomain routing when ADMIN_SUBDOMAIN is configured
  if (!adminSubdomain) return

  const hostname = window.location.hostname
  const isAdminHost = hostname === adminSubdomain || hostname.startsWith('admin.')
  const isAdminRoute = to.path.startsWith('/admin')
  const isAuthPage = AUTH_PAGES.includes(to.path)

  if (isAdminRoute && !isAdminHost) {
    return navigateTo('/')
  }

  if (!isAdminRoute && isAdminHost && !isAuthPage) {
    return navigateTo('/admin/dashboard')
  }
})
