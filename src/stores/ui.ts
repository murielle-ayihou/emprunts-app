import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastTone = 'info' | 'success' | 'error'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

export interface Celebration {
  id: number
  kind: 'badge' | 'level' | 'chapter'
  title: string
  message: string
  icon: string
}

let seq = 0

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const celebrations = ref<Celebration[]>([])

  function toast(message: string, tone: ToastTone = 'info', ms = 3500) {
    const id = ++seq
    toasts.value.push({ id, message, tone })
    window.setTimeout(() => dismissToast(id), ms)
  }

  function dismissToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function celebrate(c: Omit<Celebration, 'id'>) {
    celebrations.value.push({ ...c, id: ++seq })
  }

  function dismissCelebration() {
    celebrations.value.shift()
  }

  return { toasts, celebrations, toast, dismissToast, celebrate, dismissCelebration }
})
