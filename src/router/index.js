import { createRouter, createWebHistory } from 'vue-router'
import { useLogto } from "@logto/vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/oauth/login',
      name: 'login',
      component: () => import('@/views/AuthLoginView.vue'),
    },
    {
      path: '/oauth/callback',
      name: 'callback',
      component: () => import('@/views/AuthCallbackView.vue'),
    },
    {
      path: '/account/aboutme',
      name: 'Personal Information',
      component: () => import('@/views/AboutMeView.vue'),
    },
    {
      path: '/account/security',
      name: 'Sign-In & Security',
      component: () => import('@/views/SecurityView.vue'),
    },
    {
      path: '/account/privacy',
      name: 'Privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {
      path: '/account/notifications',
      name: 'Notifications',
      component: () => import('@/views/NotificationView.vue'),
    },
    {
      path: '/account/connections',
      name: 'Connections',
      component: () => import('@/views/ConnectionsView.vue'),
    },
    {
      path: '/account/yourdata',
      name: 'Your Data',
      component: () => import('@/views/DataDownloadView.vue'),
    },
  ]
})

router.beforeEach(async (to, from) => {
  const { isAuthenticated } = useLogto();
  if (!isAuthenticated.value && to.name !== 'login' && to.name !== 'callback') {
    return { name: 'login' }
  }
})

export default router
