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
    <div class="my-10">
      <ConnectorCard :linked="!!userData['identities.google']" image="https://cdn.vstatic.net/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Google.png" service="Google" />
      <ConnectorCard :linked="!!userData['identities.discord']" image="https://cdn.vstatic.net/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Discord.png" service="Discord" />
      <ConnectorCard :linked="!!userData['identities.spotify']" image="https://cdn.vstatic.net/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Spotify.png" service="Spotify" />
      <ConnectorCard :linked="!!userData['identities.github']" image="https://cdn.vstatic.net/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/GitHub_Logo_White.png" service="Github" />
    </div>
    <CardTitle class="my-4">Authorised Applications</CardTitle>
    <CardDescription>Listed below are third parties with which you have authorized MXS to share some of your data.</CardDescription>
    <div class="mt-12">

    </div>
  </div>
</template>

<style scoped>

</style>