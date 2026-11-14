<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{ open: boolean; title: string; message: string; confirmLabel: string; cancelLabel?: string; danger?: boolean }>(),
  { cancelLabel: 'Annuler', danger: false },
)
const emit = defineEmits<{ confirm: []; cancel: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const cancelBtn = ref<HTMLButtonElement | null>(null)

watch(
  () => props.open,
  async (open) => {
    await nextTick()
    const d = dialog.value
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      cancelBtn.value?.focus()
    } else if (!open && d.open) d.close()
  },
  { immediate: true },
)
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[min(92vw,440px)] rounded-[20px] border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-[#0d1729]/50 backdrop:backdrop-blur-[2px]"
    aria-labelledby="confirm-title"
    @cancel.prevent="emit('cancel')"
  >
    <div class="p-6">
      <h2 id="confirm-title" class="text-xl font-semibold">{{ title }}</h2>
      <p class="mt-2 text-ink-soft">{{ message }}</p>
      <div class="mt-6 flex flex-wrap justify-end gap-2">
        <button ref="cancelBtn" type="button" class="btn-ghost" @click="emit('cancel')">{{ cancelLabel }}</button>
        <button type="button" class="btn" :class="danger ? 'bg-ko text-white hover:brightness-110' : 'btn-primary'" @click="emit('confirm')">{{ confirmLabel }}</button>
      </div>
    </div>
  </dialog>
</template>
