<template>
  <f7-page name="home">
    <f7-navbar title="TaskFlow" />

    <div class="app-content">
      <div class="welcome-block">
        <h1>Мої завдання</h1>
        <p>Керуйте завданнями та відстежуйте їх виконання.</p>
      </div>

      <div class="summary-card">
        <div>
          <span class="summary-label">Виконано завдань</span>
          <div class="summary-value">{{ completedCount }} / {{ tasks.length }}</div>
        </div>
        <div class="summary-icon">✓</div>
      </div>

      <div class="section-header">
        <h2>Список завдань</h2>
        <span>{{ tasks.length }} завдань</span>
      </div>

      <div class="task-list">
        <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
      </div>

      <f7-button fill large href="/about/" class="about-button">
        Про застосунок
      </f7-button>
    </div>
  </f7-page>
</template>

<script setup>
import { computed, ref } from 'vue';
import TaskCard from '../components/TaskCard.vue';
import { tasks as initialTasks } from '../data/tasks.js';

const tasks = ref(initialTasks);

const completedCount = computed(() => {
  return tasks.value.filter(task => task.status === 'done').length;
});
</script>
