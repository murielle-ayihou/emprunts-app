<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ value: number; size?: number; stroke?: number; color?: string; track?: string; label?: string }>(),
  { size: 64, stroke: 7, color: 'var(--capital)', track: 'var(--surface-2)' },
)
const r = computed(() => (props.size - props.stroke) / 2)
const c = computed(() => 2 * Math.PI * r.value)
const offset = computed(() => c.value * (1 - Math.max(0, Math.min(1, props.value))))
</script>

<template>
  <div class="relative inline-grid place-items-center" :style="{ width: size + 'px', height: size + 'px' }" role="img" :aria-label="label ?? `${Math.round(value * 100)} %`">
    <svg :width="size" :height="size" class="-rotate-90">
      <circle :cx="size / 2" :cy="size / 2" :r="r" fill="none" :stroke="track" :stroke-width="stroke" />
      <circle
        :cx="size / 2" :cy="size / 2" :r="r" fill="none" :stroke="color" :stroke-width="stroke" stroke-linecap="round"
        :stroke-dasharray="c" :stroke-dashoffset="offset" style="transition: stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1)"
      />
    </svg>
    <div class="absolute inset-0 grid place-items-center"><slot /></div>
  </div>
</template>
