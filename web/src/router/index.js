import { createRouter, createWebHistory } from 'vue-router'
import { useLogto } from '@logto/vue'
import AccountsRoot from "@/components/Base/AccountsRoot.vue";
import {eventBus} from "@/lib/eventBus.js";

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
      path: '/account/',
      component: AccountsRoot,
      children: [
        {
          path: 'aboutme',
          name: 'Personal Information',
          component: () => import('@/handlers/PersonalInfo.vue')
        },
        {
          path: 'security',
          name: 'Sign-In & Security',
          component: () => import('@/handlers/SignIn&Security.vue')
        },
        {
          path: 'privacy',
          name: 'Privacy',
          component: () => import('@/handlers/Privacy.vue')
        },
        {
          path: 'dangerzone',
          name: 'Account Actions',
          component: () => import('@/handlers/DangerZone.vue')
        },
        {
          path: 'connections',
          name: 'Connections',
          component: () => import('@/handlers/Connections.vue')
        },
        {
          path: 'yourdata',
          name: 'Your Data',
          component: () => import('@/handlers/YourData.vue')
        },
        {
          path: 'developer',
          name: 'Developer options',
          component: () => import('@/handlers/DeveloperOptions.vue')
        },
      ]
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

router.beforeEach(async (to) => {
  const { isAuthenticated } = useLogto()
  if (!isAuthenticated.value && to.name !== 'login' && to.name !== 'callback') {
    return { name: 'login' }
  }
  if (to.name !== 'login' && to.name !== 'callback') {
    eventBus.emit('AccountLoading', true)
  }
})
router.afterEach(async(to) => {
  if (to.name !== 'login' && to.name !== 'callback') {
    eventBus.emit('AccountLoading', false)
  }
});

export default router
