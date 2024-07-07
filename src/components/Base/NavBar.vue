<script setup>
import {ref} from 'vue'
import {useLogto} from '@logto/vue'
import {useRoute} from 'vue-router'
import {CardTitle} from '@/components/ui/card/index.js'
import {Button} from '@/components/ui/button/index.js'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb/index.js'
import {Sheet, SheetContent, SheetTrigger,} from '@/components/ui/sheet'
import {DoorOpen, Menu, Moon, Sun} from 'lucide-vue-next';
import {useDark, useMediaQuery} from "@vueuse/core";
import SideBar from "@/components/Base/SideBar.vue";

const { signOut } = useLogto()
const route = useRoute()
const pathName = ref('')
pathName.value = route.name
const onClickSignOut = () => signOut(import.meta.env.VITE_ROOT)

const isDark = useDark({
  selector: 'html',
})
function changeTheme() {
  isDark.value = !isDark.value;
}
const isDesktop = useMediaQuery('(min-width: 1023px)')

const isSheetOpen = ref(false)
</script>

<template>
  <div v-if="isDesktop" class="min-h-12 min-w-[852px]"></div>
  <div class="w-full h-12 flex align-middle items-center justify-between border-b-2 mobile:py-5 phone:px-8 tablet:px-32">
    <Sheet v-if="!isDesktop" v-model:open="isSheetOpen">
      <SheetTrigger as-child>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SideBar v-model="isSheetOpen"/>
      </SheetContent>
    </Sheet>
    <CardTitle class="text-xl" v-if="isDesktop">My Account Dashboard</CardTitle>
    <Breadcrumb v-if="isDesktop">
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
    <div class="flex align-middle desktop:space-x-1">
      <Button
          class="desktop:h-8 w-9 rounded-xl border tablet:rounded-sm"
          variant="secondary"
          size="icon"
          @click="changeTheme"
      >
        <Sun v-if="isDark" color="black" />
        <Moon v-else />
      </Button>
      <Button @click="onClickSignOut" class="desktop:h-8 rounded-xl border tablet:rounded-sm">
        <DoorOpen :stroke-wdth="2.25" color="black" class="pr-1.5"  />
        Log Out
      </Button>
    </div>
  </div>
  <div class="min-h-12"></div>
</template>
