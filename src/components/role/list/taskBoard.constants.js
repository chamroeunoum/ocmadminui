export const statusStyles = {
  todo: {
    label: 'TO DO',
    badge: 'bg-slate-200 text-slate-600',
    dot: 'bg-slate-400'
  },
  in_progress: {
    label: 'IN PROGRESS',
    badge: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-500'
  },
  in_review: {
    label: 'IN REVIEW',
    badge: 'bg-violet-100 text-violet-700',
    dot: 'bg-violet-500'
  },
  done: {
    label: 'DONE',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500'
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-rose-100 text-rose-700',
    dot: 'bg-rose-500'
  }
}

export const filterOptions = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'in_review', label: 'In Review' },
  { key: 'done', label: 'Done' },
  { key: 'cancelled', label: 'Cancelled' }
]

export const workflowStages = [
  { key: 'todo', label: 'TO DO', note: '0% to 24% and not started yet' },
  { key: 'in_progress', label: 'IN PROGRESS', note: '25% to 74% and actively moving' },
  { key: 'in_review', label: 'IN REVIEW', note: '75% to 99% and waiting for approval' },
  { key: 'done', label: 'DONE', note: '100% and fully completed' }
]

export const statusAccentMap = {
  todo: 'bg-slate-500',
  in_progress: 'bg-blue-600',
  in_review: 'bg-violet-500',
  done: 'bg-emerald-500',
  cancelled: 'bg-rose-500'
}

export const defaultTaskForm = {
  title: '',
  subtasks: [
    {
      id: 1,
      title: ''
    }
  ],
  description: '',
  status: 'todo',
  assigneeName: '',
  estimate: '',
  branch: '',
  startDate: '2026-04-03',
  endDate: '2026-04-07',
  blocker: 'None.',
  nextAction: '',
  qaFocus: '',
  stack: 'Vue 3, Tailwind CSS'
}
