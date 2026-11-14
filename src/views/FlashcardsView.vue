<script setup lang="ts">
import KineticTitle from '@/components/common/KineticTitle.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { glossary } from '@/data/glossary'
import { formulas } from '@/data/formulas'
import { parts, getChapter } from '@/data/chapters'
import { getLesson, lessons } from '@/data/lessons'
import { shuffle } from '@/utils/answers'
import { playSound } from '@/services/sound'
import MathTex from '@/components/common/MathTex.vue'
import { ArrowLeft, ArrowRight, Shuffle, Check, RotateCcw, BookOpen } from 'lucide-vue-next'

/** Révision flash : fiches recto (terme ou formule) / verso (définition), qui se retournent en 3D. */
interface Card { id: string; kind: 'mot' | 'formule'; front: string; back: string; latex?: string; partId: string; lessonId: string }

function partOfLesson(lessonId: string): string {
  const l = getLesson(lessonId)
  return (l && getChapter(l.chapterId)?.partId) || 't4'
}
/** Retrouve la leçon où une formule est utilisée. */
function lessonOfFormula(fid: string): string {
  const l = lessons.find((x) => x.blocks.some((b) => b.type === 'formula' && b.formulaId === fid))
  return l?.id ?? lessons[0].id
}

const allCards: Card[] = [
  ...glossary.map((g, i) => ({ id: `g${i}`, kind: 'mot' as const, front: g.term, back: g.definition, partId: partOfLesson(g.lessonId), lessonId: g.lessonId })),
  ...formulas.map((f) => {
    const lessonId = lessonOfFormula(f.id)
    return { id: f.id, kind: 'formule' as const, front: f.title, back: f.whenToUse, latex: f.latex, partId: partOfLesson(lessonId), lessonId }
  }),
]

const partFilter = ref<string>('tous')
const kindFilter = ref<'tous' | 'mot' | 'formule'>('tous')
const deck = ref<Card[]>([])
const index = ref(0)
const flipped = ref(false)
const known = ref(new Set<string>())
const review = ref(new Set<string>())

function rebuild(doShuffle = true) {
  const filtered = allCards.filter((c) => (partFilter.value === 'tous' || c.partId === partFilter.value) && (kindFilter.value === 'tous' || c.kind === kindFilter.value))
  deck.value = doShuffle ? shuffle(filtered) : filtered
  index.value = 0
  flipped.value = false
  known.value = new Set()
  review.value = new Set()
}
watch([partFilter, kindFilter], () => rebuild())
rebuild()

const card = computed(() => deck.value[index.value])
const done = computed(() => deck.value.length > 0 && known.value.size + review.value.size >= deck.value.length)

function go(d: number) {
  if (!deck.value.length) return
  flipped.value = false
  index.value = (index.value + d + deck.value.length) % deck.value.length
}
function mark(ok: boolean) {
  const c = card.value
  if (!c) return
  if (ok) {
    known.value.add(c.id)
    review.value.delete(c.id)
  } else {
    review.value.add(c.id)
    known.value.delete(c.id)
  }
  playSound(ok ? 'correct' : 'progress')
  if (!done.value) go(1)
}
function retryReview() {
  const ids = new Set(review.value)
  deck.value = shuffle(deck.value.filter((c) => ids.has(c.id)))
  index.value = 0
  flipped.value = false
  known.value = new Set()
  review.value = new Set()
}

function onKey(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'SELECT' || tag === 'INPUT') return
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    flipped.value = !flipped.value
  } else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// Glisser (mobile) : gauche/droite pour passer, toucher pour retourner
let startX = 0
function onTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - startX
  if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
}

// Légère inclinaison 3D qui suit le pointeur
const tilt = ref({ x: 0, y: 0 })
function onPointer(e: PointerEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tilt.value = { x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 }
}
</script>

<template>
  <div class="mx-auto max-w-3xl overflow-x-clip">
    <header>
      <KineticTitle text="Révision flash" />
      <p class="mt-3 text-lg text-ink-soft">{{ allCards.length }} fiches : le vocabulaire et les formules de tous les Titres. Retourne la fiche, puis dis honnêtement si tu savais.</p>
    </header>

    <div class="mt-6 flex flex-wrap items-center gap-2">
      <label class="sr-only" for="fc-part">Titre</label>
      <select id="fc-part" v-model="partFilter" class="field !w-auto !py-2 text-sm">
        <option value="tous">Tous les Titres</option>
        <option v-for="p in parts" :key="p.id" :value="p.id">Titre {{ p.number }} : {{ p.title }}</option>
      </select>
      <div class="flex rounded-xl border border-line bg-surface p-1 text-sm" role="radiogroup" aria-label="Type de fiches">
        <button v-for="[k, l] in [['tous', 'Tout'], ['mot', 'Vocabulaire'], ['formule', 'Formules']]" :key="k" role="radio" :aria-checked="kindFilter === k" class="rounded-lg px-3 py-1.5 font-semibold" :class="kindFilter === k ? 'bg-deep text-on-deep' : 'text-ink-soft'" @click="kindFilter = k as typeof kindFilter">{{ l }}</button>
      </div>
      <button class="btn-quiet ml-auto !py-2 text-sm" @click="rebuild()"><Shuffle :size="16" />Mélanger</button>
    </div>

    <div v-if="!deck.length" class="mt-10 rounded-[20px] border border-dashed border-line p-8 text-center text-ink-soft">Aucune fiche pour ce filtre.</div>

    <template v-else-if="!done && card">
      <div class="mt-6 flex items-center justify-between text-sm text-muted">
        <span class="num">Fiche {{ index + 1 }} / {{ deck.length }}</span>
        <span class="num"><span class="text-ok">{{ known.size }} sues</span>, <span class="text-interest">{{ review.size }} à revoir</span></span>
      </div>

      <div class="scene mt-3" @pointermove="onPointer" @pointerleave="tilt = { x: 0, y: 0 }" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
        <div class="stack" aria-hidden="true"><span /><span /></div>
        <button
          class="card"
          :class="{ flipped }"
          :style="{ '--tx': tilt.x + 'deg', '--ty': tilt.y + 'deg' }"
          :aria-label="flipped ? `Verso : ${card.back}. Appuie pour revoir le recto.` : `Recto : ${card.front}. Appuie pour retourner.`"
          @click="flipped = !flipped"
        >
          <span class="face front">
            <span class="chip self-start" :class="card.kind === 'formule' ? 'bg-brass-soft text-brass' : 'bg-capital-soft text-capital'">{{ card.kind === 'formule' ? 'Formule' : 'Vocabulaire' }}</span>
            <span class="mt-auto font-display text-3xl font-bold leading-tight sm:text-4xl">{{ card.front }}</span>
            <span class="mt-auto text-sm text-muted">Appuie (ou Espace) pour retourner</span>
          </span>
          <span class="face back">
            <span class="text-sm font-semibold text-capital">{{ card.front }}</span>
            <span v-if="card.latex" class="my-4 block overflow-x-auto text-center text-xl text-ink"><MathTex :tex="card.latex" display /></span>
            <span class="text-lg leading-relaxed text-ink-soft">{{ card.back }}</span>
            <RouterLink :to="`/cours/${card.lessonId}`" class="mt-auto inline-flex items-center gap-1.5 self-start text-sm font-semibold text-capital hover:underline" @click.stop><BookOpen :size="15" />Revoir la leçon</RouterLink>
          </span>
        </button>
      </div>

      <div class="mt-5 flex items-center justify-between gap-2">
        <button class="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-ink-soft hover:text-ink" aria-label="Fiche précédente" @click="go(-1)"><ArrowLeft :size="18" /></button>
        <div class="flex gap-2">
          <button class="btn border border-interest/40 bg-interest-soft/60 text-ink hover:bg-interest-soft" @click="mark(false)"><RotateCcw :size="16" />À revoir</button>
          <button class="btn bg-ok text-white hover:brightness-110" @click="mark(true)"><Check :size="16" />Je savais</button>
        </div>
        <button class="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-ink-soft hover:text-ink" aria-label="Fiche suivante" @click="go(1)"><ArrowRight :size="18" /></button>
      </div>
      <p class="mt-3 text-center text-xs text-muted">Sur mobile : glisse la fiche pour passer à la suivante.</p>
    </template>

    <section v-else class="panel mt-8 p-8 text-center">
      <p class="font-display text-3xl font-bold">Paquet terminé</p>
      <p class="mt-2 text-ink-soft"><span class="num font-semibold text-ok">{{ known.size }}</span> fiches sues, <span class="num font-semibold text-interest">{{ review.size }}</span> à revoir.</p>
      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <button v-if="review.size" class="btn-primary" @click="retryReview"><RotateCcw :size="16" />Revoir les {{ review.size }} fiches</button>
        <button class="btn-ghost" @click="rebuild()"><Shuffle :size="16" />Recommencer tout le paquet</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  perspective: 1400px;
  height: 22rem;
  margin-right: 12px;
}
.stack span {
  position: absolute;
  inset: 0;
  border-radius: 26px;
  border: 1px solid var(--line);
  background: var(--surface);
}
.stack span:first-child {
  transform: translate(10px, 12px) rotate(2.2deg);
  opacity: 0.55;
}
.stack span:last-child {
  transform: translate(5px, 6px) rotate(1deg);
  opacity: 0.8;
}
.card {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateX(var(--tx, 0deg)) rotateY(calc(var(--ty, 0deg)));
  transition: transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1);
  border-radius: 26px;
  text-align: left;
}
.card.flipped {
  transform: rotateX(var(--tx, 0deg)) rotateY(calc(180deg + var(--ty, 0deg)));
}
.face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  border-radius: 26px;
  border: 1px solid var(--line);
  background: var(--surface);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 24px 48px -28px rgba(20, 40, 75, 0.45);
  overflow: hidden;
}
.front {
  background-image: radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, var(--brass-bright) 14%, transparent), transparent 60%);
}
.back {
  transform: rotateY(180deg);
  background-image: radial-gradient(120% 90% at 0% 100%, color-mix(in oklab, var(--capital) 12%, transparent), transparent 60%);
}
.card:focus-visible {
  outline: none;
}
.card:focus-visible .face {
  outline: 2.5px solid var(--focus);
  outline-offset: 2px;
}
</style>
