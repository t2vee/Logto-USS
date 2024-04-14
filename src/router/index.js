import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue';
import { useLogto } from "@logto/vue";
import LoginView from '@/views/AuthLoginView.vue'
import AuthCallbackView from "@/views/AuthCallbackView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/callback',
      name: 'callback',
      component: AuthCallbackView,
    },
    {
      path: '/',
      name: 'account',
      component: () => import('@/components/AccountsRoot.vue'),
    },
    {
      path: '/account/aboutme',
      name: 'aboutme',
      component: () => import('@/views/AccountViews/AboutMeView.vue'),
    },
    {
      path: '/account/security',
      name: 'security',
      component: () => import('@/views/AccountViews/SecurityView.vue'),
    },
    {
      path: '/account/privacy',
      name: 'privacy',
      component: defineAsyncComponent(() => import('@/views/AccountViews/PrivacyView.vue')),
    },
    {
      path: '/account/notifications',
      name: 'notifications',
      component: defineAsyncComponent(() => import('@/views/AccountViews/NotificationView.vue')),
    },
    {
      path: '/account/yourdata',
      name: 'yourdata',
      component: defineAsyncComponent(() => import('@/views/AccountViews/NotificationView.vue')),
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
