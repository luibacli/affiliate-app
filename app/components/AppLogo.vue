<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Link target. Pass null to render as plain text (e.g. inside another link). */
    to?: string | null
    size?: 'sm' | 'md' | 'lg'
    /** Tile only, no wordmark — for tight spaces like a collapsed sidebar. */
    markOnly?: boolean
  }>(),
  { to: '/', size: 'md', markOnly: false }
)

/*
 * The gradient id lives in the document's global id namespace, so a hardcoded
 * one would collide the moment the logo renders twice on a page (header +
 * admin bar). Colliding ids make every instance after the first resolve its
 * fill against the wrong <defs>.
 */
const gradientId = `wr-mark-${useId()}`

const NuxtLink = resolveComponent('NuxtLink')

const MARK = { sm: 'w-6 h-6', md: 'w-7 h-7', lg: 'w-9 h-9' } as const
const WORD = { sm: 'text-base', md: 'text-lg sm:text-xl', lg: 'text-2xl' } as const

const markClass = computed(() => MARK[props.size])
const wordClass = computed(() => WORD[props.size])
</script>

<template>
  <component
    :is="to ? NuxtLink : 'span'"
    v-bind="to ? { to } : {}"
    class="inline-flex items-center gap-2 flex-shrink-0"
    :aria-label="markOnly ? 'WinRose' : undefined"
  >
    <svg
      :class="markClass"
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fb923c" />
          <stop offset="1" stop-color="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" :fill="`url(#${gradientId})`" />
      <path
        d="M13 21 L22 45 L32 30 L42 45 L51 16"
        fill="none"
        stroke="#fff"
        stroke-width="8.5"
        stroke-linejoin="miter"
        stroke-miterlimit="6"
      />
    </svg>

    <span
      v-if="!markOnly"
      :class="wordClass"
      class="font-black tracking-tight leading-none"
    >
      <span class="text-white">Win</span><span class="text-accent-400">Rose</span><slot />
    </span>
  </component>
</template>
