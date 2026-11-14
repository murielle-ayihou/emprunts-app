<template>
  <span class="flex items-center gap-2.5">
    <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true" class="logo">
      <rect class="bg" width="64" height="64" rx="16" />
      <path d="M44.5 21.5 A15 15 0 1 0 44.5 42.5" fill="none" stroke="var(--brass-bright)" stroke-width="7" stroke-linecap="round" />
      <circle cx="46" cy="32" r="4.2" fill="var(--capital-soft)" />
    </svg>
    <span class="font-display text-[1.35rem] font-bold tracking-tight text-ink">Cursus</span>
  </span>
</template>
<style scoped>
.bg { fill: var(--ink); }
:global(.dark) .logo .bg { fill: #24365a; }
</style>
