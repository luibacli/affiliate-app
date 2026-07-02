export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const hostname = window.location.hostname
  const isAdminHost = hostname.startsWith('admin.')
  const isAdminRoute = to.path.startsWith('/admin')

  if (isAdminRoute && !isAdminHost) {
    return navigateTo('/')
  }

  if (!isAdminRoute && isAdminHost) {
    return navigateTo('/admin/dashboard')
  }
})
