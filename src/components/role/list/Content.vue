<template>
  <section class="task-management">
    <div class="task-layout">
      <TaskSidebar
        :tasks="tasks"
        :filtered-tasks="filteredTasks"
        :selected-task="selectedTask"
        :selected-filter="selectedFilter"
        :filter-options="filterOptions"
        :status-styles="statusStyles"
        :format-short-date="formatShortDate"
        @create="openTaskModal()"
        @update:selected-filter="selectedFilter = $event"
        @select-task="selectedTaskId = $event"
      />

      <TaskDetail
        :task="selectedTask"
        :status-styles="statusStyles"
        :workflow-stages="workflowStages"
        :task-progress-value="taskProgressValue"
        :progress-guidance="progressGuidance"
        :format-long-date-range="formatLongDateRange"
        @create="openTaskModal()"
        @add-subtask="addSelectedTaskSubtask"
        @edit="openTaskModal"
        @delete="openDeleteModal"
        @set-status="setSelectedTaskStatus"
        @toggle-subtask="toggleSelectedSubtask"
        @update-progress="updateSelectedTaskProgress"
      />
    </div>

    <TaskFormModal
      :open="isTaskModalOpen"
      :form="taskForm"
      :errors="formErrors"
      :filter-options="filterOptions"
      :task-modal-eyebrow="taskModalEyebrow"
      :task-modal-title="taskModalTitle"
      :task-modal-description="taskModalDescription"
      :task-modal-action-label="taskModalActionLabel"
      @close="closeTaskModal"
      @submit="submitTaskForm"
    />

    <DeleteTaskModal
      :open="isDeleteModalOpen"
      :task="selectedTask"
      @close="closeDeleteModal"
      @confirm="deleteSelectedTask"
    />
  </section>
</template>

<script setup>
import './taskBoard.css'

import DeleteTaskModal from './DeleteTaskModal.vue'
import TaskDetail from './TaskDetail.vue'
import TaskFormModal from './TaskFormModal.vue'
import TaskSidebar from './TaskSidebar.vue'
import { useTaskBoard } from './useTaskBoard'

const {
  deleteSelectedTask,
  filterOptions,
  formErrors,
  formatLongDateRange,
  formatShortDate,
  filteredTasks,
  isDeleteModalOpen,
  isTaskModalOpen,
  addSelectedTaskSubtask,
  openDeleteModal,
  closeDeleteModal,
  openTaskModal,
  closeTaskModal,
  progressGuidance,
  selectedFilter,
  selectedTask,
  selectedTaskId,
  setSelectedTaskStatus,
  statusStyles,
  submitTaskForm,
  taskForm,
  taskModalActionLabel,
  taskModalDescription,
  taskModalEyebrow,
  taskModalTitle,
  taskProgressValue,
  tasks,
  toggleSelectedSubtask,
  updateSelectedTaskProgress,
  workflowStages
} = useTaskBoard()
</script>
