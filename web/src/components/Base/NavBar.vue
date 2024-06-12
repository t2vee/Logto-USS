<script setup>
import { ref } from 'vue'
import { useLogto } from '@logto/vue'
import { useRoute } from 'vue-router'
import { CardTitle } from '@/components/ui/card/index.js'
import { Button } from '@/components/ui/button/index.js'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb/index.js'
import {DoorOpen, LogOut, Sun, Moon} from 'lucide-vue-next';

const { signOut } = useLogto()
const route = useRoute()
const pathName = ref('')
pathName.value = route.name
const onClickSignOut = () => signOut(import.meta.env.VITE_ROOT)

import { useDark } from "@vueuse/core";
const isDark = useDark({
  selector: 'html',
})
function changeTheme() {
  isDark.value = !isDark.value;
}
</script>

<template>
  <div class="min-h-12 min-w-[852px]"></div>
  <div class="w-full h-12 flex align-middle items-center justify-between">
    <CardTitle class="text-xl">Account Dashboard</CardTitle>
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/"> Home </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/account/aboutme"> My Account </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ pathName }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="flex align-middle space-x-1">
      <Button
          class="h-8 w-9 rounded-xl border"
          variant="secondary"
          size="icon"
          @click="changeTheme"
      >
        <Sun v-if="isDark" color="black" />
        <Moon v-else />
      </Button>
      <Button @click="onClickSignOut" class="h-8 rounded-xl border">
        <DoorOpen :stroke-wdth="2.25" color="black" class="pr-1.5"  />
        Log Out
      </Button>
    </div>
  </div>
  <div class="min-h-12"></div>
</template>
