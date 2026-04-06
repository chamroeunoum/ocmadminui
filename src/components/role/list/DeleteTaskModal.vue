<template>
  <div v-if="open && task" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-card w-full max-w-lg p-6" @click.stop>
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Delete Task</p>
      <h2 class="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Remove this task?</h2>
      <p class="mt-3 text-sm leading-6 text-slate-500">
        <strong class="text-slate-900">{{ task.title }}</strong> will be deleted from the board. This action cannot be undone in the current page state.
      </p>

      <div class="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" @click="$emit('close')">
          Cancel
        </button>
        <button type="button" class="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500" @click="$emit('confirm')">
          Delete Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    required: true
  },
  task: {
    type: Object,
    default: null
  }
})

defineEmits(['close', 'confirm'])
</script>
