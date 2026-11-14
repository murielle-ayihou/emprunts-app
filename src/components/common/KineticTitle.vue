<script setup lang="ts">
/**
 * Titre cinétique : chaque lettre réagit à la souris ou au doigt.
 *  - À l'arrivée, les lettres se déploient (largeur et graisse) l'une après l'autre.
 *  - Près du pointeur, les lettres s'élargissent et s'épaississent (police variable Archivo).
 *  - En glissant le doigt ou la souris (clic maintenu) sur le titre, il bascule en 3D avec un relief.
 * Avec « réduire les animations », le titre reste statique.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ text: string; tag?: string; size?: 'xl' | 'lg' }>(), { tag: 'h1', size: 'xl' })

const root = ref<HTMLElement | null>(null)
const letters = ref<HTMLElement[]>([])
const tilt = ref({ x: 0, y: 0 })
const dragging = ref(false)
const ready = ref(false)
const settled = ref(false)
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const words = computed(() => props.text.split(' ').map((w) => [...w]))
const indexOf = (wi: number, li: number) => words.value.slice(0, wi).reduce((s, w) => s + w.length, 0) + li

const BASE = { wdth: 108, wght: 780 }
const PEAK = { wdth: 125, wght: 950 }
let raf = 0
let px = -9999
let py = -9999
let centers: { x: number; y: number }[] = []

function measure() {
  centers = letters.value.map((el) => {
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  })
}

function paint() {
  raf = 0
  const radius = 140
  letters.value.forEach((el, i) => {
    const c = centers[i]
    if (!c) return
    const d = Math.hypot(px - c.x, py - c.y)
    const k = Math.max(0, 1 - d / radius)
    const e = k * k * (3 - 2 * k)
    const wdth = BASE.wdth + (PEAK.wdth - BASE.wdth) * e
    const wght = BASE.wght + (PEAK.wght - BASE.wght) * e
    el.style.fontVariationSettings = `'wdth' ${wdth.toFixed(1)}, 'wght' ${wght.toFixed(0)}`
    el.style.transform = `translateY(${(-e * 0.06).toFixed(3)}em)`
    el.style.color = e > 0.55 ? 'var(--brass)' : ''
  })
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(paint)
}

function onMove(e: PointerEvent) {
  px = e.clientX
  py = e.clientY
  if (dragging.value && root.value) {
    const r = root.value.getBoundingClientRect()
    tilt.value = {
      x: Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.5))) * -18,
      y: Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2))) * 22,
    }
  }
  schedule()
}
function onLeave() {
  px = py = -9999
  schedule()
}
function onDown(e: PointerEvent) {
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  measure()
  onMove(e)
}
function onUp() {
  dragging.value = false
  tilt.value = { x: 0, y: 0 }
  if (matchMedia('(pointer: coarse)').matches) onLeave()
}

onMounted(() => {
  if (reduced) {
    ready.value = true
    return
  }
  requestAnimationFrame(() => {
    ready.value = true
    setTimeout(() => {
      settled.value = true
      measure()
    }, 400 + props.text.length * 22 + 600)
  })
  window.addEventListener('scroll', measure, { passive: true })
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', measure)
  window.removeEventListener('resize', measure)
})

const depth = computed(() => {
  // Relief : ombres empilées dans la direction opposée à l'inclinaison
  const n = dragging.value ? 7 : 0
  if (!n) return 'none'
  const dx = -tilt.value.y / 22
  const dy = tilt.value.x / 18
  return Array.from({ length: n }, (_, i) => `${(dx * (i + 1) * 0.9).toFixed(2)}px ${(dy * (i + 1) * 0.9 + (i + 1) * 0.6).toFixed(2)}px 0 color-mix(in oklab, var(--brass-bright) ${60 - i * 6}%, var(--ink))`).join(', ')
})
</script>

<template>
  <component
    :is="tag"
    ref="root"
    class="kinetic select-none"
    :class="[size === 'xl' ? 'text-[2.6rem] sm:text-[3.6rem]' : 'text-[2.2rem] sm:text-[2.9rem]', { ready, settled, dragging }]"
    :aria-label="text"
    :style="{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, textShadow: depth }"
    @pointermove="reduced ? undefined : onMove($event)"
    @pointerenter="reduced ? undefined : measure()"
    @pointerleave="reduced ? undefined : onLeave()"
    @pointerdown="reduced ? undefined : onDown($event)"
    @pointerup="onUp"
    @pointercancel="onUp"
  >
    <span v-for="(w, wi) in words" :key="wi" class="word" aria-hidden="true"
      ><span
        v-for="(ch, li) in w"
        :key="li"
        :ref="(el) => { if (el) letters[indexOf(wi, li)] = el as HTMLElement }"
        class="ch"
        :style="{ '--i': indexOf(wi, li) }"
        >{{ ch }}</span
      ><span v-if="wi < words.length - 1" class="ch space"> </span></span
    >
  </component>
</template>

<style scoped>
.kinetic {
  font-family: var(--font-display);
  font-weight: 780;
  line-height: 1.02;
  letter-spacing: -0.025em;
  transform-style: preserve-3d;
  transition: transform 450ms cubic-bezier(0.2, 1.3, 0.4, 1), text-shadow 300ms ease;
  touch-action: pan-y;
  cursor: grab;
  -webkit-tap-highlight-color: transparent;
}
.kinetic.dragging {
  transition: transform 80ms linear;
  cursor: grabbing;
}
.word {
  display: inline-block;
  white-space: nowrap;
}
.ch {
  display: inline-block;
  font-variation-settings: 'wdth' 62, 'wght' 300;
  opacity: 0;
  transform: translateY(0.35em);
  transition:
    font-variation-settings 260ms ease,
    transform 260ms ease,
    color 200ms ease;
}
.ch.space {
  width: 0.28em;
}
.ready .ch {
  opacity: 1;
  transform: none;
  font-variation-settings: 'wdth' 108, 'wght' 780;
  transition:
    opacity 380ms ease calc(var(--i) * 22ms),
    transform 560ms cubic-bezier(0.2, 1.4, 0.4, 1) calc(var(--i) * 22ms),
    font-variation-settings 700ms cubic-bezier(0.2, 0.8, 0.2, 1) calc(var(--i) * 22ms),
    color 200ms ease;
}
.settled .ch {
  transition:
    font-variation-settings 220ms ease,
    transform 220ms ease,
    color 200ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .ch {
    opacity: 1;
    transform: none;
    font-variation-settings: 'wdth' 108, 'wght' 780;
  }
}
</style>
