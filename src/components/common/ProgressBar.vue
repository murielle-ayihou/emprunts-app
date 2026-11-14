<script setup lang="ts">
withDefaults(defineProps<{ value: number; color?: string; height?: number; label?: string }>(), { color: 'var(--capital)', height: 8 })
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-full bg-surface-2"
    :style="{ height: height + 'px' }"
    role="progressbar"
    :aria-valuenow="Math.round(value * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label"
  >
    <div class="h-full rounded-full" :style="{ width: Math.max(0, Math.min(1, value)) * 100 + '%', background: color, transition: 'width 600ms cubic-bezier(.2,.8,.2,1)' }" />
  </div>
</template>
