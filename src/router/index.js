import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },

    {
      path: '/score-query',
      name: 'score-query',
      component: () => import('../views/ScoreQueryView.vue')
    },
    {
      path: '/add-score/:xh?',
      name: 'add-score',
      component: () => import('../views/ScoreAddView.vue')
    },
    {
      path: '/delete-score',
      name: 'delete-score',
      component: () => import('../views/DeleteScoreView.vue'),
    },
    {
      path: '/edit-score',
      name: 'edit-score',
      component: () => import('../views/EditScoreView.vue'),
    },
    {
      path: '/score-sort',
      name: 'score-sort',
      component: () => import('../views/ScoreSortView.vue'),
    },
  ],
})

export default router
