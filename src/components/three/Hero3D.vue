<script setup lang="ts">
/**
 * Scène 3D d'accueil : un « grand livre » en volume.
 * Des colonnes empilées (capital en sarcelle, intérêts en corail) forment un escalier
 * d'amortissement, des pièces en laiton flottent autour. La scène suit le pointeur.
 * Respecte « réduire les animations » (une seule image fixe) et se met en pause hors écran.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { useSettingsStore } from '@/stores/settings'
import { cssVar } from '@/composables/useChart'

const host = ref<HTMLDivElement | null>(null)
const settings = useSettingsStore()
const failed = ref(false)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let group: THREE.Group
let coins: THREE.Mesh[] = []
let frame = 0
let visible = true
let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
const pointer = { x: 0, y: 0 }
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const materials: THREE.MeshStandardMaterial[] = []

function mat(color: string, opts: THREE.MeshStandardMaterialParameters = {}) {
  const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.45, metalness: 0.08, ...opts })
  materials.push(m)
  return m
}

function build() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  camera.position.set(0, 2.4, 13)
  camera.lookAt(0, 0.3, 0)

  scene.add(new THREE.AmbientLight(0xffffff, 0.75))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(5, 8, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(new THREE.Color(cssVar('--brass-bright') || '#e9a23b'), 0.9)
  rim.position.set(-6, 3, -4)
  scene.add(rim)

  group = new THREE.Group()
  scene.add(group)

  // Escalier : les 6 annuités du cours en amortissement constant (capital fixe, intérêts décroissants)
  const rows = [
    [10000, 2400], [10000, 2000], [10000, 1600], [10000, 1200], [10000, 800], [10000, 400],
  ]
  const capMat = mat(cssVar('--capital') || '#11806f')
  const intMat = mat(cssVar('--interest') || '#c93d5f', { emissive: new THREE.Color(cssVar('--interest') || '#c93d5f'), emissiveIntensity: 0.12 })
  const scale = 1 / 3600
  rows.forEach(([p, i], k) => {
    const x = (k - 2.5) * 1.05
    const hp = p * scale
    const hi = i * scale
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.72, hp, 0.72), capMat)
    cap.position.set(x, hp / 2 - 1.2, 0)
    const int = new THREE.Mesh(new THREE.BoxGeometry(0.72, hi, 0.72), intMat)
    int.position.set(x, hp + hi / 2 - 1.2 + 0.02, 0)
    group.add(cap, int)
  })

  // Socle « page de registre »
  const base = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.12, 2.4), mat(settings.isDark ? '#22365c' : '#ffffff', { roughness: 0.9 }))
  base.position.set(0, -1.28, 0)
  group.add(base)
  const lineMat = mat(settings.isDark ? '#2a3b5c' : '#d6ddd6')
  for (let r = 0; r < 5; r++) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.01, 0.025), lineMat)
    l.position.set(0, -1.215, -0.9 + r * 0.45)
    group.add(l)
  }

  // Pièces en laiton
  const coinMat = mat(cssVar('--brass-bright') || '#e9a23b', { metalness: 0.65, roughness: 0.3 })
  const coinGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 40)
  coins = []
  for (let c = 0; c < 7; c++) {
    const coin = new THREE.Mesh(coinGeo, coinMat)
    const a = (c / 7) * Math.PI * 2
    coin.position.set(Math.cos(a) * 4.3, 1 + Math.sin(a * 2) * 0.9, Math.sin(a) * 1.8)
    coin.rotation.set(Math.PI / 2.4, a, 0)
    coin.userData = { a, speed: 0.25 + (c % 3) * 0.07 }
    coins.push(coin)
    group.add(coin)
  }
  group.rotation.set(0.08, -0.35, 0)
}

function resize() {
  if (!renderer || !host.value) return
  const w = host.value.clientWidth
  const h = host.value.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / Math.max(1, h)
  camera.position.z = w < 500 ? 16 : 13
  camera.updateProjectionMatrix()
  if (reduced) renderer.render(scene, camera)
}

const t0 = performance.now()
function loop() {
  frame = requestAnimationFrame(loop)
  if (!visible || !renderer) return
  const t = (performance.now() - t0) / 1000
  group.rotation.y += (-0.35 + pointer.x * 0.5 + Math.sin(t * 0.25) * 0.12 - group.rotation.y) * 0.04
  group.rotation.x += (0.08 + pointer.y * 0.18 - group.rotation.x) * 0.04
  for (const c of coins) {
    const { a, speed } = c.userData as { a: number; speed: number }
    const ang = a + t * speed
    c.position.x = Math.cos(ang) * 4.3
    c.position.z = Math.sin(ang) * 1.8
    c.position.y = 1 + Math.sin(ang * 2 + t * 0.6) * 0.9
    c.rotation.z = t * 1.4 + a
  }
  renderer.render(scene, camera)
}

function onPointer(e: PointerEvent) {
  const r = host.value?.getBoundingClientRect()
  if (!r) return
  pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2
  pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2
}

function dispose() {
  cancelAnimationFrame(frame)
  io?.disconnect()
  ro?.disconnect()
  window.removeEventListener('pointermove', onPointer)
  scene?.traverse((o) => {
    if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose()
  })
  materials.forEach((m) => m.dispose())
  materials.length = 0
  renderer?.dispose()
  renderer?.domElement.remove()
  renderer = null
}

function init() {
  if (!host.value) return
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  } catch {
    failed.value = true
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  host.value.appendChild(renderer.domElement)
  build()
  resize()
  ro = new ResizeObserver(resize)
  ro.observe(host.value)
  if (reduced) {
    renderer.render(scene, camera)
    return
  }
  io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(host.value)
  window.addEventListener('pointermove', onPointer, { passive: true })
  loop()
}

onMounted(init)
onBeforeUnmount(dispose)
watch(
  () => settings.isDark,
  () => setTimeout(() => {
    dispose()
    init()
  }, 320),
)
</script>

<template>
  <div ref="host" class="relative h-full w-full" role="img" aria-label="Illustration en 3D : un escalier d’annuités, capital et intérêts, entouré de pièces">
    <div v-if="failed" class="grid h-full place-items-center text-sm text-muted">La 3D n’est pas disponible sur cet appareil.</div>
  </div>
</template>
