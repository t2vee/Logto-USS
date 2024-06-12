<script setup>
import {inject, ref} from 'vue'

import Button from '../ui/button/Button.vue'
import {AlertTriangle, Cable, CircleUserRound, Code, Cookie, LifeBuoy, UserCog} from 'lucide-vue-next'
import AvatarEditor from '@/components/Base/Avatar/AvatarEditor.vue'

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
import { useDark } from "@vueuse/core";
const isDark = useDark({
  selector: 'html',
})
</script>

<template>
  <div class="flex flex-col h-full items-center w-[175px]">
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
              ? 'text-black dark:text-cyan-200 bg-muted font-bold'
              : 'text-black dark:text-white hover:bg-muted'
          "
          class="w-[185px] text-left justify-start"
          @click="handleNav(navigate, item.href, $route.path)"
        >
          <component :is="item.icon" v-if="item.icon" class="pr-1.5" :color="$route.path === item.href ? ( isDark ? 'rgb(165 243 252)' : 'black' ) : ( isDark ? '' : 'black' )" />
          {{ item.title }}
        </Button>
      </router-link>
    </nav>
  </div>
</template>

<style scoped></style>
