<script setup lang="ts">
/**
 * Sentier de progression : le personnage marche jusqu'à ta position réelle dans le cours.
 * Touche-le : il saute. Fais-le glisser : il revient à sa place en marchant.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Walker from './Walker.vue'
import { playSound } from '@/services/sound'

const props = withDefaults(
  defineProps<{ progress: number; milestones?: { at: number; label: string }[]; size?: number; tone?: 'light' | 'dark'; label?: string }>(),
  { milestones: () => [], size: 34, tone: 'light' },
)

const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const pos = ref(reduced ? props.progress : 0)
const walking = ref(false)
const cheering = ref(false)
const dragging = ref(false)
const facing = ref(1)
const track = ref<HTMLElement | null>(null)
let walkTimer: number | undefined
let raf = 0

const target = computed(() => Math.max(0, Math.min(1, props.progress)))
const state = computed(() => (cheering.value || (!walking.value && target.value >= 1 && !dragging.value) ? 'cheer' : walking.value || dragging.value ? 'walk' : 'idle'))

/** Marche à vitesse constante jusqu'à la cible. */
function walkTo(to: number) {
  cancelAnimationFrame(raf)
  if (reduced) {
    pos.value = to
    return
  }
  const from = pos.value
  const dist = Math.abs(to - from)
  if (dist < 0.002) {
    walking.value = false
    return
  }
  facing.value = to >= from ? 1 : -1
  walking.value = true
  const dur = 500 + dist * 2600
  const t0 = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / dur)
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    pos.value = from + (to - from) * e
    if (t < 1) raf = requestAnimationFrame(step)
    else {
      walking.value = false
      facing.value = 1
    }
  }
  raf = requestAnimationFrame(step)
}

let io: IntersectionObserver | null = null
onMounted(() => {
  if (!track.value) return
  io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      walkTimer = window.setTimeout(() => walkTo(target.value), 250)
      io?.disconnect()
    }
  })
  io.observe(track.value)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(walkTimer)
  io?.disconnect()
})
watch(target, (t) => walkTo(t))

function hop() {
  if (dragging.value) return
  cheering.value = true
  playSound('progress')
  setTimeout(() => (cheering.value = false), 900)
}

// Glisser le personnage le long du sentier
let startX = 0
let moved = false
function onDown(e: PointerEvent) {
  cancelAnimationFrame(raf)
  dragging.value = true
  moved = false
  startX = e.clientX
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onMove(e: PointerEvent) {
  if (!dragging.value || !track.value) return
  if (Math.abs(e.clientX - startX) > 4) moved = true
  const r = track.value.getBoundingClientRect()
  const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
  facing.value = p >= pos.value ? 1 : -1
  pos.value = p
}
function onUp() {
  if (!dragging.value) return
  dragging.value = false
  if (!moved) hop()
  else setTimeout(() => walkTo(target.value), 300)
}
</script>

<template>
  <div class="trail" :class="tone" role="img" :aria-label="label ?? `Progression : ${Math.round(target * 100)} %`">
    <div ref="track" class="relative mx-[calc(var(--w)/2)] h-[calc(var(--w)*1.25+14px)]" :style="{ '--w': size + 'px' }">
      <!-- sentier -->
      <div class="absolute inset-x-0 bottom-[6px] h-[6px] rounded-full path" />
      <div class="absolute bottom-[6px] left-0 h-[6px] rounded-full fill" :style="{ width: pos * 100 + '%' }" />
      <!-- jalons -->
      <span v-for="m in milestones" :key="m.label" class="absolute bottom-[1px] -translate-x-1/2 text-center" :style="{ left: m.at * 100 + '%' }">
        <span class="mx-auto block h-4 w-4 rounded-full border-[3px] dot" :class="{ reached: target >= m.at - 0.001 }" />
      </span>
      <!-- arrivée -->
      <svg class="absolute bottom-[10px] right-0 translate-x-1/2" width="18" height="26" viewBox="0 0 18 26" aria-hidden="true">
        <rect x="2" y="2" width="2" height="24" rx="1" class="pole" />
        <path d="M4 3h12l-3 4 3 4H4z" class="flag" :class="{ won: target >= 1 }" />
      </svg>
      <!-- personnage -->
      <button
        type="button"
        class="walker-btn absolute bottom-[8px] w-max -translate-x-1/2 touch-none"
        :style="{ left: pos * 100 + '%' }"
        :aria-label="`Ton personnage, à ${Math.round(target * 100)} % du parcours. Touche-le pour le faire sauter.`"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
      >
        <span class="block" :style="{ transform: `scaleX(${facing})` }"><Walker :state="state" :size="size" :tone="tone" /></span>
      </button>
    </div>
    <div v-if="milestones.length" class="relative mx-[calc(var(--w)/2)] mt-1 h-4" :style="{ '--w': size + 'px' }">
      <span v-for="m in milestones" :key="m.label" class="absolute -translate-x-1/2 whitespace-nowrap text-[0.7rem] font-semibold opacity-70" :style="{ left: m.at * 100 + '%' }">{{ m.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.path { background: repeating-linear-gradient(90deg, var(--line) 0 10px, transparent 10px 16px); }
.dark .path { background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.22) 0 10px, transparent 10px 16px); }
.fill { background: linear-gradient(90deg, var(--capital), var(--brass-bright)); }
.dot { border-color: var(--line); background: var(--surface); transition: border-color 300ms, transform 300ms; }
.dot.reached { border-color: var(--brass-bright); transform: scale(1.15); }
.dark .dot { background: transparent; border-color: rgba(255, 255, 255, 0.3); }
.dark .dot.reached { border-color: var(--brass-bright); }
.pole { fill: var(--muted); }
.flag { fill: var(--line); transition: fill 400ms; }
.flag.won { fill: var(--brass-bright); }
.walker-btn { cursor: grab; -webkit-tap-highlight-color: transparent; }
.walker-btn:active { cursor: grabbing; }
</style>
