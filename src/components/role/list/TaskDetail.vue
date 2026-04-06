<template>
  <main class="task-detail">
    <template v-if="task">
      <header class="task-detail__header">
        <div class="task-detail__header-top">
          <button type="button" class="task-back-button">
            <svg viewBox="0 0 24 24" class="task-back-button__icon" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Back
          </button>

          <div class="task-detail__top-actions">
            <button type="button" class="task-action-button" @click="emit('edit', task)">Edit</button>
            <button type="button" class="task-action-button task-action-button--danger" @click="emit('delete')">Delete</button>
            <span class="task-status-pill" :class="statusStyles[task.status].badge">
              {{ statusStyles[task.status].label }}
            </span>
          </div>
        </div>

        <h2 class="task-detail__title">{{ task.title }}</h2>

        <div class="task-detail__meta">
          <span class="task-detail__meta-item">
            <svg viewBox="0 0 24 24" class="task-detail__meta-icon" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 7v5l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ task.estimate }}
          </span>
          <span class="task-detail__meta-item">
            <svg viewBox="0 0 24 24" class="task-detail__meta-icon" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ formatLongDateRange(task.startDate, task.endDate) }}
          </span>
        </div>

        <section class="workflow-panel" :data-status="task.status">
          <div class="workflow-panel__header">
            <div>
              <p class="workflow-panel__eyebrow">Workflow</p>
              <p class="workflow-panel__text">Use task status as the main progress checkpoint: To Do, In Progress, In Review, and Done each map to a percentage range.</p>
            </div>

            <div class="workflow-panel__progress-value">
              <strong>{{ taskProgressValue }}%</strong>
              <span>{{ progressGuidance }}</span>
            </div>
          </div>

          <div class="workflow-stage-list">
            <button
              v-for="stage in workflowStages"
              :key="stage.key"
              type="button"
              class="workflow-stage"
              :class="[
                `workflow-stage--${stage.key.replace('_', '-')}`,
                { 'workflow-stage--active': task.status === stage.key }
              ]"
              @click="emit('set-status', stage.key)"
            >
              <span class="workflow-stage__label">{{ stage.label }}</span>
              <span class="workflow-stage__note">{{ stage.note }}</span>
            </button>
          </div>

          <div class="workflow-progress-card">
            <div class="workflow-progress-card__top">
              <div>
                <p class="workflow-progress-card__title">Progress percentage</p>
                <p class="workflow-progress-card__text">Changing status sets a default percentage, and moving the slider updates the task status automatically across the workflow.</p>
              </div>
              <span class="workflow-progress-card__badge">{{ taskProgressValue }}%</span>
            </div>

            <label class="workflow-progress-card__control">
              <span class="workflow-progress-card__control-label">Status</span>
              <select class="workflow-progress-card__select" :value="task.status" @change="emit('set-status', $event.target.value)">
                <option v-for="stage in workflowStages" :key="stage.key" :value="stage.key">{{ stage.label }}</option>
              </select>
            </label>

            <input
              class="workflow-progress-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              :value="taskProgressValue"
              @input="emit('update-progress', Number($event.target.value))"
            >

            <div class="workflow-progress-legend">
              <span>To Do</span>
              <span>In Progress</span>
              <span>In Review</span>
              <span>Done</span>
            </div>
          </div>
        </section>
      </header>

      <div class="task-detail__body">
        <section v-if="task.description" class="task-section">
          <div class="task-section__header">
            <h3 class="task-section__title">Description</h3>
          </div>

          <div class="task-description-card">
            <p class="task-description-card__text">{{ task.description }}</p>
          </div>
        </section>

        <section class="task-section">
          <div class="task-section__header">
            <h3 class="task-section__title">Subtasks ({{ subtasks.length }})</h3>
          </div>

          <div class="subtask-form">
            <input
              ref="subtaskInputRef"
              v-model.trim="localSubtaskDraft"
              class="subtask-form__input"
              type="text"
              placeholder="Create a subtask for this task"
              @keydown.enter.prevent="submitSubtask"
            >
            <button type="button" class="subtask-form__button" @mousedown.prevent.stop="submitSubtask">Add Subtask</button>
          </div>

          <div class="subtask-list">
            <label v-for="subtask in subtasks" :key="subtask.id" class="subtask-item" :class="{ 'subtask-item--done': subtask.done }">
              <input
                class="subtask-item__checkbox"
                type="checkbox"
                :checked="subtask.done"
                @change="emit('toggle-subtask', subtask.id)"
              >
              <div class="subtask-item__content">
                <span class="subtask-item__title">{{ subtask.title }}</span>
                <span v-if="subtask.note" class="subtask-item__note">{{ subtask.note }}</span>
              </div>
            </label>
          </div>
        </section>

        <section class="task-section">
          <div class="task-section__header">
            <h3 class="task-section__title">Assignments ({{ task.assignments.length }})</h3>
          </div>

          <div class="assignment-list">
            <article v-for="member in task.assignments" :key="member.id" class="assignment-card">
              <div class="assignment-card__header">
                <div class="assignment-card__person">
                  <div class="assignment-card__avatar">{{ member.initials }}</div>
                  <div>
                    <h4 class="assignment-card__name">{{ member.name }}</h4>
                  </div>
                </div>

                <span class="assignment-card__progress">{{ member.progress }}%</span>
              </div>

              <div class="assignment-card__bar">
                <div class="assignment-card__bar-fill" :style="{ width: `${member.progress}%` }"></div>
              </div>

              <div class="assignment-card__meta">
                <span>Assigned by {{ member.assignedBy }}</span>
                <span>Started {{ member.startedAt }}</span>
              </div>
            </article>
          </div>
        </section>

        <section class="task-section">
          <div class="task-section__header">
            <h3 class="task-section__title">Comments ({{ task.comments.length }})</h3>
          </div>

          <div class="comment-list">
            <article v-for="comment in task.comments" :key="comment.id" class="comment-row">
              <div class="comment-row__avatar">{{ comment.initials }}</div>
              <div class="comment-row__body">
                <div class="comment-row__top">
                  <strong class="comment-row__author">{{ comment.author }}</strong>
                  <span class="comment-row__time">{{ comment.time }}</span>
                </div>
                <p class="comment-row__text">{{ comment.body }}</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </template>

    <div v-else class="task-empty-state">
      <h2 class="task-empty-state__title">No tasks available</h2>
      <p class="task-empty-state__text">Create a new task to start building the software delivery board.</p>
      <button type="button" class="task-primary-button" @click="emit('create')">Create First Task</button>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  statusStyles: {
    type: Object,
    required: true
  },
  workflowStages: {
    type: Array,
    required: true
  },
  taskProgressValue: {
    type: Number,
    required: true
  },
  progressGuidance: {
    type: String,
    required: true
  },
  formatLongDateRange: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['add-subtask', 'create', 'delete', 'edit', 'set-status', 'toggle-subtask', 'update-progress'])

const localSubtaskDraft = ref('')
const subtaskInputRef = ref(null)

const subtasks = computed(() => props.task?.subtasks || [])

watch(() => props.task?.id, () => {
  localSubtaskDraft.value = ''
})

function submitSubtask() {
  const title = localSubtaskDraft.value.trim()

  if (!title) {
    subtaskInputRef.value?.focus()
    return
  }

  emit('add-subtask', title)
  localSubtaskDraft.value = ''
  subtaskInputRef.value?.focus()
}
</script>
