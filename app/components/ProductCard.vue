<script setup lang="ts">
import { formatPrice } from '~/composables/usePrice'

const imgFailed = ref(false)

const props = defineProps<{
  product: {
    _id: string
    title: string
    price: number
    originalPrice?: number
    currency?: string
    slug?: string
    imageUrl?: string
    source?: string
    rating?: number
    discountPct?: number
    category?: string
    lastPriceDrop?: string | Date | null
    lowestPrice30d?: number | null
  }
  trafficSource?: string
  label?: string
}>()

const currency = computed(() => props.product.currency ?? 'USD')
const isLowestPrice = computed(() =>
  props.product.lowestPrice30d != null &&
  props.product.price <= props.product.lowestPrice30d
)

const isPriceDrop = computed(() => {
  if (!props.product.lastPriceDrop) return false
  const dropped = new Date(props.product.lastPriceDrop)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return dropped >= sevenDaysAgo
})

const discount = computed(() => {
  if (props.product.discountPct) return Math.round(props.product.discountPct * 100)
  if (props.product.originalPrice && props.product.price && props.product.originalPrice > props.product.price) {
    return Math.round(((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100)
  }
  return 0
})

const dealUrl = computed(
  () => `/api/click?product_id=${props.product._id}&source=${props.trafficSource ?? 'unknown'}`
)

const LABEL_STYLES: Record<string, string> = {
  'Best Value': 'bg-accent-500 text-white',
  'Top Rated': 'bg-yellow-400 text-yellow-900',
  'Budget Pick': 'bg-green-500 text-white',
  'Trending': 'bg-pink-500 text-white',
  'Featured': 'bg-primary-600 text-white',
  'Best Deal': 'bg-red-500 text-white',
}

const LABEL_ICON: Record<string, string> = {
  'Best Value': '🔥',
  'Top Rated': '⭐',
  'Budget Pick': '💸',
  'Trending': '📈',
  'Featured': '✨',
  'Best Deal': '🏷️',
}

const SOURCE_COLORS: Record<string, string> = {
  Shopee: 'bg-orange-100 text-orange-700',
  Lazada: 'bg-blue-100 text-blue-700',
  Amazon: 'bg-yellow-100 text-yellow-800',
}
</script>

<template>
  <div class="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-gray-100 hover:border-primary-200 h-full">

    <!-- Badges row -->
    <div class="absolute top-2 left-2 right-2 z-10 flex items-start justify-between gap-1">
      <span
        v-if="label"
        :class="LABEL_STYLES[label] ?? 'bg-primary-600 text-white'"
        class="text-xs font-semibold px-2 py-0.5 rounded-full shadow"
      >
        {{ LABEL_ICON[label] ?? '' }} {{ label }}
      </span>
      <span v-else class="flex-1" />
      <div class="flex flex-col items-end gap-0.5">
        <span
          v-if="isPriceDrop"
          class="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full shadow"
        >
          🔻 Price Drop
        </span>
        <span
          v-if="discount > 0"
          class="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shadow"
        >
          -{{ discount }}%
        </span>
      </div>
    </div>

    <!-- Image (aspect-ratio container prevents CLS) -->
    <NuxtLink :to="product.slug ? `/products/${product.slug}` : '#'" class="block overflow-hidden bg-gray-50">
      <div class="aspect-[4/3] w-full relative overflow-hidden">
        <img
          v-if="product.imageUrl && !imgFailed"
          :src="product.imageUrl"
          :alt="product.title"
          width="300"
          height="225"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          @error="imgFailed = true"
        />
        <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50 text-gray-300">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span class="text-[10px] font-medium uppercase tracking-wide text-gray-300">No image</span>
        </div>
      </div>
    </NuxtLink>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-3 gap-2">

      <!-- Source tag -->
      <span
        v-if="product.source"
        :class="SOURCE_COLORS[product.source] ?? 'bg-gray-100 text-gray-600'"
        class="self-start text-xs font-medium px-2 py-0.5 rounded-full"
      >
        {{ product.source }}
      </span>

      <!-- Title -->
      <NuxtLink :to="product.slug ? `/products/${product.slug}` : '#'">
        <h3 class="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-primary-600 transition-colors">
          {{ product.title }}
        </h3>
      </NuxtLink>

      <!-- Rating -->
      <div v-if="product.rating && product.rating > 0" class="flex items-center gap-1">
        <div class="flex">
          <span
            v-for="i in 5"
            :key="i"
            :class="i <= Math.round(product.rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'"
            class="text-sm"
          >★</span>
        </div>
        <span class="text-xs text-gray-500">{{ (product.rating ?? 0).toFixed(1) }}</span>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Pricing -->
      <div class="space-y-1">
        <div class="flex items-baseline gap-2 flex-wrap">
          <span class="text-lg font-black text-primary-600">{{ formatPrice(product.price, currency) }}</span>
          <span
            v-if="product.originalPrice && product.originalPrice > product.price"
            class="text-sm text-gray-400 line-through"
          >
            {{ formatPrice(product.originalPrice, currency) }}
          </span>
        </div>
        <!-- Savings amount -->
        <div
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-xs font-bold text-emerald-600"
        >
          Save {{ formatPrice(product.originalPrice - product.price, currency) }}
        </div>
        <!-- Lowest price badge -->
        <div v-if="isLowestPrice" class="text-xs font-bold text-emerald-600 flex items-center gap-1">
          🏷️ Lowest in 30 days
        </div>
      </div>

      <!-- CTA -->
      <a
        :href="dealUrl"
        target="_blank"
        rel="noopener noreferrer sponsored"
        class="mt-2 w-full text-center text-sm font-bold text-white bg-accent-500 hover:bg-accent-600 active:scale-[0.97] transition-all duration-150 py-2.5 rounded-xl shadow-sm hover:shadow-md"
        @click.stop
      >
        Check Price 🔥
      </a>
    </div>
  </div>
</template>
