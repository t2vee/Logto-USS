<script setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, KeyRound, Copyright } from "lucide-vue-next";

import { useLogto } from "@logto/vue";
const { signIn, isAuthenticated } = useLogto();
const onClickSignIn = () => signIn('http://127.0.0.1:5173/callback');
</script>

<template>
  <div v-if="isAuthenticated">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>You are already signed in!</CardTitle>
      </CardHeader>
      <CardContent>
        <Button as-child>
          <a href="/">
            <strong>Return to Home</strong>
          </a>
        </Button>
      </CardContent>
      <CardFooter>
        <Copyright /> Vee @ 2024
      </CardFooter>
    </Card>
  </div>
  <div v-else>
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Login To Your Account Dashboard 👉</CardTitle>
        <CardDescription>To access and modify settings and support tickets you must be authenticated.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button @click="onClickSignIn">
          <KeyRound style="fill: black;padding-right:5px;" />
          <strong>Login With MXS AuthGateway</strong>
          <ExternalLink style="padding-left:5px;" />
        </Button>
      </CardContent>
      <CardFooter>
        <Copyright class="pr-1.5" /> Vee @ 2024
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
</style>