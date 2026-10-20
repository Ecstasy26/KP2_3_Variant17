import HomePage from './pages/HomePage.vue';
import TasksPage from './pages/TasksPage.vue';
import AboutPage from './pages/AboutPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/tasks/', component: TasksPage },

  { path: '/about/', component: AboutPage },
];
export default routes;
