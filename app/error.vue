<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message: string } }>()
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <main style="text-align:center; padding: 4rem 1rem">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusCode === 404 ? 'Page not found.' : error.message }}</p>
    <button @click="handleError">Go home</button>
  </main>
</template>
