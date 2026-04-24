export const useAdminAuth = () => {
  // useState ensures the key is shared across all admin components in the same session
  const key = useState<string>('admin_key', () => '')
  const authError = useState<string>('admin_auth_error', () => '')

  onMounted(() => {
    if (!key.value) key.value = localStorage.getItem('admin_key') ?? ''
  })

  watch(key, (val) => {
    localStorage.setItem('admin_key', val)
    if (val) authError.value = ''
  })

  const headers = computed(() => ({ 'x-admin-key': key.value }))

  const apiFetch = <T>(url: string, opts: any = {}) =>
    $fetch<T>(url, {
      ...opts,
      headers: { ...headers.value, ...(opts.headers ?? {}) },
      onResponseError({ response }) {
        if (response.status === 401) {
          authError.value = 'Invalid admin key. Enter your ADMIN_KEY from .env.'
        }
      },
    })

  return { key, headers, apiFetch, authError }
}
