<template>
  <f7-toolbar bottom tabbar class="app-tabbar">
    <f7-link href="/" :class="{ 'app-link-active': active === 'home' }">
      <f7-icon f7="house_fill" />
      <span class="app-tab-label">Головна</span>
    </f7-link>
    <f7-link href="/tasks/" :class="{ 'app-link-active': active === 'tasks' }">
      <f7-icon f7="square_list_fill" />
      <span class="app-tab-label">Завдання</span>
    </f7-link>
    <f7-link href="/about/" :class="{ 'app-link-active': active === 'about' }">
      <f7-icon f7="info_circle_fill" />
      <span class="app-tab-label">Про застосунок</span>
    </f7-link>
  </f7-toolbar>
</template>

<script setup>
defineProps({ active: { type: String, required: true } });
</script>
