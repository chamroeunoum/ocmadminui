<template>
  <div v-if="open" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-card max-h-[90vh] w-full max-w-3xl overflow-y-auto" @click.stop>
      <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 md:px-6">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">{{ taskModalEyebrow }}</p>
          <h2 class="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{{ taskModalTitle }}</h2>
          <p class="mt-2 text-sm text-slate-500">{{ taskModalDescription }}</p>
        </div>

        <button type="button" class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="$emit('close')">
          <svg viewBox="0 0 24 24" class="h-5 w-5 fill-none stroke-current" stroke-width="2">
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <form class="space-y-6 px-5 py-5 md:px-6 md:py-6" @submit.prevent="$emit('submit')">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="form-field md:col-span-2">
            <span class="form-label">Task title</span>
            <input v-model.trim="form.title" type="text" placeholder="Example: Implement release health dashboard">
            <small v-if="errors.title" class="form-error">{{ errors.title }}</small>
          </label>

          <div class="form-field md:col-span-2">
            <div class="flex items-center justify-between gap-3">
              <span class="form-label">Subtasks</span>
              <button type="button" class="task-form-add-subtask-button" @click="appendSubtask">
                +
              </button>
            </div>

            <div class="space-y-3">
              <div v-for="(subtask, index) in form.subtasks" :key="subtask.id" class="flex items-center gap-3">
                <input v-model.trim="subtask.title" type="text" :placeholder="`Subtask ${index + 1}`">
                <button v-if="form.subtasks.length > 1" type="button" class="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700" @click="removeSubtask(index)">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <label class="form-field md:col-span-2">
            <span class="form-label">Description</span>
            <textarea v-model.trim="form.description" rows="4" placeholder="Describe what engineering should build, review, or deliver."></textarea>
            <small v-if="errors.description" class="form-error">{{ errors.description }}</small>
          </label>

          <label class="form-field">
            <span class="form-label">Status</span>
            <select v-model="form.status">
              <option v-for="option in filterOptions.slice(1)" :key="option.key" :value="option.key">{{ option.label }}</option>
            </select>
          </label>

          <label class="form-field">
            <span class="form-label">Assign to</span>
            <input v-model.trim="form.assigneeName" type="text" placeholder="Bob Martinez">
            <small v-if="errors.assigneeName" class="form-error">{{ errors.assigneeName }}</small>
          </label>

          <label class="form-field">
            <span class="form-label">Estimate</span>
            <input v-model.trim="form.estimate" type="text" placeholder="120 min">
            <small v-if="errors.estimate" class="form-error">{{ errors.estimate }}</small>
          </label>

          <label class="form-field">
            <span class="form-label">Branch</span>
            <input v-model.trim="form.branch" type="text" placeholder="feature/release-dashboard">
          </label>

          <label class="form-field">
            <span class="form-label">Start date</span>
            <input v-model="form.startDate" type="date">
          </label>

          <label class="form-field">
            <span class="form-label">End date</span>
            <input v-model="form.endDate" type="date">
            <small v-if="errors.endDate" class="form-error">{{ errors.endDate }}</small>
          </label>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <label class="form-field">
            <span class="form-label">Tech stack</span>
            <input v-model.trim="form.stack" type="text" placeholder="Vue 3, Tailwind CSS, Vite">
          </label>
        </div>

        <div class="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" class="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" @click="$emit('close')">
            Cancel
          </button>
          <button type="submit" class="task-form-submit-button">
            {{ taskModalActionLabel }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  form: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  filterOptions: {
    type: Array,
    required: true
  },
  taskModalEyebrow: {
    type: String,
    required: true
  },
  taskModalTitle: {
    type: String,
    required: true
  },
  taskModalDescription: {
    type: String,
    required: true
  },
  taskModalActionLabel: {
    type: String,
    required: true
  }
})

defineEmits(['close', 'submit'])

function appendSubtask() {
  const nextId = props.form.subtasks.length
    ? Math.max(...props.form.subtasks.map(subtask => subtask.id)) + 1
    : 1

  props.form.subtasks.push({
    id: nextId,
    title: ''
  })
}

function removeSubtask(index) {
  props.form.subtasks.splice(index, 1)
}
</script>
