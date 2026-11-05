<script setup>
import { ref, computed } from 'vue'
import AppTabbar from '../components/AppTabbar.vue'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskListControls from '../components/TaskListControls.vue'
import {
  taskState,
  addTask,
  updateTask,
  deleteTask,
  setTaskStatus,
  setTaskPriority,
} from '../store/tasks.js'
import '../css/task-components.css'
import '../css/task-list.css'

const searchText = ref('')
const selectedStatus = ref('all')
const selectedPriority = ref('all')
const sortOrder = ref('newest')

const showForm = ref(false)
const editingId = ref(null)
const editingTask = computed(
  () => taskState.tasks.find((task) => task.id === editingId.value) ?? null,
)

const visibleTasks = computed(() => {
  const term = searchText.value.trim().toLocaleLowerCase('uk-UA')
  const priorityWeight = { high: 3, medium: 2, low: 1 }

  // filter() створює новий масив: вихідний стан не змінюється.
  const result = taskState.tasks.filter((task) => {
    const matchesText =
      !term ||
      `${task.title} ${task.description ?? ''}`
        .toLocaleLowerCase('uk-UA')
        .includes(term)
    const matchesStatus =
      selectedStatus.value === 'all' || task.status === selectedStatus.value
    const matchesPriority =
      selectedPriority.value === 'all' ||
      task.priority === selectedPriority.value

    return matchesText && matchesStatus && matchesPriority
  })

  // Сортуємо лише копію, щоб не змінювати taskState.tasks.
  return result.sort((a, b) => {
    if (sortOrder.value === 'title') {
      return a.title.localeCompare(b.title, 'uk-UA') || a.id - b.id
    }
    if (sortOrder.value === 'priority') {
      return (
        priorityWeight[b.priority] - priorityWeight[a.priority] || b.id - a.id
      )
    }
    if (sortOrder.value === 'dueDate') {
      // Порожні дати завжди після заповнених.
      const first = a.dueDate || '9999-12-31'
      const second = b.dueDate || '9999-12-31'
      return first.localeCompare(second) || b.id - a.id
    }
    return b.id - a.id
  })
})

function resetFilters() {
  searchText.value = ''
  selectedStatus.value = 'all'
  selectedPriority.value = 'all'
  sortOrder.value = 'newest'
}

function startCreate() {
  editingId.value = null
  showForm.value = true
}

function startEdit(id) {
  editingId.value = id
  showForm.value = true
}

function cancelForm() {
  editingId.value = null
  showForm.value = false
}

function saveTask(values) {
  const saved = values.id === null ? addTask(values) : updateTask(values)
  if (saved) cancelForm()
}

function handleDelete(id) {
  const task = taskState.tasks.find((item) => item.id === id)
  if (!task) return

  const confirmed = window.confirm(`Видалити завдання «${task.title}»?`)
  if (!confirmed) return

  if (deleteTask(id) && editingId.value === id) cancelForm()
}
</script>

<template>
  <f7-page name="tasks" class="tf3-page">
    <f7-navbar title="Мої завдання" />

    <div class="tf3-container">
      <section class="tf3-hero">
        <div class="tf3-eyebrow">TASKFLOW / TASK MANAGER</div>
        <h1>Керування завданнями</h1>
        <p>Створюйте, редагуйте, знаходьте, сортуйте та видаляйте завдання.</p>
        <button
          type="button"
          class="tf5-btn tf5-btn--primary tf5-new"
          @click="startCreate"
        >
          + Додати завдання
        </button>
      </section>

      <TaskForm
        v-if="showForm"
        :key="editingId ?? 'new'"
        :task="editingTask"
        @save="saveTask"
        @cancel="cancelForm"
      />

      <TaskListControls
        v-model:search="searchText"
        v-model:status="selectedStatus"
        v-model:priority="selectedPriority"
        v-model:sort="sortOrder"
        @reset="resetFilters"
      />

      <section class="tf3-section">
        <div class="tf3-section-heading">
          <div>
            <div class="tf3-eyebrow">TASK LIST</div>
            <h2>Список завдань</h2>
          </div>
          <div class="tf3-counter">
            Показано: {{ visibleTasks.length }} із {{ taskState.tasks.length }}
          </div>
        </div>

        <div v-if="visibleTasks.length" class="tf3-task-grid">
          <TaskCard
            v-for="task in visibleTasks"
            :key="task.id"
            :task="task"
            :editable="true"
            @status-change="setTaskStatus"
            @priority-change="setTaskPriority"
            @edit="startEdit"
            @delete="handleDelete"
          />
        </div>

        <div v-else class="tf5-empty">
          <p>За поточними умовами завдань не знайдено.</p>
          <button type="button" class="tf5-btn" @click="resetFilters">
            Показати всі завдання
          </button>
        </div>
      </section>
    </div>

    <template #fixed>
      <AppTabbar active="tasks" />
    </template>
  </f7-page>
</template>
