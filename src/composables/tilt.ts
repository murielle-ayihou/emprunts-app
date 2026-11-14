import type { Directive } from 'vue'

/**
 * v-tilt : carte « tactile ».
 *  - Souris : inclinaison 3D qui suit le pointeur, avec un reflet.
 *  - Souris ou doigt : on peut attraper la carte et la tirer ; elle revient avec un rebond.
 *    Un vrai glissé n'ouvre pas le lien (le clic est annulé au-delà de 8 px).
 * Désactivé si l'utilisateur préfère réduire les animations.
 */
const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const fine = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches

interface TiltState {
  max: number
  dragging: boolean
  moved: boolean
  sx: number
  sy: number
  dx: number
  dy: number
  rx: number
  ry: number
  handlers: [string, EventListener, AddEventListenerOptions?][]
}
type El = HTMLElement & { _tilt?: TiltState }

function apply(el: El, springBack = false) {
  const s = el._tilt!
  el.style.transition = springBack
    ? 'transform 620ms cubic-bezier(.2,1.6,.35,1), box-shadow 300ms ease'
    : s.dragging
      ? 'transform 40ms linear, box-shadow 200ms ease'
      : 'transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease'
  el.style.transform = `perspective(900px) translate3d(${s.dx}px, ${s.dy}px, 0) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) rotateZ(${(s.dx * 0.05).toFixed(2)}deg)`
  el.style.boxShadow = s.dragging ? '0 30px 60px -24px rgba(20,40,75,.45)' : ''
  el.style.zIndex = s.dragging ? '5' : ''
}

export const vTilt: Directive<El, number | undefined> = {
  mounted(el, binding) {
    if (reduced()) return
    const s: TiltState = { max: binding.value ?? 7, dragging: false, moved: false, sx: 0, sy: 0, dx: 0, dy: 0, rx: 0, ry: 0, handlers: [] }
    el._tilt = s
    el.style.transformStyle = 'preserve-3d'
    el.style.touchAction = 'pan-y'
    el.style.willChange = 'transform'

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--glare-x', `${(x + 0.5) * 100}%`)
      el.style.setProperty('--glare-y', `${(y + 0.5) * 100}%`)
      if (s.dragging) {
        const ddx = e.clientX - s.sx
        const ddy = e.clientY - s.sy
        if (Math.hypot(ddx, ddy) > 8) s.moved = true
        // Résistance élastique : plus on tire, moins ça suit
        s.dx = Math.sign(ddx) * Math.pow(Math.abs(ddx), 0.82)
        s.dy = Math.sign(ddy) * Math.pow(Math.abs(ddy), 0.82)
        s.ry = Math.max(-25, Math.min(25, ddx * 0.12))
        s.rx = Math.max(-20, Math.min(20, -ddy * 0.12))
      } else if (fine()) {
        s.rx = -y * s.max
        s.ry = x * s.max
      } else return
      apply(el)
    }
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return
      s.dragging = true
      s.moved = false
      s.sx = e.clientX
      s.sy = e.clientY
      el.setPointerCapture?.(e.pointerId)
    }
    const release = () => {
      if (!s.dragging) return
      s.dragging = false
      s.dx = s.dy = s.rx = s.ry = 0
      apply(el, true)
    }
    const leave = () => {
      if (s.dragging) return
      s.rx = s.ry = 0
      apply(el)
    }
    const click = (e: Event) => {
      if (s.moved) {
        e.preventDefault()
        e.stopPropagation()
        s.moved = false
      }
    }
    s.handlers = [
      ['pointermove', move as EventListener],
      ['pointerdown', down as EventListener],
      ['pointerup', release],
      ['pointercancel', release],
      ['pointerleave', leave],
      ['click', click, { capture: true }],
    ]
    s.handlers.forEach(([t, h, o]) => el.addEventListener(t, h, o))
  },
  unmounted(el) {
    el._tilt?.handlers.forEach(([t, h, o]) => el.removeEventListener(t, h, o))
  },
}
