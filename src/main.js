import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Framework7 from 'framework7/lite-bundle';
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

import 'framework7/css/bundle';
import 'framework7-icons/css/framework7-icons.css';
import './css/app.css';
import App from './App.vue';
import { initializePersistence } from './services/persistence.js';

Framework7.use(Framework7Vue);
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
registerComponents(app);

async function bootstrap() {
  await initializePersistence(pinia);
  app.mount('#app');
}

bootstrap().catch((error) => {
  console.error('TaskFlow: помилка запуску:', error);
  app.mount('#app');
});
