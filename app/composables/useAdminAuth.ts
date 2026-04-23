export const useAdminAuth = () => {
  const key = ref('')

  onMounted(() => {
    key.value = localStorage.getItem('admin_key') ?? ''
  })

  watch(key, (val) => {
    localStorage.setItem('admin_key', val)
  })

  const headers = computed(() => ({ 'x-admin-key': key.value }))

  const apiFetch = <T>(url: string, opts: any = {}) =>
    $fetch<T>(url, { ...opts, headers: { ...headers.value, ...(opts.headers ?? {}) } })

  return { key, headers, apiFetch }
}
