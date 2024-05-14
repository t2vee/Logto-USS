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
const onClickSignIn = () => signIn(`${import.meta.env.BASE_URL}/oauth/callback`);
</script>

<template>
  <div class="flex flex-col items-center mt-24">
    <div class="flex flex-col items-center">
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
      <div v-else class="flex flex-col items-center">
        <Card class="w-[350px]">
          <CardHeader>
            <CardTitle>Login To Your Account Dashboard 👉</CardTitle>
            <CardDescription>To access and modify settings and support tickets you must be authenticated.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button @click="onClickSignIn">
              <KeyRound color="black" style="padding-right:5px;" />
              <strong class="text-black">Login With MXS AuthGateway</strong>
              <ExternalLink color="black" style="padding-left:5px;" />
            </Button>
          </CardContent>
        </Card>
        <p class="text-xs text-gray-500 mt-8">MXS Online Services @ 2024 || Web Build 90a6f1e - API Build 144b5bc</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>