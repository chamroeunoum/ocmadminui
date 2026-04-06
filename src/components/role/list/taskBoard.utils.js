const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
})

const isoDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})

export function formatShortDate(value) {
  return shortDateFormatter.format(new Date(value))
}

export function formatIsoDate(value) {
  return isoDateFormatter.format(new Date(value))
}

export function formatLongDateRange(start, end) {
  return `${formatIsoDate(start)} – ${formatIsoDate(end)}`
}

export function getTaskProgress(task) {
  if (typeof task.progressPercent === 'number') {
    return Math.max(0, Math.min(100, Math.round(task.progressPercent)))
  }

  const assignmentAverage = task.assignments.length
    ? task.assignments.reduce((sum, member) => sum + member.progress, 0) / task.assignments.length
    : 0
  const subtaskAverage = task.subtasks.length
    ? (task.subtasks.filter(item => item.done).length / task.subtasks.length) * 100
    : 0

  return Math.round((assignmentAverage + subtaskAverage) / 2)
}

export function getProgressForStatus(status, currentProgress = 0) {
  if (status === 'done') {
    return 100
  }

  if (status === 'in_review') {
    return currentProgress >= 75 && currentProgress < 100 ? currentProgress : 85
  }

  if (status === 'in_progress') {
    return currentProgress >= 25 && currentProgress < 75 ? currentProgress : 50
  }

  if (status === 'todo') {
    return currentProgress >= 0 && currentProgress < 25 ? currentProgress : 0
  }

  if (status === 'cancelled') {
    return 0
  }

  return currentProgress || 5
}

export function getStatusForProgress(progress) {
  if (progress >= 100) {
    return 'done'
  }

  if (progress >= 75) {
    return 'in_review'
  }

  if (progress >= 25) {
    return 'in_progress'
  }

  return 'todo'
}

export function createDefaultTaskForm(defaultTaskForm) {
  return {
    ...defaultTaskForm,
    subtasks: (defaultTaskForm.subtasks || []).map(subtask => ({ ...subtask }))
  }
}

export function createTaskCode(title) {
  const words = title
    .split(/\s+/)
    .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean)

  const letters = words.slice(0, 3).map(word => word[0].toUpperCase()).join('')
  return letters || 'TSK'
}

export function createPrimaryAssignment(name, startDate, existingAssignment = null) {
  return {
    id: existingAssignment?.id || 1,
    name,
    initials: createInitials(name),
    role: existingAssignment?.role || 'Software Engineer',
    progress: existingAssignment?.progress ?? 0,
    assignedBy: existingAssignment?.assignedBy || 'Task Board',
    startedAt: existingAssignment?.startedAt || startDate,
    focus: existingAssignment?.focus || 'Primary implementation owner'
  }
}

export function createInitials(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('') || 'NA'
}

export function syncAssignmentsForProgress(assignments, progress, status) {
  if (!assignments.length) {
    return assignments
  }

  return assignments.map((assignment, index) => ({
    ...assignment,
    progress: status === 'done'
      ? 100
      : index === 0
        ? progress
        : assignment.progress
  }))
}

export function syncSubtasksForStatus(subtasks, status) {
  if (status === 'done') {
    return subtasks.map(subtask => ({
      ...subtask,
      done: true
    }))
  }

  if (status === 'todo' || status === 'cancelled') {
    return subtasks.map(subtask => ({
      ...subtask,
      done: false
    }))
  }

  return subtasks
}

export function createTaskSummary(description, title) {
  const normalized = description.replace(/\s+/g, ' ').trim()

  if (!normalized) {
    return title
  }

  return normalized.length > 78 ? `${normalized.slice(0, 78).trim()}...` : normalized
}

export function splitCommaList(value) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export function createSubtasksFromFormItems(items, existingSubtasks = []) {
  const titles = (items || [])
    .map(item => item?.title?.trim() || '')
    .filter(Boolean)

  if (!titles.length) {
    return existingSubtasks.length
      ? existingSubtasks
      : [
          {
            id: 1,
            title: 'Define implementation plan',
            note: 'Break this task into actionable engineering steps.',
            done: false
          }
        ]
  }

  return titles.map((title, index) => ({
    id: existingSubtasks[index]?.id || index + 1,
    title,
    note: existingSubtasks[index]?.note || 'Track this step under the parent task.',
    done: existingSubtasks[index]?.done ?? false
  }))
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'new-task'
}
