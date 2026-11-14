import correctUrl from '@/assets/sounds/correct.mp3'
import wrongUrl from '@/assets/sounds/wrong.mp3'
import quizUrl from '@/assets/sounds/quiz-complete.mp3'
import badgeUrl from '@/assets/sounds/badge.mp3'
import chapterUrl from '@/assets/sounds/chapter-complete.mp3'
import progressUrl from '@/assets/sounds/progress.mp3'

/**
 * Effets sonores intégrés au projet (aucun service externe).
 * Les sons ne sont joués qu'en réponse à une action de l'utilisateur
 * (clic, validation), ce qui respecte les règles de lecture automatique des navigateurs.
 */
export type SoundName = 'correct' | 'wrong' | 'quiz' | 'badge' | 'chapter' | 'progress'

const URLS: Record<SoundName, string> = {
  correct: correctUrl,
  wrong: wrongUrl,
  quiz: quizUrl,
  badge: badgeUrl,
  chapter: chapterUrl,
  progress: progressUrl,
}

const VOLUMES: Partial<Record<SoundName, number>> = { wrong: 0.5, progress: 0.45 }

const cache = new Map<SoundName, HTMLAudioElement>()

let enabled = true

export function setSoundEnabled(value: boolean) {
  enabled = value
}

export function playSound(name: SoundName) {
  if (!enabled || typeof Audio === 'undefined') return
  try {
    let base = cache.get(name)
    if (!base) {
      base = new Audio(URLS[name])
      base.preload = 'auto'
      cache.set(name, base)
    }
    const a = base.cloneNode(true) as HTMLAudioElement
    a.volume = VOLUMES[name] ?? 0.6
    void a.play().catch(() => {
      /* lecture refusée par le navigateur : on ignore silencieusement */
    })
  } catch {
    /* audio indisponible */
  }
}
