<script setup>
import { ref } from 'vue';

import Button from "@/components/ui/button/Button.vue";
import {Card, CardContent} from "@/components/ui/card/index.js";
import {BellRing, CircleUserRound, LifeBuoy, Cookie, UserCog, Cable} from "lucide-vue-next";



const sidebarNavItems = ref([
  {
    title: 'About Me',
    icon: CircleUserRound,
    href: '/account/aboutme',
  },
  {
    title: 'Security',
    icon: UserCog,
    href: '/account/security',
  },
  {
    title: 'Privacy',
    icon: Cookie,
    href: '/account/privacy',
  },
  {
    title: 'Notifications',
    icon: BellRing,
    href: '/account/notifications',
  },
  {
    title: 'Your Data',
    icon: LifeBuoy,
    href: '/account/yourdata',
  },
  {
    title: 'Connections',
    icon: Cable,
    href: '/account/connections',
  },
])
</script>

<template>
  <div class="w-[200px] h-full">
    <Card class="h-full" style="border-top-right-radius:0;border-bottom-right-radius:0;">
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
              variant="ghost"
              :class="{'bg-muted hover:bg-muted': $route.path === item.href}"
              class="w-full text-left justify-start text-md font-semibold"
              @click="navigate"
          >
            <component :is="item.icon" v-if="item.icon" class="pr-1" />
            {{ item.title }}
          </Button>
        </router-link>
      </nav>
      <br>
      <CardContent>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>

</style>