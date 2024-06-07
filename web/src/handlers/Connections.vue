<script setup>
import {inject} from 'vue'
import { Card, CardDescription, CardTitle } from '@/components/ui/card/index.js'
import { GoogleIcon, DiscordIcon, SpotifyIcon, GitHubIcon } from 'vue3-simple-icons';
import ConnectorCard from '@/components/Pages/Connections/ConnectorCard.vue'

const userData = inject('userData')
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Connected Accounts</CardTitle>
    <CardDescription>
      Manage accounts and services you have linked to your account.
    </CardDescription>
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
        disabled
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
      >Listed below are third parties with which you have authorized us to share some of your
      data.</CardDescription
    >
    <div class="mt-6">
      <Card class="w-full mb-4 p-4">
        <CardDescription class="flex gap-x-2">
          You do not have any Connected Applications
        </CardDescription>
      </Card>
    </div>
  </div>
</template>
