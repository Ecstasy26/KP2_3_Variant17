<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import PriorityBadge from './PriorityBadge.vue'

const props = defineProps({
  task: { type: Object, required: true },
  projectTitle: { type: String, default: 'Загальні' },
  showManagementActions: { type: Boolean, default: true },
})
const emit = defineEmits(['status-change', 'priority-change', 'edit', 'delete'])

const statusSequence = ['todo', 'progress', 'done']
const prioritySequence = ['low', 'medium', 'high']

const statusActionText = computed(
  () =>
    ({
      todo: 'Взяти в роботу',
      progress: 'Завершити',
      done: 'Повернути в план',
    })[props.task.status] || 'Змінити статус',
)

const formattedDate = computed(() => {
  if (!props.task.dueDate) return 'Без терміну'
  const date = new Date(`${props.task.dueDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Дата не визначена'
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
})

function changeStatus() {
  const currentIndex = statusSequence.indexOf(props.task.status)
  emit('status-change', {
    id: props.task.id,
    status: statusSequence[(currentIndex + 1) % statusSequence.length],
  })
}

function changePriority() {
  const currentIndex = prioritySequence.indexOf(props.task.priority)
  emit('priority-change', {
    id: props.task.id,
    priority: prioritySequence[(currentIndex + 1) % prioritySequence.length],
  })
}
</script>

<template>
  <f7-card class="tf3-task-card">
    <f7-card-content>
      <div class="tf3-card-heading">
        <h3 class="tf3-card-title">{{ task.title }}</h3>
        <StatusBadge :status="task.status" />
      </div>

      <p class="tf3-card-description">{{ task.description || 'Без опису' }}</p>

      <div class="tf3-card-meta">
        <div class="tf3-meta-item">
          <span class="tf3-meta-label">Пріоритет:</span>
          <PriorityBadge :priority="task.priority" />
        </div>
        <div class="tf3-meta-date">Термін: {{ formattedDate }}</div>
        <div class="tf3-meta-date">Проєкт: {{ projectTitle }}</div>
      </div>

      <div class="tf3-card-actions tf5-card-actions">
        <button
          type="button"
          class="tf3-action tf3-action--primary"
          @click="changeStatus"
        >
          {{ statusActionText }}
        </button>
        <button type="button" class="tf3-action" @click="changePriority">
          Пріоритет
        </button>
        <button
          v-if="showManagementActions"
          type="button"
          class="tf3-action"
          @click="emit('edit', task.id)"
        >
          Редагувати
        </button>
        <button
          v-if="showManagementActions"
          type="button"
          class="tf3-action tf5-danger"
          @click="emit('delete', task.id)"
        >
          Видалити
        </button>
      </div>
    </f7-card-content>
  </f7-card>
</template>
