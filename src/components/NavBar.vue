<script setup>
import Separator from "@/components/ui/separator/Separator.vue";

defineProps({
  userData: {
    type: Object,
    required: true,
  },
});

import { useLogto } from "@logto/vue";
import {
  Card,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const { signOut } = useLogto();
const onClickSignOut = () => signOut('http://127.0.0.1:5173/');
</script>

<template>
  <Card class="w-full h-[40px] flex items-center align-middle justify-between pl-2">
    <CardTitle class="text-xl">Account Dashboard</CardTitle>
    <div class="flex items-center align-middle">
      <div class="flex items-center align-middle">
        <Avatar id="avatar" class="w-7 h-7 mr-1">
          <AvatarImage :src="userData.picture" alt="{{ userData.username }}-avatar" />
          <AvatarFallback>{{ userData.username ? userData.username : userData.name }}</AvatarFallback>
        </Avatar>
        <Label for="avatar">Welcome, {{ userData.username ? userData.username : userData.name }}</Label>
      </div>
      <Separator orientation="vertical" class="ml-3 h-[25px] text-white " />
      <Button @click="onClickSignOut" variant="link">Log Out</Button>
      <Button as-child style="border-radius: var(--radius);border-top-left-radius:0;border-bottom-left-radius:0;">
        <a href="">
          Home
        </a>
      </Button>
    </div>
  </Card>
</template>