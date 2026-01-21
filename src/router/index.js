import { createRouter, createWebHistory } from 'vue-router';
import { useSettingsStore } from '../stores/settings';

const routes = [
  {
    path: '/',
    redirect: '/insert',
  },
  {
    path: '/insert',
    name: 'Insert',
    component: () => import('../views/InsertView.vue'),
  },
  {
    path: '/studio',
    name: 'Studio',
    component: () => import('../views/Win98View.vue'),
  },
  {
    path: '/win',
    redirect: '/studio',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const settingsStore = useSettingsStore();

  if (to.name === 'Insert') {
    settingsStore.setAppMode('insert');
  } else if (to.name === 'Studio') {
    settingsStore.setAppMode('win98');
  }

  next();
});

export default router;
