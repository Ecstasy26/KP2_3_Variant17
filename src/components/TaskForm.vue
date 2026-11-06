<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  task: { type: Object, default: null },
  projects: { type: Array, required: true },
})
const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  projectId: 'general',
})
const error = ref('')

watch(
  () => props.task,
  (task) => {
    form.title = task?.title ?? ''
    form.description = task?.description ?? ''
    form.status = task?.status ?? 'todo'
    form.priority = task?.priority ?? 'medium'
    form.dueDate = task?.dueDate ?? ''
    form.projectId = task?.projectId ?? 'general'
    error.value = ''
  },
  { immediate: true },
)

function submit() {
  const title = form.title.trim()
  const description = form.description.trim()

  if (title.length < 3 || title.length > 80) {
    error.value = 'Назва повинна містити від 3 до 80 символів.'
    return
  }
  if (description.length > 500) {
    error.value = 'Опис не може перевищувати 500 символів.'
    return
  }
  if (form.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.dueDate)) {
    error.value = 'Дата повинна мати коректний формат.'
    return
  }

  if (!props.projects.some((project) => project.id === form.projectId)) {
    error.value = 'Оберіть проєкт зі списку.'
    return
  }

  error.value = ''
  emit('save', {
    id: props.task?.id ?? null,
    title,
    description,
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate,
    projectId: form.projectId,
  })
}
</script>

<template>
  <section class="tf5-panel" aria-label="Форма завдання">
    <h2>{{ task ? 'Редагування завдання' : 'Нове завдання' }}</h2>
    <form class="tf5-form" @submit.prevent="submit">
      <label>
        Назва завдання *
        <input
          v-model="form.title"
          type="text"
          maxlength="80"
          placeholder="Назва завдання"
        />
      </label>

      <label>
        Опис
        <textarea
          v-model="form.description"
          rows="3"
          maxlength="500"
          placeholder="Деталі виконання"
        ></textarea>
      </label>

      <div class="tf5-form-grid">
        <label>
          Статус
          <select v-model="form.status">
            <option value="todo">Заплановано</option>
            <option value="progress">У роботі</option>
            <option value="done">Виконано</option>
          </select>
        </label>
        <label>
          Пріоритет
          <select v-model="form.priority">
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </label>
      </div>

      <div class="tf5-form-grid">
        <label>
          Проєкт
          <select v-model="form.projectId">
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.title }}
            </option>
          </select>
        </label>
        <label>
          Термін виконання
          <input v-model="form.dueDate" type="date" />
        </label>
      </div>

      <p v-if="error" class="tf5-error" role="alert">{{ error }}</p>

      <div class="tf5-actions">
        <button type="submit" class="tf5-btn tf5-btn--primary">
          {{ task ? 'Зберегти зміни' : 'Створити завдання' }}
        </button>
        <button type="button" class="tf5-btn" @click="emit('cancel')">
          Скасувати
        </button>
      </div>
    </form>
  </section>
</template>
