<script setup>
import { useLogto } from '@logto/vue'
import { ref, onMounted, provide, onUnmounted } from 'vue'
import { CardContent } from '@/components/ui/card/index.js'
import SideBar from '@/components/Base/SideBar.vue'
import NavBar from '@/components/Base/NavBar.vue'
import { Button } from '@/components/ui/button/index.js'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import { Loader, AlertOctagon } from 'lucide-vue-next'
import { eventBus } from '@/lib/eventBus.js'
import axios from 'axios'
import { toast } from 'vue-sonner'
import {RouterView} from "vue-router";

const { fetchUserInfo, getAccessToken, isAuthenticated } = useLogto()
const userInfo = ref(null)
const isLoading = ref(true)
const isSubPageLoading = ref(false)
const fetchFailure = ref(false)

const support = `mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`
const webBuild = `prod/${import.meta.env.VITE_COMMIT_HASH.length > 7 ? import.meta.env.VITE_COMMIT_HASH.substring(0, 7) : import.meta.env.VITE_COMMIT_HASH}`

async function loadData() {
  if (!isAuthenticated) { window.location.replace("/oauth/login") }
  fetchFailure.value = false
  isLoading.value = true
  try {
    const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
    const logtoRepsonse = await fetchUserInfo()
    const response = await axios.get(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/extended-user-info`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    userInfo.value = Object.assign(response.data, logtoRepsonse)
  } catch (error) {
    console.log('error loading user information', error)
    toast.error('Error grabbing User Information:', {
      description: 'Service Unavailable. Try again later'
    })
    fetchFailure.value = true
  } finally {
    isLoading.value = false
  }
}

const handleRefresh = (data) => {
  if (data) {
    loadData()
  }
}

const handleLoading = (data) => {
  console.log(data)
  isSubPageLoading.value = data
}

onMounted(loadData)

provide('userData', userInfo)

const cleanup = eventBus.on('refreshUserData', handleRefresh)
eventBus.on('AccountLoading', handleLoading)
onUnmounted(cleanup)
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col h-screen max-w-[1000px] items-center">
      <NavBar />
      <div v-if="!fetchFailure && !isLoading" class="flex justify-between gap-6">
        <SideBar />
        <div class="flex-1 flex-grow overflow-auto">
          <CardContent v-if="!isSubPageLoading">
            <RouterView />
          </CardContent>
          <div v-if="isSubPageLoading" class="flex flex-col items-center align-middle justify-center space-y-4 w-[600px]">
            <div class="space-y-2">
              <Skeleton class="h-8 w-[300px]" />
              <Skeleton class="h-4 w-[525px]" />
              <Skeleton class="h-4 w-[200px]" />
            </div>
            <div class="flex space-x-4">
              <Skeleton class="h-[150px] w-[250px] rounded-xl" />
              <Skeleton class="h-[150px] w-[250px] rounded-xl" />
            </div>
            <div class="flex space-x-4">
              <Skeleton class="h-[150px] w-[250px] rounded-xl" />
              <Skeleton class="h-[150px] w-[250px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else-if="fetchFailure && !isLoading"
        class="flex flex-col items-center justify-center gap-y-3"
      >
        <AlertOctagon :size="72" color="darkred" />
        <p class="text-red-700 text-xl">Failed to grab User information</p>
        <Button @click="loadData" variant="outline" class="h-8 w-20"> Retry </Button>
      </div>
      <div class="flex w-full items-center align-middle justify-between">
        <p class="text-xs text-gray-500 mt-8">
          MXS Account Dashboard @ 2024 - Web Version {{ webBuild }}
        </p>
        <a class="text-xs text-gray-500 mt-8" :href="support">Contact Support</a>
      </div>
    </div>
  </div>
</template>