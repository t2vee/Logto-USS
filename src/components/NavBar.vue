<script setup>
import { ref } from 'vue'
import { useLogto } from '@logto/vue'
import { useRoute } from 'vue-router'
import { CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {DoorOpen, LogOut} from 'lucide-vue-next';

const { signOut } = useLogto()
const route = useRoute()
const pathName = ref('')
pathName.value = route.name
const onClickSignOut = () => signOut(import.meta.env.VITE_ROOT)
</script>

<template>
  <div class="min-h-12 min-w-[852px]"></div>
  <div class="w-full h-12 flex align-middle items-center justify-between">
    <CardTitle class="text-xl">Account Dashboard</CardTitle>
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="https://mxs.app"> Home </BreadcrumbLink>
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
    <Button @click="onClickSignOut" class="h-8 rounded-xl"> Log Out<LogOut :stroke-wdth="2.25" color="black" class="pl-1.5"  /></Button>
  </div>
  <div class="min-h-12"></div>
</template>
