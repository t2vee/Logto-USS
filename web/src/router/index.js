import { createRouter, createWebHistory } from 'vue-router'
import { useLogto } from '@logto/vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/oauth/login',
      name: 'login',
      component: () => import('@/views/OAuthLogin.vue')
    },
    {
      path: '/oauth/callback',
      name: 'callback',
      component: () => import('@/views/OAuthCallback.vue')
    },
    {
      path: '/:action/connectors/:connector',
      name: 'Connector Link Callback',
      component: () => import('@/views/Window/LinkConnector.vue')
    },
    {
      path: '/oauth/connectors/:action/:connector',
      name: 'Link New Connector',
      component: () => import('@/views/Window/LinkConnector.vue')
    },
    {
      path: '/account/aboutme',
      name: 'Personal Information',
      component: () => import('@/views/PersonalInfo.vue')
    },
    {
      path: '/account/security',
      name: 'Sign-In & Security',
      component: () => import('@/views/SignIn&Security.vue')
    },
    {
      path: '/account/privacy',
      name: 'Privacy',
      component: () => import('@/views/Privacy.vue')
    },
    {
      path: '/account/dangerzone',
      name: 'Account Actions',
      component: () => import('@/views/DangerZone.vue')
    },
    {
      path: '/account/connections',
      name: 'Connections',
      component: () => import('@/views/Connections.vue')
    },
    {
      path: '/account/yourdata',
      name: 'Your Data',
      component: () => import('@/views/YourData.vue')
    },
    {
      path: '/account/developer',
      name: 'Developer options',
      component: () => import('@/views/YourData.vue')
    },
    {
      path: '/legal',
      redirect: import.meta.env.VITE_LEGAL_URL,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/router/CatchAll/404.vue')
    },
  ]
})

router.beforeEach(async (to, from) => {
  const { isAuthenticated } = useLogto()
  if (!isAuthenticated.value && to.name !== 'login' && to.name !== 'callback') {
    return { name: 'login' }
  }
})

export default router
