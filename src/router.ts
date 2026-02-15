import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { TRAINING_APPS } from './apps/registry'
import AppIndexPage from './pages/AppIndexPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

const appRoutes: RouteRecordRaw[] = TRAINING_APPS.map((app) => ({
  path: app.path,
  name: app.id,
  component: app.component,
  meta: {
    appId: app.id,
  },
}))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: AppIndexPage,
  },
  ...appRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
