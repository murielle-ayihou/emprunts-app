<script setup lang="ts">
/**
 * Bonhomme 3D sur une ligne.
 *  - mode « scroll » : il marche quand tu fais défiler la page et avance sur la ligne (demi-tour si tu remontes).
 *  - mode « progress » : il marche jusqu'à ta progression réelle dans le cours.
 * Fais-le glisser horizontalement pour le faire tourner sur lui-même ; touche-le pour qu'il saute et salue.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { buildCharacter, pose, type Character } from './character'
import { useSettingsStore } from '@/stores/settings'
import { cssVar } from '@/composables/useChart'
import { playSound } from '@/services/sound'

const props = withDefaults(
  defineProps<{
    mode?: 'scroll' | 'progress'
    progress?: number
    milestones?: { at: number; label: string }[]
    height?: number
    tone?: 'light' | 'dark'
    label?: string
  }>(),
  { mode: 'scroll', progress: 0, milestones: () => [], height: 96, tone: 'light' },
)

const settings = useSettingsStore()
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const host = ref<HTMLDivElement | null>(null)
const wrap = ref<HTMLDivElement | null>(null)
const pos = ref(0)
const failed = ref(false)
const width = computed(() => Math.round(props.height * 0.8))

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let char: Character | null = null
let raf = 0
let visible = true
let io: IntersectionObserver | null = null
let started = false

// État d'animation
let target = 0
let walk = 0
let yaw = 0.25
let userYaw = 0
let facing = 1
let jumpT = -1
let waveT = -1
let last = performance.now()
const t0 = performance.now()

function scrollTarget() {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}
function onScroll() {
  if (props.mode === 'scroll') target = scrollTarget()
}
watch(
  () => props.progress,
  (p) => {
    if (props.mode === 'progress' && started) target = Math.min(1, Math.max(0, p))
  },
)

function build() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(30, width.value / props.height, 0.1, 50)
  camera.position.set(0, 1.3, 6.1)
  camera.lookAt(0, 1.2, 0)
  scene.add(new THREE.HemisphereLight(0xffffff, settings.isDark ? 0x1b2a46 : 0xd6ddd6, 1.4))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(3, 5, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight(new THREE.Color(cssVar('--brass-bright') || '#e9a23b'), 0.8)
  rim.position.set(-4, 3, -3)
  scene.add(rim)
  char = buildCharacter({ jacket: cssVar('--capital') || '#11806f', bag: cssVar('--brass-bright') || '#e9a23b', dark: props.tone === 'dark' || settings.isDark })
  scene.add(char.root)
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshBasicMaterial({ color: 0x14284b, transparent: true, opacity: 0.16 }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.02
  shadow.name = 'shadow'
  scene.add(shadow)
}

function frame(now: number) {
  raf = requestAnimationFrame(frame)
  if (!renderer || !char || !visible) return
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  const t = (now - t0) / 1000

  // Déplacement vers la cible
  const diff = target - pos.value
  const dist = Math.abs(diff)
  if (dist > 0.0005) {
    const speed = props.mode === 'scroll' ? Math.max(0.25, dist * 5) : 0.32
    pos.value += Math.sign(diff) * Math.min(dist, speed * dt)
    facing = Math.sign(diff)
  }
  const moving = dist > 0.002
  walk += ((moving ? 1 : 0) - walk) * Math.min(1, dt * 8)

  // Orientation : profil (trois quarts) quand il marche, face caméra au repos
  const goal = moving ? facing * (Math.PI / 2 - 0.45) : 0.25
  yaw += (goal - yaw) * Math.min(1, dt * 6)
  if (!dragging) userYaw *= Math.pow(0.04, dt)
  char.root.rotation.y = yaw + userYaw

  // Saut et salut
  let jump = 0
  if (jumpT >= 0) {
    const k = (now - jumpT) / 650
    if (k >= 1) jumpT = -1
    else jump = Math.sin(k * Math.PI) * 0.55
  }
  let wave = 0
  if (waveT >= 0) {
    const k = (now - waveT) / 1400
    if (k >= 1) waveT = -1
    else wave = Math.sin(Math.min(1, k * 1.2) * Math.PI)
  }
  pose(char, t, reduced ? 0 : walk, jump, wave)
  const sh = scene.getObjectByName('shadow')
  if (sh) sh.scale.setScalar(1 - jump * 0.6)
  renderer.render(scene, camera)
}

function arrive() {
  // Une petite fête en arrivant au bout du parcours
  if (props.mode === 'progress' && target >= 0.999) {
    setTimeout(() => {
      jumpT = performance.now()
      waveT = performance.now() + 200
    }, 1200)
  }
}

// Interaction : glisser = tourner, toucher = sauter + saluer
let dragging = false
let sx = 0
let moved = false
let baseYaw = 0
function onDown(e: PointerEvent) {
  dragging = true
  moved = false
  sx = e.clientX
  baseYaw = userYaw
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onMove(e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - sx
  if (Math.abs(dx) > 5) moved = true
  userYaw = baseYaw + dx * 0.03
}
function onUp() {
  if (!dragging) return
  dragging = false
  if (!moved) {
    jumpT = performance.now()
    waveT = performance.now()
    playSound('progress')
  }
}

function init() {
  if (!host.value) return
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    failed.value = true
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width.value, props.height, false)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  host.value.appendChild(renderer.domElement)
  build()
  io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible && !started) {
      started = true
      target = props.mode === 'scroll' ? scrollTarget() : Math.min(1, Math.max(0, props.progress))
      if (reduced) pos.value = target
      arrive()
    }
  })
  io.observe(wrap.value ?? host.value)
  window.addEventListener('scroll', onScroll, { passive: true })
  last = performance.now()
  raf = requestAnimationFrame(frame)
}

function dispose() {
  cancelAnimationFrame(raf)
  io?.disconnect()
  window.removeEventListener('scroll', onScroll)
  char?.dispose()
  scene?.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (mesh.isMesh && mesh.name === 'shadow') {
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
    }
  })
  renderer?.dispose()
  renderer?.domElement.remove()
  renderer = null
  char = null
}

onMounted(init)
onBeforeUnmount(dispose)
watch(
  () => settings.isDark,
  () =>
    setTimeout(() => {
      if (!renderer || !char) return
      scene.remove(char.root)
      char.dispose()
      char = buildCharacter({ jacket: cssVar('--capital'), bag: cssVar('--brass-bright'), dark: props.tone === 'dark' || settings.isDark })
      scene.add(char.root)
    }, 320),
)
</script>

<template>
  <div ref="wrap" class="walker3d" :class="tone" role="img" :aria-label="label ?? (mode === 'scroll' ? 'Bonhomme en 3D qui avance quand tu fais défiler la page' : `Bonhomme en 3D à ${Math.round(progress * 100)} % du parcours`)">
    <div class="relative" :style="{ height: height + 10 + 'px', marginInline: width / 2 + 'px' }">
      <div class="absolute inset-x-0 bottom-[5px] h-[5px] rounded-full track" />
      <div class="absolute bottom-[5px] left-0 h-[5px] rounded-full fill" :style="{ width: pos * 100 + '%' }" />
      <span v-for="m in milestones" :key="m.label" class="absolute bottom-0 -translate-x-1/2" :style="{ left: m.at * 100 + '%' }">
        <span class="block h-4 w-4 rounded-full border-[3px] dot" :class="{ reached: pos >= m.at - 0.001 }" />
      </span>
      <svg class="absolute bottom-[8px] right-0 translate-x-1/2" width="18" height="26" viewBox="0 0 18 26" aria-hidden="true">
        <rect x="2" y="2" width="2" height="24" rx="1" class="pole" />
        <path d="M4 3h12l-3 4 3 4H4z" class="flag" :class="{ won: pos >= 0.999 }" />
      </svg>
      <div
        ref="host"
        class="absolute -translate-x-1/2 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        :style="{ left: pos * 100 + '%', width: width + 'px', height: height + 'px', bottom: 4 - height * 0.07 + 'px' }"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
      />
      <div v-if="failed" class="absolute inset-0 grid place-items-center text-xs text-muted">La 3D n’est pas disponible sur cet appareil.</div>
    </div>
    <div v-if="milestones.length" class="relative mt-1 h-4" :style="{ marginInline: width / 2 + 'px' }">
      <span v-for="m in milestones" :key="m.label" class="absolute -translate-x-1/2 whitespace-nowrap text-[0.7rem] font-semibold opacity-70" :style="{ left: m.at * 100 + '%' }">{{ m.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.track { background: repeating-linear-gradient(90deg, var(--line) 0 10px, transparent 10px 16px); }
.dark .track { background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.22) 0 10px, transparent 10px 16px); }
.fill { background: linear-gradient(90deg, var(--capital), var(--brass-bright)); }
.dot { border-color: var(--line); background: var(--surface); transition: border-color 300ms, transform 300ms; }
.dot.reached { border-color: var(--brass-bright); transform: scale(1.15); }
.pole { fill: var(--muted); }
.flag { fill: var(--line); transition: fill 400ms; }
.flag.won { fill: var(--brass-bright); }
</style>
