<script setup>
import {inject, ref} from 'vue'

import Button from '../ui/button/Button.vue'
import {AlertTriangle, Cable, CircleUserRound, Code, Cookie, LifeBuoy, Cog} from 'lucide-vue-next'
import AvatarEditor from '@/components/Base/Avatar/AvatarEditor.vue'

const sheetOpen = defineModel()

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
    icon: Cog,
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
  if (sheetOpen.value) {
    sheetOpen.value = false
  }
  navigate();
};
import { useDark, useMediaQuery } from "@vueuse/core";
const isDark = useDark({
  selector: 'html',
})
const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <div class="flex flex-col h-full items-center desktop:w-[175px]">
    <AvatarEditor
      :avatar-url="userData.avatar"
      :user-name="userData.username ? userData.username : userData.name"
    />
    <strong class="text-center">{{ userData.name ? userData.name : userData.username }}</strong>
    <p class="text-sm text-gray-500">
      {{
        userData.email.length > 20
          ? userData.email.substring(0, 20) + '...'
          : userData.email
      }}
    </p>
    <p class="text-xs text-gray-700 mb-8">{{ userData.sub }}</p>
    <nav class="flex flex-col space-x-0 desktop:space-y-1 tablet:space-y-4">
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
          :size="isDesktop ? 'default' : 'lg'"
          :class="
            $route.path === item.href
              ? 'text-black dark:text-cyan-200 bg-muted font-bold'
              : 'text-black dark:text-white hover:bg-muted'
          "
          class="desktop:w-[185px] tablet:text-xl text-left justify-start"
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
