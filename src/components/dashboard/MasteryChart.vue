<script setup lang="ts">
import { ref } from 'vue'
import { chapters } from '@/data/chapters'
import { useProgressStore } from '@/stores/progress'
import { useChart, cssVar, tooltipStyle } from '@/composables/useChart'

const progress = useProgressStore()
const canvas = ref<HTMLCanvasElement | null>(null)

useChart(canvas, () => ({
  type: 'bar',
  data: {
    labels: chapters.map((c) => `Ch. ${c.number}`),
    datasets: [
      { label: 'Leçons terminées', data: chapters.map((c) => Math.round(progress.chapterProgress(c.id) * 100)), backgroundColor: cssVar('--ink'), borderRadius: 6, maxBarThickness: 22 },
      { label: 'Réussite (exercices et quiz)', data: chapters.map((c) => { const m = progress.chapterMastery(c.id); return m === null ? 0 : Math.round(m * 100) }), backgroundColor: cssVar('--capital'), borderRadius: 6, maxBarThickness: 22 },
    ],
  },
  options: {
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
      tooltip: { ...tooltipStyle(), callbacks: { title: (items) => chapters[items[0].dataIndex].title, label: (c) => `${c.dataset.label} : ${c.parsed.y} %` } },
    },
    scales: { y: { min: 0, max: 100, ticks: { callback: (v) => `${v} %`, stepSize: 25 } }, x: { grid: { display: false } } },
  },
}), () => [progress.state.lessonsCompleted.length, Object.keys(progress.state.exerciseResults).length, progress.state.quizAttempts.length])
</script>

<template>
  <div class="h-60"><canvas ref="canvas" role="img" aria-label="Progression et réussite par chapitre" /></div>
</template>
