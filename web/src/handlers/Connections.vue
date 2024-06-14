<script setup>
import {inject} from 'vue'
import { Card, CardDescription, CardTitle } from '@/components/ui/card/index.js'
import { GoogleIcon, DiscordIcon, SpotifyIcon, GitHubIcon } from 'vue3-simple-icons';
import ConnectorCard from '@/components/Pages/Connections/ConnectorCard.vue'
import {Cable} from "lucide-vue-next";

const userData = inject('userData')
</script>

<template>
  <div class="w-screen desktop:w-[600px] phone:px-12 tablet:px-32 ">
    <CardTitle class="my-4 flex">
      <Cable class="mr-1" />
      Connected Accounts
    </CardTitle>
    <CardDescription>
      Manage accounts and services you have linked to your account.
    </CardDescription>
    <div class="my-10">
      <ConnectorCard
        :linked="Boolean(userData.identities.google)"
        :icon="GoogleIcon"
        service="Google"
      />
      <ConnectorCard
        :linked="Boolean(userData.identities.discord)"
        :icon="DiscordIcon"
        service="Discord"
      />
      <ConnectorCard
        disabled
        :linked="Boolean(userData.identities.Spotify)"
        :icon="SpotifyIcon"
        service="Spotify"
      />
      <ConnectorCard
        :linked="Boolean(userData.identities.github)"
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
