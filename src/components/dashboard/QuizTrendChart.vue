<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { useChart, cssVar, tooltipStyle, alpha } from '@/composables/useChart'
import { getQuizSeries } from '@/data/quizzes'
import { formatDate } from '@/utils/format'

const progress = useProgressStore()
const canvas = ref<HTMLCanvasElement | null>(null)
const attempts = computed(() => progress.state.quizAttempts.slice(0, 12).reverse())

useChart(canvas, () => ({
  type: 'line',
  data: {
    labels: attempts.value.map((a) => formatDate(a.date)),
    datasets: [{
      label: 'Score',
      data: attempts.value.map((a) => Math.round((a.score / a.total) * 100)),
      borderColor: cssVar('--brass-bright'),
      backgroundColor: alpha(cssVar('--brass-bright'), 0.15),
      fill: true, tension: 0.25, pointRadius: 4, pointBackgroundColor: cssVar('--brass-bright'),
    }],
  },
  options: {
    plugins: { legend: { display: false }, tooltip: { ...tooltipStyle(), callbacks: { title: (items) => getQuizSeries(attempts.value[items[0].dataIndex].quizId)?.title ?? '', label: (c) => `Score : ${c.parsed.y} %` } } },
    scales: { y: { min: 0, max: 100, ticks: { callback: (v) => `${v} %`, stepSize: 25 } }, x: { grid: { display: false } } },
  },
}), () => progress.state.quizAttempts.length)
</script>

<template>
  <div class="h-60"><canvas ref="canvas" role="img" aria-label="Évolution des scores aux quiz" /></div>
</template>
