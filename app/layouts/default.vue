<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <AppHeader />
    <div class="flex-1">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
