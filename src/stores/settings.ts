import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { SettingsState, ThemePref } from '@/types'
import { STORAGE_KEYS, defaultSettings, readJson, validateSettings, writeJson } from '@/services/storage'

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

export const useSettingsStore = defineStore('settings', () => {
  const saved = readJson<SettingsState>(STORAGE_KEYS.settings)
  const initial = saved && validateSettings(saved).ok ? saved : defaultSettings()

  const theme = ref<ThemePref>(initial.theme)
  const sound = ref<boolean>(initial.sound)
  const quizTimer = ref<boolean>(initial.quizTimer)
  const isDark = ref(false)

  function applyTheme(animate = false) {
    const dark = theme.value === 'dark' || (theme.value === 'system' && systemPrefersDark())
    isDark.value = dark
    const root = document.documentElement
    if (animate) {
      root.classList.add('theme-transition')
      window.setTimeout(() => root.classList.remove('theme-transition'), 350)
    }
    root.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0d1729' : '#f3f5f2')
  }

  function setTheme(t: ThemePref) {
    theme.value = t
    applyTheme(true)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  function snapshot(): SettingsState {
    return { theme: theme.value, sound: sound.value, quizTimer: quizTimer.value }
  }

  function replace(s: SettingsState) {
    theme.value = s.theme
    sound.value = s.sound
    quizTimer.value = s.quizTimer
    applyTheme(true)
  }

  watch([theme, sound, quizTimer], () => writeJson(STORAGE_KEYS.settings, snapshot()))

  if (typeof window !== 'undefined') {
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (theme.value === 'system') applyTheme(true)
    })
  }

  return { theme, sound, quizTimer, isDark, applyTheme, setTheme, toggleTheme, snapshot, replace }
})
