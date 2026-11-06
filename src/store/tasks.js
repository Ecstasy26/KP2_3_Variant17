import { defineStore } from 'pinia'
import initialTasks from '../data/tasks.js'
import { useProjectsStore } from './projects.js'

const allowedStatuses = ['todo', 'progress', 'done']
const allowedPriorities = ['low', 'medium', 'high']
const priorityRank = { high: 3, medium: 2, low: 1 }

function normalizeValues(values, projects) {
  const requested = values.projectId ?? 'general'
  return {
    title: String(values.title ?? '').trim(),
    description: String(values.description ?? '').trim(),
    status: allowedStatuses.includes(values.status) ? values.status : 'todo',
    priority: allowedPriorities.includes(values.priority) ? values.priority : 'medium',
    dueDate: String(values.dueDate ?? ''),
    projectId: projects.some((project) => project.id === requested) ? requested : 'general',
  }
}

function isValidTask(values) {
  return values.title.length >= 3 && values.title.length <= 80 &&
    values.description.length <= 500 &&
    (!values.dueDate || /^\d{4}-\d{2}-\d{2}$/.test(values.dueDate))
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    // У демонстраційних завдань із попередньої роботи ще немає projectId.
    tasks: initialTasks.map((task) => ({ ...task, projectId: task.projectId ?? 'general' })),
    searchText: '',
    selectedStatus: 'all',
    selectedPriority: 'all',
    selectedProject: 'all',
    sortOrder: 'newest',
  }),

  getters: {
    totalTasks: (state) => state.tasks.length,
    completedTasks: (state) => state.tasks.filter((task) => task.status === 'done').length,
    progressTasks: (state) => state.tasks.filter((task) => task.status === 'progress').length,
    activeTasks: (state) => state.tasks
      .filter((task) => task.status !== 'done')
      .sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority] || b.id - a.id)
      .slice(0, 3),

    visibleTasks: (state) => {
      const term = state.searchText.trim().toLocaleLowerCase('uk-UA')
      const filtered = state.tasks.filter((task) => {
        const text = `${task.title} ${task.description ?? ''}`.toLocaleLowerCase('uk-UA')
        return (!term || text.includes(term)) &&
          (state.selectedStatus === 'all' || task.status === state.selectedStatus) &&
          (state.selectedPriority === 'all' || task.priority === state.selectedPriority) &&
          (state.selectedProject === 'all' || task.projectId === state.selectedProject)
      })

      // Сортуємо результат filter(), щоб не міняти порядок у вихідному масиві.
      return filtered.sort((a, b) => {
        if (state.sortOrder === 'title') return a.title.localeCompare(b.title, 'uk-UA') || a.id - b.id
        if (state.sortOrder === 'priority') return priorityRank[b.priority] - priorityRank[a.priority] || b.id - a.id
        if (state.sortOrder === 'dueDate') {
          return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31') || b.id - a.id
        }
        return b.id - a.id
      })
    },
  },

  actions: {
    addTask(values) {
      const task = normalizeValues(values, useProjectsStore().projects)
      if (!isValidTask(task)) return false
      const id = Math.max(0, ...this.tasks.map((item) => item.id)) + 1
      this.tasks.unshift({ id, ...task })
      return true
    },

    updateTask(values) {
      const task = this.tasks.find((item) => item.id === Number(values.id))
      if (!task) return false
      const normalized = normalizeValues(values, useProjectsStore().projects)
      if (!isValidTask(normalized)) return false
      Object.assign(task, normalized)
      return true
    },

    deleteTask(id) {
      const index = this.tasks.findIndex((item) => item.id === Number(id))
      if (index === -1) return false
      this.tasks.splice(index, 1)
      return true
    },

    setTaskStatus({ id, status }) {
      if (!allowedStatuses.includes(status)) return false
      const task = this.tasks.find((item) => item.id === Number(id))
      if (!task) return false
      task.status = status
      return true
    },

    setTaskPriority({ id, priority }) {
      if (!allowedPriorities.includes(priority)) return false
      const task = this.tasks.find((item) => item.id === Number(id))
      if (!task) return false
      task.priority = priority
      return true
    },

    resetFilters() {
      this.searchText = ''
      this.selectedStatus = 'all'
      this.selectedPriority = 'all'
      this.selectedProject = 'all'
      this.sortOrder = 'newest'
    },
  },
})
