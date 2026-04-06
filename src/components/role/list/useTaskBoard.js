import { computed, reactive, ref } from 'vue'

import {
  defaultTaskForm,
  filterOptions,
  statusAccentMap,
  statusStyles,
  workflowStages
} from './taskBoard.constants'
import initialTasks from './data/taskBoard.data.json'
import {
  createSubtasksFromFormItems,
  createDefaultTaskForm,
  createPrimaryAssignment,
  createTaskCode,
  createTaskSummary,
  formatIsoDate,
  formatLongDateRange,
  formatShortDate,
  getProgressForStatus,
  getStatusForProgress,
  getTaskProgress,
  slugify,
  splitCommaList,
  syncAssignmentsForProgress,
  syncSubtasksForStatus
} from './taskBoard.utils'

function cloneInitialTasks() {
  return JSON.parse(JSON.stringify(initialTasks))
}

export function useTaskBoard() {
  const tasks = ref(cloneInitialTasks())
  const selectedFilter = ref('all')
  const selectedTaskId = ref(tasks.value[0]?.id ?? null)
  const isTaskModalOpen = ref(false)
  const isDeleteModalOpen = ref(false)
  const taskModalMode = ref('create')
  const editingTaskId = ref(null)
  const taskForm = reactive(createDefaultTaskForm(defaultTaskForm))
  const formErrors = reactive({
    title: '',
    description: '',
    assigneeName: '',
    estimate: '',
    endDate: ''
  })

  const filteredTasks = computed(() => {
    if (selectedFilter.value === 'all') {
      return tasks.value
    }

    return tasks.value.filter(task => task.status === selectedFilter.value)
  })

  const selectedTask = computed(() => {
    return filteredTasks.value.find(task => task.id === selectedTaskId.value) || filteredTasks.value[0] || tasks.value[0] || null
  })

  const taskModalEyebrow = computed(() => taskModalMode.value === 'edit' ? 'Edit Task' : 'Create Task')
  const taskModalTitle = computed(() => taskModalMode.value === 'edit' ? 'Update software task' : 'Add a new software task')
  const taskModalDescription = computed(() => {
    return taskModalMode.value === 'edit'
      ? 'Adjust the delivery details for the selected task and save the changes back into the board.'
      : 'Capture the key delivery information and add the task directly into the board.'
  })
  const taskModalActionLabel = computed(() => taskModalMode.value === 'edit' ? 'Save Changes' : 'Add Task')

  const taskProgressValue = computed(() => {
    return selectedTask.value ? getTaskProgress(selectedTask.value) : 0
  })

  const progressGuidance = computed(() => {
    const progress = taskProgressValue.value

    if (progress >= 100) {
      return 'Done'
    }

    if (progress >= 75) {
      return 'Ready for final approval'
    }

    if (progress >= 25) {
      return 'Active delivery'
    }

    return 'Waiting to start'
  })

  function updateTaskRecord(taskId, transform) {
    const taskIndex = tasks.value.findIndex(task => task.id === taskId)

    if (taskIndex === -1) {
      return
    }

    const currentTask = tasks.value[taskIndex]
    tasks.value.splice(taskIndex, 1, transform(currentTask))
  }

  function setSelectedTaskStatus(status) {
    if (!selectedTask.value) {
      return
    }

    updateTaskRecord(selectedTask.value.id, task => {
      const nextProgress = getProgressForStatus(status, getTaskProgress(task))

      return {
        ...task,
        status,
        progressPercent: nextProgress,
        accent: statusAccentMap[status],
        assignments: syncAssignmentsForProgress(task.assignments, nextProgress, status),
        subtasks: syncSubtasksForStatus(task.subtasks, status)
      }
    })
  }

  function updateSelectedTaskProgress(progress) {
    if (!selectedTask.value) {
      return
    }

    const normalizedProgress = Math.max(0, Math.min(100, Math.round(progress)))
    const status = getStatusForProgress(normalizedProgress)

    updateTaskRecord(selectedTask.value.id, task => ({
      ...task,
      status,
      progressPercent: normalizedProgress,
      accent: statusAccentMap[status],
      assignments: syncAssignmentsForProgress(task.assignments, normalizedProgress, status),
      subtasks: syncSubtasksForStatus(task.subtasks, status)
    }))
  }

  function addSelectedTaskSubtask(title) {
    if (!selectedTask.value) {
      return
    }

    const normalizedTitle = (title || '').trim()

    if (!normalizedTitle) {
      return
    }

    updateTaskRecord(selectedTask.value.id, task => {
      const existingSubtasks = task.subtasks || []
      const nextSubtaskId = existingSubtasks.length
        ? Math.max(...existingSubtasks.map(subtask => subtask.id)) + 1
        : 1

      return {
        ...task,
        subtasks: [
          ...existingSubtasks,
          {
            id: nextSubtaskId,
            title: normalizedTitle,
            note: 'Created from the task detail view.',
            done: false
          }
        ]
      }
    })
  }

  function toggleSelectedSubtask(subtaskId) {
    if (!selectedTask.value) {
      return
    }

    updateTaskRecord(selectedTask.value.id, task => ({
      ...task,
      subtasks: (task.subtasks || []).map(subtask => subtask.id === subtaskId
        ? {
            ...subtask,
            done: !subtask.done
          }
        : subtask)
    }))
  }

  function clearFormErrors() {
    Object.keys(formErrors).forEach(key => {
      formErrors[key] = ''
    })
  }

  function fillTaskForm(task) {
    Object.assign(taskForm, {
      title: task.title,
      subtasks: task.subtasks.map(subtask => ({
        id: subtask.id,
        title: subtask.title
      })),
      description: task.description,
      status: task.status,
      assigneeName: task.assignments[0]?.name || '',
      estimate: task.estimate,
      branch: task.branch,
      startDate: task.startDate,
      endDate: task.endDate,
      blocker: task.blocker,
      nextAction: task.nextAction,
      qaFocus: task.qaFocus,
      stack: task.stack.join(', ')
    })
  }

  function openTaskModal(task = null) {
    clearFormErrors()

    if (task) {
      taskModalMode.value = 'edit'
      editingTaskId.value = task.id
      fillTaskForm(task)
    } else {
      taskModalMode.value = 'create'
      editingTaskId.value = null
      Object.assign(taskForm, createDefaultTaskForm(defaultTaskForm))
    }

    isTaskModalOpen.value = true
  }

  function closeTaskModal() {
    isTaskModalOpen.value = false
    taskModalMode.value = 'create'
    editingTaskId.value = null
  }

  function openDeleteModal() {
    isDeleteModalOpen.value = true
  }

  function closeDeleteModal() {
    isDeleteModalOpen.value = false
  }

  function validateTaskForm() {
    clearFormErrors()

    if (!taskForm.title) {
      formErrors.title = 'Task title is required.'
    }

    if (!taskForm.description) {
      formErrors.description = 'Description is required.'
    }

    if (!taskForm.assigneeName) {
      formErrors.assigneeName = 'Assignee is required.'
    }

    if (!taskForm.estimate) {
      formErrors.estimate = 'Estimate is required.'
    }

    if (taskForm.startDate && taskForm.endDate && taskForm.endDate < taskForm.startDate) {
      formErrors.endDate = 'End date must be on or after the start date.'
    }

    return !Object.values(formErrors).some(Boolean)
  }

  function createTask() {
    const newTaskId = tasks.value.length
      ? Math.max(...tasks.value.map(task => task.id)) + 1
      : 1
    const code = createTaskCode(taskForm.title)
    const formattedStatus = statusStyles[taskForm.status].label
    const startDate = taskForm.startDate || defaultTaskForm.startDate
    const primaryAssignment = createPrimaryAssignment(taskForm.assigneeName, startDate)
    const summary = createTaskSummary(taskForm.description, taskForm.title)
    const progressPercent = getProgressForStatus(taskForm.status)
    const subtasks = createSubtasksFromFormItems(taskForm.subtasks)

    const newTask = {
      id: newTaskId,
      code,
      title: taskForm.title,
      summary,
      description: taskForm.description,
      status: taskForm.status,
      progressPercent,
      estimate: taskForm.estimate,
      startDate,
      endDate: taskForm.endDate || startDate,
      sprint: 'Current Sprint',
      team: primaryAssignment.name,
      repository: 'ocmadminui',
      branch: taskForm.branch || `feature/${slugify(taskForm.title)}`,
      milestone: `${formattedStatus} delivery`,
      releaseNote: `Assigned to ${primaryAssignment.name} and waiting for execution updates.`,
      blocker: taskForm.blocker || 'None.',
      nextAction: taskForm.nextAction || 'Break the work into engineering subtasks and assign owners.',
      qaFocus: taskForm.qaFocus || 'Confirm the task scope and acceptance criteria before release.',
      stack: splitCommaList(taskForm.stack),
      deliverables: ['Spec review', 'Implementation', 'QA sign-off'],
      accent: statusAccentMap[taskForm.status],
      assignments: syncAssignmentsForProgress([primaryAssignment], progressPercent, taskForm.status),
      subtasks,
      comments: [
        {
          id: 1,
          author: 'Task Board',
          initials: 'TB',
          time: 'Apr 3, 2026',
          body: `Task created with status ${formattedStatus} and assigned to ${primaryAssignment.name}.`
        }
      ]
    }

    tasks.value.unshift(newTask)
    selectedFilter.value = 'all'
    selectedTaskId.value = newTask.id
    closeTaskModal()
  }

  function updateTask() {
    const taskIndex = tasks.value.findIndex(task => task.id === editingTaskId.value)

    if (taskIndex === -1) {
      closeTaskModal()
      return
    }

    const existingTask = tasks.value[taskIndex]
    const primaryAssignment = createPrimaryAssignment(
      taskForm.assigneeName,
      taskForm.startDate || existingTask.startDate,
      existingTask.assignments[0]
    )
    const summary = createTaskSummary(taskForm.description, taskForm.title)
    const progressPercent = getProgressForStatus(taskForm.status, getTaskProgress(existingTask))
    const subtasks = createSubtasksFromFormItems(taskForm.subtasks, existingTask.subtasks)
    const updatedTask = {
      ...existingTask,
      title: taskForm.title,
      summary,
      description: taskForm.description,
      status: taskForm.status,
      progressPercent,
      estimate: taskForm.estimate,
      startDate: taskForm.startDate || existingTask.startDate,
      endDate: taskForm.endDate || taskForm.startDate || existingTask.endDate,
      sprint: existingTask.sprint,
      team: primaryAssignment.name,
      repository: existingTask.repository,
      branch: taskForm.branch || existingTask.branch,
      milestone: existingTask.milestone,
      releaseNote: existingTask.releaseNote,
      blocker: taskForm.blocker || 'None.',
      nextAction: taskForm.nextAction || existingTask.nextAction,
      qaFocus: taskForm.qaFocus || existingTask.qaFocus,
      stack: splitCommaList(taskForm.stack),
      accent: statusAccentMap[taskForm.status],
      assignments: syncAssignmentsForProgress([primaryAssignment, ...existingTask.assignments.slice(1)], progressPercent, taskForm.status),
      subtasks: syncSubtasksForStatus(subtasks, taskForm.status),
      comments: [
        {
          id: (existingTask.comments[0]?.id || 0) + 1,
          author: 'Task Board',
          initials: 'TB',
          time: formatIsoDate(new Date()),
          body: `Task details updated. Status is now ${statusStyles[taskForm.status].label}. Primary assignee is ${primaryAssignment.name}.`
        },
        ...existingTask.comments
      ]
    }

    tasks.value.splice(taskIndex, 1, updatedTask)

    if (selectedFilter.value !== 'all' && updatedTask.status !== selectedFilter.value) {
      selectedFilter.value = 'all'
    }

    selectedTaskId.value = updatedTask.id
    closeTaskModal()
  }

  function submitTaskForm() {
    if (!validateTaskForm()) {
      return
    }

    if (taskModalMode.value === 'edit' && editingTaskId.value !== null) {
      updateTask()
      return
    }

    createTask()
  }

  function deleteSelectedTask() {
    const currentTaskId = selectedTaskId.value
    const taskIndex = tasks.value.findIndex(task => task.id === currentTaskId)

    if (taskIndex === -1) {
      closeDeleteModal()
      return
    }

    tasks.value.splice(taskIndex, 1)

    const nextTask = tasks.value[taskIndex] || tasks.value[taskIndex - 1] || tasks.value[0] || null
    selectedTaskId.value = nextTask ? nextTask.id : null
    closeDeleteModal()
  }

  return {
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
    workflowStages,
    deleteSelectedTask
  }
}
