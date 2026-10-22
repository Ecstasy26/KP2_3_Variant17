import { reactive } from 'vue'
import initialTasks from '../data/tasks.js'

const allowedStatuses = ['todo', 'progress', 'done']
const allowedPriorities = ['low', 'medium', 'high']

export const taskState = reactive({
  tasks: initialTasks.map((task) => ({ ...task })),
})

export function setTaskStatus({ id, status }) {
  if (!allowedStatuses.includes(status)) return
  const task = taskState.tasks.find((item) => item.id === id)
  if (task) task.status = status
}

export function setTaskPriority({ id, priority }) {
  if (!allowedPriorities.includes(priority)) return
  const task = taskState.tasks.find((item) => item.id === id)
  if (task) task.priority = priority
}
