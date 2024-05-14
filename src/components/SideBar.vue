<script setup>
import { defineAsyncComponent, ref, inject } from 'vue'

import Button from '@/components/ui/button/Button.vue'
import { Card, CardContent } from '@/components/ui/card/index.js'
import { AlertTriangle, CircleUserRound, LifeBuoy, Cookie, UserCog, Cable } from 'lucide-vue-next'
const AvatarEditor = defineAsyncComponent(
  () => import('@/components/SettingsPages/AboutMePageComponents/AvatarComponents/AvatarEditor.vue')
)
const userData = inject('userData')

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
    title: 'Privacy',
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
  }
])
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
        userData.primaryEmail.length > 20
          ? userData.primaryEmail.substring(0, 20) + '...'
          : userData.primaryEmail
      }}
    </p>
    <p class="text-xs text-gray-700 mb-8">{{ userData.sub }}</p>
    <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
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
          @click="navigate"
        >
          <component :is="item.icon" v-if="item.icon" class="pr-1.5" />
          {{ item.title }}
        </Button>
      </router-link>
    </nav>
  </div>
</template>

<style scoped></style>
