<script setup>
import { useLogto } from "@logto/vue";
import { CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const { signOut } = useLogto();
const onClickSignOut = () => signOut('http://127.0.0.1:5173/');
</script>

<template>
  <div class="min-h-12 min-w-[852px]"></div>
  <div class="w-full h-12 flex align-middle items-center justify-between">
    <CardTitle class="text-xl">Account Dashboard</CardTitle>
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/account">
            My Account
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Personal Information</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Button @click="onClickSignOut" class="h-8 rounded-xl">
      Log Out
    </Button>
  </div>
  <div class="min-h-12"></div>
</template>