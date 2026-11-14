import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import {
  Chart, LineController, BarController, DoughnutController, LineElement, BarElement, ArcElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend, Filler, type ChartConfiguration,
} from 'chart.js'
import { useSettingsStore } from '@/stores/settings'

Chart.register(LineController, BarController, DoughnutController, LineElement, BarElement, ArcElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

/** Lit une variable CSS du thème courant. */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Crée un graphique Chart.js lié à un <canvas>.
 * `build` est rappelé quand les données ou le thème changent, pour relire les couleurs.
 */
export function useChart(canvas: Ref<HTMLCanvasElement | null>, build: () => ChartConfiguration, deps: () => unknown) {
  let chart: Chart | null = null
  const settings = useSettingsStore()
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function render() {
    if (!canvas.value) return
    const cfg = build()
    const font = { family: cssVar('--font-sans') || 'Manrope Variable, sans-serif', size: 12 }
    Chart.defaults.font = { ...Chart.defaults.font, ...font }
    Chart.defaults.color = cssVar('--muted')
    Chart.defaults.borderColor = cssVar('--line')
    cfg.options = { responsive: true, maintainAspectRatio: false, animation: reduced ? false : { duration: 600 }, ...cfg.options }
    if (chart) chart.destroy()
    chart = new Chart(canvas.value, cfg)
  }

  onMounted(render)
  watch(canvas, (el) => {
    if (el) render()
    else {
      chart?.destroy()
      chart = null
    }
  })
  watch(deps, render, { deep: true })
  watch(() => settings.isDark, () => setTimeout(render, 320))
  onBeforeUnmount(() => chart?.destroy())
}

export function tooltipStyle() {
  return {
    backgroundColor: cssVar('--surface'),
    titleColor: cssVar('--ink'),
    bodyColor: cssVar('--ink-soft'),
    borderColor: cssVar('--line'),
    borderWidth: 1,
    padding: 10,
    cornerRadius: 10,
    boxPadding: 4,
  }
}

/** « #11806f » + 0.2 → « rgba(17,128,111,0.2) » */
export function alpha(hex: string, a: number): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
