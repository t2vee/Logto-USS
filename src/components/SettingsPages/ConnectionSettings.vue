<script setup>
import {inject, onMounted} from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GoogleIcon, DiscordIcon, SpotifyIcon, GitHubIcon } from 'vue3-simple-icons';
import ConnectorCard from '@/components/SettingsPages/ConnectionPageComponents/ConnectorCard.vue'

const userData = inject('userData')
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Connected Accounts</CardTitle>
    <CardDescription
      >Manage accounts and services you have linked to your MXS account.</CardDescription
    >
    <div class="my-10">
      <ConnectorCard
        :linked="Boolean(userData.identities.google)"
        image="https://cdn.vstatic.net/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Google.png"
        :icon="GoogleIcon"
        service="Google"
      />
      <ConnectorCard
        :linked="Boolean(userData.identities.discord)"
        image="https://cdn.vstatic.net/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Discord.png"
        :icon="DiscordIcon"
        service="Discord"
      />
      <ConnectorCard
        :linked="Boolean(userData.identities.Spotify)"
        image="https://cdn.vstatic.net/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/Logo_Spotify.png"
        :icon="SpotifyIcon"
        service="Spotify"
      />
      <ConnectorCard
        :linked="Boolean(userData.identities.github)"
        image="https://cdn.vstatic.net/content/kLhJNvxNYHqnH0J7zHy2/vee.city/Images/Optimised/GitHub_Logo_White.png"
        :icon="GitHubIcon"
        service="Github"
      />
    </div>
    <CardTitle class="my-4">Authorised Applications</CardTitle>
    <CardDescription
      >Listed below are third parties with which you have authorized MXS to share some of your
      data.</CardDescription
    >
    <div class="mt-12"></div>
  </div>
</template>
