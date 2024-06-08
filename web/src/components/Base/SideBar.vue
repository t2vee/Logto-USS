<script setup>
import { defineAsyncComponent, ref, inject } from 'vue'

import Button from '../ui/button/Button.vue'
import { AlertTriangle, CircleUserRound, LifeBuoy, Cookie, UserCog, Cable, Code, Loader } from 'lucide-vue-next'
const AvatarEditor = defineAsyncComponent(() => import('@/components/Base/Avatar/AvatarEditor.vue'))
const userData = inject('userData')

const isLoading = ref('')
const sidebarNavItems = ref([
  {
    title: 'Personal Info',
    icon: CircleUserRound,
    href: '/account/aboutme'
  },
  {
    title: 'Sign-In & Security',
    icon: UserCog,
    href: '/account/security'
  },
  {
    title: 'Privacy Settings',
    icon: Cookie,
    href: '/account/privacy'
  },
  {
    title: 'Connections',
    icon: Cable,
    href: '/account/connections'
  },
  {
    title: 'Your Data',
    icon: LifeBuoy,
    href: '/account/yourdata'
  },
  {
    title: 'Account Actions',
    icon: AlertTriangle,
    href: '/account/dangerzone'
  },
  {
    title: 'Developer Options',
    icon: Code,
    href: '/account/developer'
  }
])

const handleNav = (navigate, page, key) => {
  if (page !== key) {
    isLoading.value = page;
  }
  navigate();
};
</script>

<template>
  <div class="flex flex-col h-full items-center">
    <AvatarEditor
      :avatar-url="userData.avatar"
      :user-name="userData.username ? userData.username : userData.name"
    />
    <strong>{{ userData.name ? userData.name : userData.username }}</strong>
    <p class="text-sm text-gray-500">
      {{
        userData.email.length > 20
          ? userData.email.substring(0, 20) + '...'
          : userData.email
      }}
    </p>
    <p class="text-xs text-gray-700 mb-8">{{ userData.sub }}</p>
    <nav class="flex flex-col space-x-0 space-y-1">
      <router-link
        v-for="item in sidebarNavItems"
        :key="item.title"
        :to="item.href"
        custom
        v-slot="{ navigate }"
      >
        <Button
          as="button"
          variant="link"
          :class="
            $route.path === item.href
              ? 'text-cyan-200 bg-muted font-bold hover:bg-muted'
              : 'text-white'
          "
          class="w-full text-left justify-start"
          @click="handleNav(navigate, item.href, $route.path)"
        >
          <component :is="isLoading === item.href ? Loader : item.icon" v-if="item.icon" :class="isLoading === item.href ? 'animate-spin' : 'pr-1.5'" :color="$route.path === item.href ? 'rgb(165 243 252)' : ''" />
          {{ item.title }}
        </Button>
      </router-link>
    </nav>
  </div>
</template>

<style scoped></style>
