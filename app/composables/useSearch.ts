export const useSearch = () => {
  const query = ref('')
  const minPrice = ref<number | ''>('')
  const maxPrice = ref<number | ''>('')
  const source = ref('')
  const sort = ref('newest')
  const page = ref(1)
  const results = ref<any>(null)
  const pending = ref(false)

  let timer: ReturnType<typeof setTimeout>

  const doSearch = async () => {
    pending.value = true
    results.value = await $fetch('/api/search', {
      query: {
        q: query.value || undefined,
        minPrice: minPrice.value || undefined,
        maxPrice: maxPrice.value || undefined,
        source: source.value || undefined,
        sort: sort.value,
        page: page.value,
        limit: 20,
      },
    }).catch(() => null)
    pending.value = false
  }

  const search = () => {
    page.value = 1
    clearTimeout(timer)
    timer = setTimeout(doSearch, 300)
  }

  const goToPage = (n: number) => {
    page.value = n
    doSearch()
  }

  watch([query, minPrice, maxPrice, source, sort], search)

  return { query, minPrice, maxPrice, source, sort, page, results, pending, search, goToPage }
}
