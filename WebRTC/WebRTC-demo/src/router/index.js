import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/demo01',
      name: 'demo01',
      component: () => import('@/views/demo01.vue')
    },
    {
      path: '/demo02',
      name: 'demo02',
      component: () => import('@/views/demo02.vue')
    },
    {
      path: '/demo03-one2one',
      name: 'demo03-one2one',
      component: () => import('@/views/demo03-one2one.vue')
    }
  ]
})

export default router
