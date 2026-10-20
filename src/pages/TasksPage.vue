<template>
  <f7-page name="tasks">
    <f7-navbar title="Мої завдання" />
    <div class="app-content">
      <div class="page-heading">
        <h1>Завдання</h1>
        <p>Список поточних завдань</p>
      </div>
      <div class="task-list">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="task-row task-row-detail"
        >
          <f7-icon
            :f7="task.completed ? 'checkmark_circle_fill' : 'circle'"
            :class="{ 'completed-icon': task.completed }"
          />
          <div class="task-details">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-description">{{ task.description }}</div>
            <div class="task-status">
              {{ task.completed ? 'Виконано' : 'Очікує виконання' }}
            </div>
          </div>
        </div>
      </div>
      <p class="helper-text">
        Створення, редагування та видалення завдань — у наступних заняттях.
      </p>
    </div>
    <template #fixed>
      <AppTabbar active="tasks" />
    </template>
  </f7-page>
</template>

<script setup>
import AppTabbar from '../components/AppTabbar.vue';
import { tasks } from '../data/tasks.js';
</script>
