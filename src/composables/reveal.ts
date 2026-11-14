import type { Directive } from 'vue'

/** v-reveal : le bloc apparaît (léger basculement 3D vers l'avant) quand il entre à l'écran. */
const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
let io: IntersectionObserver | null = null

function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            el.style.opacity = '1'
            el.style.transform = 'none'
            io!.unobserve(el)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
  }
  return io
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (reduced()) return
    const delay = binding.value ?? 0
    el.style.opacity = '0'
    el.style.transform = 'perspective(1000px) translateY(28px) rotateX(7deg)'
    el.style.transformOrigin = '50% 0'
    el.style.transition = `opacity 600ms ease ${delay}ms, transform 800ms cubic-bezier(.2,.9,.25,1) ${delay}ms`
    observer().observe(el)
  },
  unmounted(el) {
    io?.unobserve(el)
  },
}
