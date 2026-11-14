<template>
  <span class="flex items-center gap-2.5">
    <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="var(--ink)" />
      <rect x="13" y="16" width="8" height="32" rx="3" fill="var(--brass-bright)" />
      <rect x="24" y="23" width="8" height="25" rx="3" fill="var(--brass-bright)" opacity=".85" />
      <rect x="35" y="30" width="8" height="18" rx="3" fill="var(--brass-bright)" opacity=".7" />
      <rect x="46" y="37" width="6" height="11" rx="3" fill="var(--brass-bright)" opacity=".55" />
    </svg>
    <span class="font-display text-[1.35rem] font-bold tracking-tight text-ink">Échéance</span>
  </span>
</template>
<style scoped>
.dark rect:first-child { fill: #24365a; }
</style>
