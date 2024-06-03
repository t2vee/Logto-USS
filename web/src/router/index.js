import { createRouter, createWebHistory } from 'vue-router'
import { useLogto } from '@logto/vue'

import OAuthLogin from '@/views/OAuthLogin.vue'
import OAuthCallback from '@/views/OAuthCallback.vue'
import LinkConnector from '@/views/Window/LinkConnector.vue'
import PersonalInfo from '@/views/PersonalInfo.vue'
import SignInAndSecurity from '@/views/SignIn&Security.vue'
import Privacy from '@/views/Privacy.vue'
import DangerZone from '@/views/DangerZone.vue'
import Connections from '@/views/Connections.vue'
import YourData from '@/views/YourData.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/oauth/login',
      name: 'login',
      component: OAuthLogin
    },
    {
      path: '/oauth/callback',
      name: 'callback',
      component: OAuthCallback
    },
    {
      path: '/:action/connectors/:connector',
      name: 'Connector Link Callback',
      component: LinkConnector
    },
    {
      path: '/oauth/connectors/:action/:connector',
      name: 'Link New Connector',
      component: LinkConnector
    },
    {
      path: '/account/aboutme',
      name: 'Personal Information',
      component: PersonalInfo
    },
    {
      path: '/account/security',
      name: 'Sign-In & Security',
      component: SignInAndSecurity
    },
    {
      path: '/account/privacy',
      name: 'Privacy',
      component: Privacy
    },
    {
      path: '/account/dangerzone',
      name: 'Account Actions',
      component: DangerZone
    },
    {
      path: '/account/connections',
      name: 'Connections',
      component: Connections
    },
    {
      path: '/account/yourdata',
      name: 'Your Data',
      component: YourData
    },
    {
      path: '/account/developer',
      name: 'Developer options',
      component: YourData
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
