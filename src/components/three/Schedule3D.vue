<script setup lang="ts">
/**
 * Tableau d'amortissement en 3D : chaque échéance est une colonne,
 * capital remboursé (sarcelle) en bas, intérêts (corail) au-dessus,
 * et en arrière-plan le capital restant dû (verre bleuté).
 * Glisser pour tourner, molette / pincer pour zoomer, survoler une colonne pour lire les montants.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { LoanSchedule } from '@/services/loan'
import { cssVar } from '@/composables/useChart'
import { formatAmount } from '@/utils/format'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{ schedule: LoanSchedule; label: (period: number) => string }>()
const host = ref<HTMLDivElement | null>(null)
const tip = ref<{ x: number; y: number; html: string } | null>(null)
const failed = ref(false)
const settings = useSettingsStore()
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let controls: OrbitControls | null = null
let content: THREE.Group | null = null
let frame = 0
let ro: ResizeObserver | null = null
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let pickables: THREE.Mesh[] = []
let needsRender = true

interface Col { label: string; principal: number; interest: number; payment: number; start: number; end: number }

/** Au-delà de 60 échéances, on regroupe par année pour rester lisible. */
function columns(s: LoanSchedule): Col[] {
  const k = s.params.periodsPerYear ?? 1
  if (s.rows.length <= 60 || k === 1) return s.rows.map((r) => ({ label: props.label(r.period), principal: r.principal, interest: r.interest, payment: r.payment, start: r.startBalance, end: r.endBalance }))
  const out: Col[] = []
  for (let y = 0; y < s.params.years; y++) {
    const rows = s.rows.slice(y * k, (y + 1) * k)
    out.push({
      label: `Année ${y + 1}`,
      principal: rows.reduce((a, r) => a + r.principal, 0),
      interest: rows.reduce((a, r) => a + r.interest, 0),
      payment: rows.reduce((a, r) => a + r.payment, 0),
      start: rows[0].startBalance,
      end: rows[rows.length - 1].endBalance,
    })
  }
  return out
}

function disposeGroup(g: THREE.Object3D) {
  g.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.geometry) m.geometry.dispose()
    const mt = m.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(mt)) mt.forEach((x) => x.dispose())
    else mt?.dispose()
  })
}

function buildContent() {
  if (content) {
    scene.remove(content)
    disposeGroup(content)
  }
  content = new THREE.Group()
  pickables = []
  const cols = columns(props.schedule)
  const n = cols.length
  const maxPay = Math.max(...cols.map((c) => c.payment))
  const maxStart = Math.max(...cols.map((c) => c.start))
  const width = Math.min(14, Math.max(7, n * 0.7))
  const step = width / n
  const bw = Math.max(0.08, step * 0.62)
  const H = 4.2
  const capMat = new THREE.MeshStandardMaterial({ color: cssVar('--capital'), roughness: 0.45 })
  const intMat = new THREE.MeshStandardMaterial({ color: cssVar('--interest'), roughness: 0.45 })
  const crdMat = new THREE.MeshStandardMaterial({ color: settings.isDark ? '#7aa7ff' : '#2f6fdd', transparent: true, opacity: 0.16, roughness: 0.2 })
  cols.forEach((c, i) => {
    const x = -width / 2 + step * (i + 0.5)
    const hp = (c.principal / maxPay) * H * 0.6
    const hi = (c.interest / maxPay) * H * 0.6
    const hc = (c.start / maxStart) * H
    const crd = new THREE.Mesh(new THREE.BoxGeometry(bw, Math.max(0.001, hc), bw), crdMat)
    crd.position.set(x, hc / 2, -1.2)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(bw, Math.max(0.001, hp), bw), capMat)
    cap.position.set(x, hp / 2, 0)
    const int = new THREE.Mesh(new THREE.BoxGeometry(bw, Math.max(0.001, hi), bw), intMat)
    int.position.set(x, hp + hi / 2 + 0.005, 0)
    for (const m of [crd, cap, int]) {
      m.userData = c
      pickables.push(m)
    }
    if (!reduced) {
      // Animation d'entrée : les colonnes poussent depuis le sol
      for (const m of [cap, int, crd]) {
        const target = m.position.y
        m.scale.y = 0.001
        m.position.y = 0
        m.userData = { ...c, grow: { target, delay: i * 0.02 } }
      }
    }
    content!.add(crd, cap, int)
  })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(width + 2, 4), new THREE.MeshStandardMaterial({ color: settings.isDark ? '#14213a' : '#ffffff', roughness: 1 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, -0.001, -0.6)
  content.add(floor)
  const grid = new THREE.GridHelper(width + 2, Math.round(width + 2), settings.isDark ? 0x2a3b5c : 0xd6ddd6, settings.isDark ? 0x2a3b5c : 0xd6ddd6)
  grid.position.set(0, 0.002, -0.6)
  grid.scale.z = 4 / (width + 2)
  content.add(grid)
  scene.add(content)
  if (!framed) {
    framed = true
    camera.position.set(width * 0.45, 4.6, width * 0.75 + 3.5)
    controls?.target.set(0, 1.4, -0.4)
  }
  growStart = performance.now()
  needsRender = true
}

let growStart = 0
let framed = false
function animateGrow(now: number) {
  if (!content || reduced) return false
  let active = false
  const t = (now - growStart) / 1000
  for (const m of pickables) {
    const g = (m.userData as { grow?: { target: number; delay: number } }).grow
    if (!g) continue
    const p = Math.min(1, Math.max(0, (t - g.delay) / 0.6))
    const e = 1 - Math.pow(1 - p, 3)
    m.scale.y = Math.max(0.001, e)
    m.position.y = g.target * e
    if (p < 1) active = true
  }
  return active
}

function resize() {
  if (!renderer || !host.value) return
  const w = host.value.clientWidth
  const h = host.value.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / Math.max(1, h)
  camera.updateProjectionMatrix()
  needsRender = true
}

function loop(now: number) {
  frame = requestAnimationFrame(loop)
  if (!renderer) return
  const growing = animateGrow(now)
  const moved = controls?.update() ?? false
  if (needsRender || growing || moved) {
    renderer.render(scene, camera)
    needsRender = false
  }
}

function onMove(e: PointerEvent) {
  if (!renderer || !host.value) return
  const r = host.value.getBoundingClientRect()
  mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1
  mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const hit = raycaster.intersectObjects(pickables, false)[0]
  if (hit) {
    const c = hit.object.userData as Col
    tip.value = {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      html: `<strong>${c.label}</strong><br>Capital restant dû : ${formatAmount(c.start)} €<br><span style="color:var(--interest)">Intérêts : ${formatAmount(c.interest)} €</span><br><span style="color:var(--capital)">Amortissement : ${formatAmount(c.principal)} €</span><br>Paiement : ${formatAmount(c.payment)} €`,
    }
  } else tip.value = null
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
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.touchAction = 'none'
  host.value.appendChild(renderer.domElement)
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200)
  camera.position.set(5.5, 5, 10)
  scene.add(new THREE.AmbientLight(0xffffff, 0.85))
  const d = new THREE.DirectionalLight(0xffffff, 1.5)
  d.position.set(4, 9, 7)
  scene.add(d)
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1.4, -0.4)
  controls.enableDamping = !reduced
  controls.minDistance = 5
  controls.maxDistance = 26
  controls.maxPolarAngle = Math.PI / 2.05
  controls.addEventListener('change', () => (needsRender = true))
  buildContent()
  resize()
  ro = new ResizeObserver(resize)
  ro.observe(host.value)
  renderer.domElement.addEventListener('pointermove', onMove)
  renderer.domElement.addEventListener('pointerleave', () => (tip.value = null))
  frame = requestAnimationFrame(loop)
}

function dispose() {
  cancelAnimationFrame(frame)
  ro?.disconnect()
  controls?.dispose()
  if (content) disposeGroup(content)
  renderer?.dispose()
  renderer?.domElement.remove()
  renderer = null
}

function resetView() {
  framed = false
  if (renderer) buildContent()
}

onMounted(init)
onBeforeUnmount(dispose)
watch(() => props.schedule, () => renderer && buildContent())
watch(() => settings.isDark, () => setTimeout(() => renderer && buildContent(), 320))
defineExpose({ resetView })
</script>

<template>
  <div class="relative">
    <div ref="host" class="h-[22rem] w-full cursor-grab overflow-hidden rounded-2xl bg-surface-2/50 active:cursor-grabbing sm:h-[26rem]" role="img" aria-label="Tableau d’amortissement en 3D : une colonne par échéance, capital et intérêts empilés, capital restant dû en arrière-plan" />
    <div v-if="tip" class="pointer-events-none absolute z-10 rounded-xl border border-line bg-surface px-3 py-2 text-xs leading-relaxed shadow-lg" :style="{ left: Math.min(tip.x + 14, (host?.clientWidth ?? 300) - 190) + 'px', top: Math.max(tip.y - 90, 4) + 'px' }" v-html="tip.html" />
    <div v-if="failed" class="absolute inset-0 grid place-items-center text-sm text-muted">La 3D n’est pas disponible sur cet appareil.</div>
    <div class="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
      <span class="flex flex-wrap gap-x-4 gap-y-1">
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-capital" />Amortissement</span>
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-interest" />Intérêts</span>
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-sm bg-focus/30" />Capital restant dû</span>
      </span>
      <span>Glisse pour tourner, molette ou pincement pour zoomer, survole une colonne.</span>
    </div>
  </div>
</template>
