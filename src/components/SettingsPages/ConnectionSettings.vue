<script setup>
import { inject } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ConnectorCard from "@/components/SettingsPages/ConnectionPageComponents/ConnectorCard.vue";

const userData = inject('userData')


</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Connected Accounts</CardTitle>
    <CardDescription>Manage accounts and services you have linked to your MXS account.</CardDescription>
    <div class="mt-12">
      <ConnectorCard :linked="!!userData.identities.google" image="https://cdn.mxs.app/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Google.png" service="Google" />
      <ConnectorCard :linked="!!userData.identities.discord" image="https://cdn.mxs.app/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Discord.png" service="Discord" />
      <ConnectorCard :linked="!!userData.identities.Spotify" image="https://cdn.mxs.app/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Spotify.png" service="Spotify" />
      <ConnectorCard :linked="!!userData.identities.github" image="https://cdn.mxs.app/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/GitHub_Logo_White.png" service="Github" />
    </div>
  </div>
</template>

<style scoped>

</style>