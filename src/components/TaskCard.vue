<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import PriorityBadge from './PriorityBadge.vue'
const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['status-change', 'priority-change'])
const statusSequence = ['todo', 'progress', 'done']
const prioritySequence = ['low', 'medium', 'high']
const statusActionText = computed(() => ({
  todo: 'Взяти в роботу', progress: 'Завершити',
  done: 'Повернути в план',
})[props.task.status] || 'Змінити статус')
const formattedDate = computed(() => {
  if (!props.task.dueDate) return 'Без терміну'
  const date = new Date(`${props.task.dueDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Дата не визначена'
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(date)
})
function changeStatus() {
  const index = statusSequence.indexOf(props.task.status)
  emit('status-change', {
    id: props.task.id,
    status: statusSequence[(index + 1) % statusSequence.length],
  })
}
function changePriority() {
  const index = prioritySequence.indexOf(props.task.priority)
  emit('priority-change', {
    id: props.task.id,
    priority: prioritySequence[(index + 1) % prioritySequence.length],
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
      <p class="tf3-card-description">{{ task.description }}</p>
      <div class="tf3-card-meta">
        <div class="tf3-meta-item">
          <span class="tf3-meta-label">Пріоритет:</span>
          <PriorityBadge :priority="task.priority" />
        </div>
        <div class="tf3-meta-date">Термін: {{ formattedDate }}</div>
      </div>
      <div class="tf3-card-actions">

        <button type="button" class="tf3-action tf3-action--primary"
          @click="changeStatus">{{ statusActionText }}</button>
        <button type="button" class="tf3-action"
          @click="changePriority">Змінити пріоритет</button>
      </div>
    </f7-card-content>
  </f7-card>
</template>
