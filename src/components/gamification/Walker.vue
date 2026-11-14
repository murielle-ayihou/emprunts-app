<script setup lang="ts">
/**
 * Personnage étudiant (sac à dos) dessiné en SVG, avec trois états :
 * « walk » (cycle de marche), « idle » (respiration), « cheer » (bras levés, saut).
 */
withDefaults(defineProps<{ state?: 'walk' | 'idle' | 'cheer'; size?: number; tone?: 'light' | 'dark' }>(), { state: 'idle', size: 44, tone: 'light' })
</script>

<template>
  <svg class="walker max-w-none" :class="[state, tone]" :width="size" :height="size * 1.25" viewBox="0 0 40 50" aria-hidden="true">
    <ellipse class="shadow" cx="20" cy="48.2" rx="9" ry="1.6" />
    <g class="body">
      <!-- jambe arrière -->
      <g class="leg leg-b"><rect x="17.4" y="31" width="4.2" height="12" rx="2.1" class="pants-dark" /><rect x="16.6" y="41.4" width="6.2" height="3" rx="1.5" class="shoe" /></g>
      <!-- bras arrière -->
      <g class="arm arm-b"><rect x="18.5" y="19.5" width="3.6" height="11" rx="1.8" class="skin-dark" /></g>
      <!-- sac à dos -->
      <rect x="9.6" y="18" width="7" height="11" rx="2.6" class="bag" />
      <!-- torse -->
      <rect x="13.5" y="17" width="12" height="16" rx="5" class="jacket" />
      <rect x="18.8" y="19" width="1.4" height="12" rx="0.7" class="zip" />
      <!-- tête -->
      <g class="head">
        <circle cx="20" cy="10.5" r="6.4" class="skin" />
        <path d="M13.8 9.8c0-4.2 3-6.8 6.6-6.8 3.4 0 6.2 2.4 6.2 5.4-1.8-.4-3.8-1.4-5-2.8-1.6 2-4.6 3.4-7.8 4.2z" class="hair" />
        <circle cx="23.3" cy="11" r="0.9" class="eye" />
        <path d="M22.6 13.9c.8.5 1.8.5 2.5-.1" class="mouth" />
      </g>
      <!-- jambe avant -->
      <g class="leg leg-f"><rect x="17.8" y="31" width="4.2" height="12" rx="2.1" class="pants" /><rect x="17" y="41.4" width="6.2" height="3" rx="1.5" class="shoe" /></g>
      <!-- bras avant -->
      <g class="arm arm-f"><rect x="18" y="19.5" width="3.6" height="11" rx="1.8" class="skin" /><circle cx="19.8" cy="30" r="1.9" class="skin" /></g>
    </g>
  </svg>
</template>

<style scoped>
.walker { overflow: visible; display: block; max-width: none; flex: none; }
.skin { fill: #b8724a; }
.skin-dark { fill: #9a5c3a; }
.hair { fill: #241a14; }
.eye { fill: #1b1b1b; }
.mouth { fill: none; stroke: #5b2e1c; stroke-width: 0.9; stroke-linecap: round; }
.jacket { fill: var(--capital); }
.zip { fill: color-mix(in oklab, var(--capital) 60%, #fff); }
.bag { fill: var(--brass-bright); }
.pants { fill: #23365c; }
.pants-dark { fill: #1a2948; }
.shoe { fill: #f3f5f2; stroke: #1a2948; stroke-width: 0.6; }
.shadow { fill: rgba(20, 40, 75, 0.18); }
.walker.dark { filter: drop-shadow(0 0 1.2px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 6px rgba(233, 162, 59, 0.35)); }
.dark .pants, .dark .pants-dark { fill: #c2cee2; }
.dark .shoe { stroke: #c2cee2; fill: #14213a; }

.leg { transform-origin: 20px 32px; }
.arm { transform-origin: 20px 20.5px; }
.body { transform-origin: 20px 48px; }

.walk .leg-f { animation: swing 0.62s ease-in-out infinite; }
.walk .leg-b { animation: swing 0.62s ease-in-out infinite reverse; }
.walk .arm-f { animation: swing-arm 0.62s ease-in-out infinite reverse; }
.walk .arm-b { animation: swing-arm 0.62s ease-in-out infinite; }
.walk .body { animation: bob 0.31s ease-in-out infinite alternate; }
.walk .shadow { animation: shade 0.31s ease-in-out infinite alternate; }

.idle .body { animation: breathe 2.6s ease-in-out infinite; }
.idle .head { transform-origin: 20px 16px; animation: look 5s ease-in-out infinite; }

.cheer .body { animation: jump 0.9s cubic-bezier(0.3, 0, 0.3, 1) infinite; }
.cheer .arm-f { transform: rotate(170deg); }
.cheer .arm-b { transform: rotate(-160deg); }
.cheer .shadow { animation: shade-jump 0.9s cubic-bezier(0.3, 0, 0.3, 1) infinite; }

@keyframes swing { 0%, 100% { transform: rotate(26deg); } 50% { transform: rotate(-26deg); } }
@keyframes swing-arm { 0%, 100% { transform: rotate(30deg); } 50% { transform: rotate(-30deg); } }
@keyframes bob { from { transform: translateY(0); } to { transform: translateY(-1.4px); } }
@keyframes shade { from { transform: scaleX(1); transform-origin: 20px 48px; } to { transform: scaleX(0.85); transform-origin: 20px 48px; } }
@keyframes breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.018); } }
@keyframes look { 0%, 70%, 100% { transform: rotate(0); } 78%, 90% { transform: rotate(-6deg); } }
@keyframes jump { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-9px); } 60% { transform: translateY(-9px); } }
@keyframes shade-jump { 0%, 100% { transform: scaleX(1); opacity: 1; transform-origin: 20px 48px; } 50% { transform: scaleX(0.6); opacity: 0.5; transform-origin: 20px 48px; } }
@media (prefers-reduced-motion: reduce) {
  .walker * { animation: none !important; }
}
</style>
