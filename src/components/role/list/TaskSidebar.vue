<template>
  <aside class="task-sidebar">
    <div class="task-sidebar__header">
      <div class="task-sidebar__title-row">
        <div class="task-sidebar__title-wrap">
          <div class="task-sidebar__icon">
            <svg viewBox="0 0 24 24" class="task-sidebar__icon-svg" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M5 6.75h3.5V3.25H5zM5 13.75h3.5v-3.5H5zM5 20.75h3.5v-3.5H5zM11 5h8M11 12h8M11 19h8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h1 class="task-sidebar__title">Tasks</h1>
          <span class="task-sidebar__count">{{ tasks.length }}</span>
        </div>

        <button type="button" class="task-primary-button" @click="$emit('create')">
          <svg viewBox="0 0 24 24" class="task-primary-button__icon" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          New Task
        </button>
      </div>

      <div class="task-filters">
        <button
          v-for="option in filterOptions"
          :key="option.key"
          type="button"
          class="task-filter"
          :class="{ 'task-filter--active': selectedFilter === option.key }"
          @click="$emit('update:selectedFilter', option.key)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="task-list">
      <button
        v-for="task in filteredTasks"
        :key="task.id"
        type="button"
        class="task-row"
        :class="{ 'task-row--active': selectedTask && selectedTask.id === task.id }"
        @click="$emit('select-task', task.id)"
      >
        <div class="task-row__header">
          <h2 class="task-row__title">{{ task.title }}</h2>
          <span class="task-status-pill" :class="statusStyles[task.status].badge">
            {{ statusStyles[task.status].label }}
          </span>
        </div>

        <div class="task-row__meta">
          <span class="task-row__meta-item">
            <svg viewBox="0 0 24 24" class="task-row__meta-icon" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 7v5l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ formatShortDate(task.startDate) }}
          </span>
          <span class="task-row__meta-item">{{ task.estimate }}</span>
        </div>

        <span class="task-row__chevron">›</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  tasks: {
    type: Array,
    required: true
  },
  filteredTasks: {
    type: Array,
    required: true
  },
  selectedTask: {
    type: Object,
    default: null
  },
  selectedFilter: {
    type: String,
    required: true
  },
  filterOptions: {
    type: Array,
    required: true
  },
  statusStyles: {
    type: Object,
    required: true
  },
  formatShortDate: {
    type: Function,
    required: true
  }
})

defineEmits(['create', 'update:selectedFilter', 'select-task'])
</script>
