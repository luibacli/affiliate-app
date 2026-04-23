<script setup lang="ts">
useHead({
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: Inter, 'Segoe UI', system-ui, -apple-system, sans-serif; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
