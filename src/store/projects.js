import { defineStore } from 'pinia'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [
      { id: 'general', title: 'Загальні' },
      { id: 'study', title: 'Навчання' },
      { id: 'personal', title: 'Особисті' },
    ],
    nextProjectId: 1,
  }),

  getters: {
    projectCount: (state) => state.projects.length,
    projectTitle: (state) => (id) =>
      state.projects.find((project) => project.id === id)?.title ?? 'Загальні',
  },

  actions: {
    addProject(rawTitle) {
      const title = String(rawTitle ?? '').trim()
      if (title.length < 3 || title.length > 40) return null

      const duplicate = this.projects.some(
        (project) => project.title.toLocaleLowerCase('uk-UA') === title.toLocaleLowerCase('uk-UA'),
      )
      if (duplicate) return null

      const project = { id: `project-${this.nextProjectId}`, title }
      this.nextProjectId += 1
      this.projects.push(project)
      return project
    },
  },
})
