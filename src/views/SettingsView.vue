<script setup lang="ts">
import KineticTitle from '@/components/common/KineticTitle.vue'
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useProgressStore } from '@/stores/progress'
import { useUiStore } from '@/stores/ui'
import { buildExport, parseImport, type ExportFile } from '@/services/storage'
import { playSound } from '@/services/sound'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { ThemePref } from '@/types'
import { Sun, Moon, Monitor, Download, Upload, Trash2, HardDrive, Volume2 } from 'lucide-vue-next'
import { formatDate } from '@/utils/format'

const settings = useSettingsStore()
const progress = useProgressStore()
const ui = useUiStore()

const themes: { id: ThemePref; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Clair', icon: Sun },
  { id: 'dark', label: 'Sombre', icon: Moon },
  { id: 'system', label: 'Comme l’appareil', icon: Monitor },
]

const confirmReset = ref(false)
const pendingImport = ref<ExportFile | null>(null)
const importErrors = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

function exportProgress() {
  const data = buildExport(progress.state, settings.snapshot())
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `cursus-progression-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
  ui.toast('Sauvegarde téléchargée.', 'success')
}

async function onFile(e: Event) {
  importErrors.value = []
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2_000_000) {
    importErrors.value = ['Le fichier est trop volumineux pour être une sauvegarde Cursus.']
    return
  }
  const res = parseImport(await file.text())
  if (!res.ok) importErrors.value = res.errors
  else pendingImport.value = res.value!
  if (fileInput.value) fileInput.value.value = ''
}

function applyImport() {
  if (!pendingImport.value) return
  progress.replace(pendingImport.value.progress)
  settings.replace(pendingImport.value.settings)
  pendingImport.value = null
  ui.toast('Progression importée.', 'success')
}

function doReset() {
  progress.reset()
  confirmReset.value = false
  ui.toast('Progression réinitialisée.', 'info')
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <KineticTitle text="Réglages" />

    <section class="panel mt-8 p-6">
      <h2 class="text-xl font-semibold">Apparence</h2>
      <div class="mt-4 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Thème">
        <button
          v-for="t in themes"
          :key="t.id"
          role="radio"
          :aria-checked="settings.theme === t.id"
          class="flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-semibold transition"
          :class="settings.theme === t.id ? 'border-ink bg-surface-2' : 'border-line hover:border-ink/40'"
          @click="settings.setTheme(t.id)"
        >
          <component :is="t.icon" :size="18" />{{ t.label }}
        </button>
      </div>
    </section>

    <section class="panel mt-6 divide-y divide-line">
      <label class="flex cursor-pointer items-center justify-between gap-4 p-6">
        <span>
          <span class="block text-lg font-semibold">Effets sonores</span>
          <span class="block text-sm text-ink-soft">Sons discrets pour les bonnes et mauvaises réponses, les badges et les chapitres terminés.</span>
        </span>
        <input v-model="settings.sound" type="checkbox" class="peer sr-only" role="switch" />
        <span class="relative h-7 w-12 shrink-0 rounded-full bg-surface-2 transition peer-checked:bg-capital peer-focus-visible:outline-2 peer-focus-visible:outline-focus after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" aria-hidden="true" />
      </label>
      <div v-if="settings.sound" class="px-6 pb-5 pt-1">
        <button class="btn-quiet !px-2 text-sm" @click="playSound('correct')"><Volume2 :size="16" />Écouter un exemple</button>
      </div>
      <label class="flex cursor-pointer items-center justify-between gap-4 p-6">
        <span>
          <span class="block text-lg font-semibold">Chronomètre des quiz</span>
          <span class="block text-sm text-ink-soft">Ajoute un temps limite à chaque quiz. Le quiz se termine automatiquement à la fin du temps.</span>
        </span>
        <input v-model="settings.quizTimer" type="checkbox" class="peer sr-only" role="switch" />
        <span class="relative h-7 w-12 shrink-0 rounded-full bg-surface-2 transition peer-checked:bg-capital peer-focus-visible:outline-2 peer-focus-visible:outline-focus after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" aria-hidden="true" />
      </label>
    </section>

    <section class="panel mt-6 p-6">
      <h2 class="text-xl font-semibold">Ma progression</h2>
      <p class="mt-2 flex gap-2 rounded-xl bg-surface-2/70 p-3 text-sm text-ink-soft">
        <HardDrive :size="18" class="mt-0.5 shrink-0" />
        Tes données sont conservées uniquement dans ce navigateur, sur cet appareil. Elles ne sont pas synchronisées entre appareils. Pour les transférer, exporte-les puis importe le fichier sur l'autre appareil.
      </p>
      <dl class="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div><dt class="text-muted">Leçons terminées</dt><dd class="num font-semibold">{{ progress.state.lessonsCompleted.length }}</dd></div>
        <div><dt class="text-muted">Exercices faits</dt><dd class="num font-semibold">{{ progress.exercisesDone }}</dd></div>
        <div><dt class="text-muted">Quiz passés</dt><dd class="num font-semibold">{{ progress.state.quizAttempts.length }}</dd></div>
      </dl>

      <div class="mt-6 flex flex-wrap gap-2">
        <button class="btn-primary" @click="exportProgress"><Download :size="16" />Exporter en JSON</button>
        <button class="btn-ghost" @click="fileInput?.click()"><Upload :size="16" />Importer une sauvegarde</button>
        <input ref="fileInput" type="file" accept="application/json,.json" class="sr-only" aria-label="Fichier de sauvegarde à importer" @change="onFile" />
      </div>

      <div v-if="importErrors.length" class="mt-4 rounded-xl bg-ko-soft/70 p-4 text-sm" role="alert">
        <p class="font-semibold text-ko">Import impossible : aucune donnée n'a été modifiée.</p>
        <ul class="mt-1 list-disc pl-5 text-ink-soft"><li v-for="e in importErrors" :key="e">{{ e }}</li></ul>
      </div>

      <div class="mt-8 border-t border-line pt-6">
        <h3 class="font-semibold">Réinitialiser</h3>
        <p class="mt-1 text-sm text-ink-soft">Efface leçons, exercices, quiz, XP et badges. Les préférences d'affichage sont conservées.</p>
        <button class="btn mt-3 border border-ko/40 text-ko hover:bg-ko-soft" @click="confirmReset = true"><Trash2 :size="16" />Réinitialiser ma progression</button>
      </div>
    </section>

    <ConfirmDialog
      :open="confirmReset"
      title="Réinitialiser la progression ?"
      message="Toutes tes leçons terminées, résultats d'exercices et de quiz, XP et badges seront supprimés de cet appareil. Pense à exporter une sauvegarde avant si tu veux pouvoir revenir en arrière."
      confirm-label="Tout effacer"
      danger
      @confirm="doReset"
      @cancel="confirmReset = false"
    />
    <ConfirmDialog
      :open="!!pendingImport"
      title="Remplacer ta progression ?"
      :message="pendingImport ? `Sauvegarde du ${formatDate(pendingImport.exportedAt)} : ${pendingImport.progress.lessonsCompleted.length} leçon(s) terminée(s), ${pendingImport.progress.xp} XP. Elle remplacera la progression actuelle de cet appareil.` : ''"
      confirm-label="Importer"
      @confirm="applyImport"
      @cancel="pendingImport = null"
    />
  </div>
</template>
