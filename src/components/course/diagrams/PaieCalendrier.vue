<template>
  <figure class="rounded-[20px] bg-surface-2/60 p-5 sm:p-6" aria-label="Calendrier de la paie (diapositive 88)">
    <div class="relative pt-6">
      <div class="grid grid-cols-2 text-center text-sm font-semibold"><span>Mois M</span><span>Mois M+1</span></div>
      <div class="relative mt-3 h-2 rounded-full bg-ink/80"><span class="absolute left-1/2 top-[-10px] h-7 w-0.5 bg-muted" /></div>
      <div class="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div class="rounded-xl bg-surface p-3"><p class="font-semibold">Fin du mois M</p><p class="text-ink-soft">Enregistrement du salaire et des cotisations sociales</p></div>
        <div class="rounded-xl bg-surface p-3"><p class="font-semibold">Entre le 5 et le 15 de M+1</p><p class="text-ink-soft">Paiement des cotisations aux organismes sociaux</p></div>
        <div class="rounded-xl bg-surface p-3"><p class="font-semibold">Entre le 8 et le 18 de M+1</p><p class="text-ink-soft">Paiement du prélèvement à la source au Trésor Public</p></div>
      </div>
    </div>
    <figcaption class="mt-3 text-xs text-muted">Calendrier de la paie (diapositive 88).</figcaption>
  </figure>
</template>
