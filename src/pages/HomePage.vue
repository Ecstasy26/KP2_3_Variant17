<template>
  <f7-page name="home">
    <f7-navbar title="TaskFlow">
      <f7-nav-right>
        <f7-link href="/about/"><f7-icon f7="info_circle" /></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <div class="app-content">
      <div class="page-heading">
        <h1>Головна</h1>
        <p>Огляд ваших завдань</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <f7-icon f7="square_list" />
          <div class="stat-value">{{ totalTasks }}</div>
          <div class="stat-label">Усього завдань</div>
        </div>
        <div class="stat-card stat-card-success">
          <f7-icon f7="checkmark_circle" />
          <div class="stat-value">{{ completedTasks }}</div>
          <div class="stat-label">Виконано</div>
        </div>
      </div>
      <div class="section-heading">
        <h2>Останні завдання</h2>
        <f7-link href="/tasks/">Переглянути всі</f7-link>
      </div>
      <div class="task-list">
        <div v-for="task in recentTasks" :key="task.id" class="task-row">
          <f7-icon
            :f7="task.completed ? 'checkmark_circle_fill' : 'circle'"
            :class="{ 'completed-icon': task.completed }"
          />

          <span>{{ task.title }}</span>
        </div>
      </div>
      <f7-button fill large href="/tasks/" class="page-action">
        Перейти до завдань
      </f7-button>
    </div>
    <template #fixed>
      <AppTabbar active="home" />
    </template>
  </f7-page>
</template>

<script setup>
import { computed } from 'vue';
import AppTabbar from '../components/AppTabbar.vue';
import { tasks } from '../data/tasks.js';

const totalTasks = computed(() => tasks.length);
const completedTasks = computed(() => tasks.filter((t) => t.completed).length);
const recentTasks = computed(() => tasks.slice(-3).reverse());
</script>
