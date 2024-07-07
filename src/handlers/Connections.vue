<script setup>
import { inject, onMounted, ref } from 'vue'
import {Card, CardDescription, CardTitle} from '@/components/ui/card/index.js'
import {DiscordIcon, GitHubIcon, GoogleIcon, SpotifyIcon} from 'vue3-simple-icons';
import ConnectorCard from '@/components/Pages/Connections/ConnectorCard.vue'
import { AlertOctagon, Cable } from 'lucide-vue-next'
import Skeleton from '../components/ui/skeleton/Skeleton.vue'
import axios from 'redaxios'
import { API } from '@/lib/apiRouteMap.js'
import { toast } from 'vue-sonner'
import { useLogto } from '@logto/vue'
import { Button } from '@/components/ui/button/index.js'

const { getAccessToken } = useLogto();
const userData = inject('userData');

const isLoading = ref(true);
const fetchFailure = ref(false);
const connectorConfig = ref({});


async function loadConnectorConfig() {
  fetchFailure.value = false
  isLoading.value = true
  try {
    const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
    connectorConfig.value = await axios.get(
      API.UTILS.CONNECTOR_CONFIG,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }})
  } catch (error) {
    console.log('error loading user information', error)
    toast.error('Error grabbing Connector Information:', {
      description: 'Service Unavailable. Try again later'
    })
    fetchFailure.value = true
  } finally {
    console.log(connectorConfig.value)
    isLoading.value = false
  }
}

onMounted(loadConnectorConfig)
</script>

<template>
  <div class="w-screen desktop:w-[600px] phone:px-4 tablet:px-32 ">
    <CardTitle class="my-4 flex">
      <Cable class="mr-1" />
      Connected Accounts
    </CardTitle>
    <CardDescription>
      Manage accounts and services you have linked to your account.
    </CardDescription>
    <div class="my-10" v-if="!isLoading">
      <div v-for="(connector) in connectorConfig" :key="connector.id">
        <ConnectorCard
          :linked="Boolean(userData.identities[connector.target.toLowerCase()])"
          :icon="connector.logo"
          :service="connector.name.en"
        />
      </div>
    </div>
    <div
      v-else-if="fetchFailure"
      class="flex flex-col items-center justify-center gap-y-3"
    >
      <AlertOctagon :size="72" color="darkred" />
      <p class="text-red-700 text-xl">Failed to grab connector information</p>
      <Button @click="loadConnectorConfig" variant="outline" class="h-8 w-20"> Retry </Button>
    </div>
    <div v-else>
      <div class="space-y-2">
        <Skeleton class="h-8 desktop:w-[300px]" />
        <Skeleton class="h-4 desktop:w-[525px]" />
        <Skeleton class="h-4 desktop:w-[200px] w-3/4" />
      </div>
      <div class="space-y-4 desktop:space-y-0 desktop:gap-4 mt-12">
        <Skeleton class="h-[150px] w-full rounded-xl" />
        <Skeleton class="h-[150px] w-full rounded-xl" />
        <Skeleton class="h-[150px] w-full rounded-xl" />
        <Skeleton class="h-[150px] w-full rounded-xl" />
      </div>
    </div>
    <CardTitle class="my-4">Authorised Applications</CardTitle>
    <CardDescription>
      Listed below are third parties with which you have authorized us to share some of your data.
    </CardDescription>
    <div class="mt-6">
      <Card class="w-full mb-4 p-4">
        <CardDescription class="flex gap-x-2">
          You do not have any Connected Applications
        </CardDescription>
      </Card>
    </div>
  </div>
</template>
