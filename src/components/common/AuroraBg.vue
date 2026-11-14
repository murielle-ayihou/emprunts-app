<script setup lang="ts">
/** Fond lumineux animé (taches floues aux couleurs de l'app) qui suit doucement le pointeur. */
import { onBeforeUnmount, onMounted, ref } from 'vue'
const host = ref<HTMLElement | null>(null)
const p = ref({ x: 0.5, y: 0.4 })
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
function move(e: PointerEvent) {
  const r = host.value?.parentElement?.getBoundingClientRect()
  if (!r) return
  p.value = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
}
onMounted(() => !reduced && window.addEventListener('pointermove', move, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('pointermove', move))
</script>

<template>
  <div ref="host" class="aurora pointer-events-none absolute -inset-x-10 -inset-y-16 -z-10 overflow-hidden" aria-hidden="true">
    <span class="blob b1" :style="{ transform: `translate(${(p.x - 0.5) * 60}px, ${(p.y - 0.5) * 40}px)` }" />
    <span class="blob b2" :style="{ transform: `translate(${(0.5 - p.x) * 80}px, ${(p.y - 0.5) * 60}px)` }" />
    <span class="blob b3" :style="{ transform: `translate(${(p.x - 0.5) * 40}px, ${(0.5 - p.y) * 50}px)` }" />
    <span class="glow" :style="{ left: p.x * 100 + '%', top: p.y * 100 + '%' }" />
  </div>
</template>

<style scoped>
.aurora { mask-image: radial-gradient(80% 70% at 50% 45%, #000 40%, transparent 100%); }
.blob { position: absolute; border-radius: 9999px; filter: blur(60px); opacity: 0.5; transition: transform 1.2s cubic-bezier(.2,.8,.2,1); }
.b1 { width: 380px; height: 380px; left: 4%; top: 6%; background: var(--capital-soft); animation: drift1 16s ease-in-out infinite; }
.b2 { width: 320px; height: 320px; right: 6%; top: 0; background: var(--brass-soft); animation: drift2 19s ease-in-out infinite; }
.b3 { width: 260px; height: 260px; left: 40%; bottom: 0; background: var(--interest-soft); opacity: 0.4; animation: drift1 22s ease-in-out infinite reverse; }
.glow { position: absolute; width: 260px; height: 260px; margin: -130px 0 0 -130px; border-radius: 9999px; background: radial-gradient(circle, color-mix(in oklab, var(--brass-bright) 22%, transparent), transparent 70%); transition: left 300ms ease-out, top 300ms ease-out; }
:global(.dark) .blob { opacity: 0.6; }
@keyframes drift1 { 0%, 100% { translate: 0 0; } 50% { translate: 60px 30px; } }
@keyframes drift2 { 0%, 100% { translate: 0 0; } 50% { translate: -50px 40px; } }
@media (prefers-reduced-motion: reduce) { .blob, .glow { animation: none; transition: none; } }
</style>
