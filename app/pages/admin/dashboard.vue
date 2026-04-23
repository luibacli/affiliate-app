<script setup lang="ts">
definePageMeta({ ssr: false })

const adminKey = ref('')
const submitted = ref(false)

const { data, pending, error, refresh } = useFetch('/api/admin/analytics', {
  headers: computed(() => ({ 'x-admin-key': adminKey.value })),
  immediate: false,
})

const submit = () => {
  submitted.value = true
  refresh()
}
</script>

<template>
  <main class="admin-dashboard">
    <h1>Analytics Dashboard</h1>

    <form v-if="!submitted || error" @submit.prevent="submit" style="margin-bottom:1.5rem">
      <input v-model="adminKey" type="password" placeholder="Admin key" required />
      <button type="submit">Load Analytics</button>
      <p v-if="error" style="color:red">Invalid key or no data.</p>
    </form>

    <div v-if="pending">Loading...</div>

    <template v-if="data && !pending">
      <!-- Summary cards -->
      <section class="stat-cards">
        <div class="stat-card">
          <p>Total Clicks</p>
          <strong>{{ data.total.toLocaleString() }}</strong>
        </div>
        <div class="stat-card">
          <p>Last 7 days</p>
          <strong>{{ data.last7d.toLocaleString() }}</strong>
        </div>
        <div class="stat-card">
          <p>Last 30 days</p>
          <strong>{{ data.last30d.toLocaleString() }}</strong>
        </div>
      </section>

      <!-- Top products -->
      <section>
        <h2>Top Products by Clicks</h2>
        <table>
          <thead>
            <tr><th>Product</th><th>Price</th><th>Clicks</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in data.byProduct" :key="row._id">
              <td>
                <NuxtLink v-if="row.slug" :to="`/products/${row.slug}`">
                  {{ row.title ?? row.slug }}
                </NuxtLink>
                <span v-else>{{ row.slug }}</span>
              </td>
              <td>${{ row.price ?? '—' }}</td>
              <td><strong>{{ row.count }}</strong></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Clicks by source -->
      <section>
        <h2>Clicks by Traffic Source</h2>
        <table>
          <thead>
            <tr><th>Source</th><th>Clicks</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in data.bySource" :key="row.source">
              <td>{{ row.source }}</td>
              <td><strong>{{ row.count }}</strong></td>
            </tr>
          </tbody>
        </table>
      </section>

      <button @click="refresh()">Refresh</button>
    </template>
  </main>
</template>
