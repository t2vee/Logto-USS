<script setup>
import { ref, onMounted, provide, onUnmounted } from 'vue'
import { CardContent } from '@/components/ui/card/index.js'
import SideBar from '@/components/Base/SideBar.vue'
import NavBar from '@/components/Base/NavBar.vue'
import { Button } from '@/components/ui/button/index.js'
import { Loader, AlertOctagon } from 'lucide-vue-next'
import { eventBus } from '@/lib/eventBus.js'
import { toast } from 'vue-sonner'
import { useAPI } from "@/lib/api/useAPI.js";

const { API, UIStateHandler, getAccessToken, coreResource, fetchUserInfo } = useAPI()

const userInfo = ref({})
const isLoading = ref(true)
const fetchFailure = ref(false)

const support = `mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`
const webBuild = `prod/${import.meta.env.VITE_COMMIT_HASH.length > 7 ? import.meta.env.VITE_COMMIT_HASH.substring(0, 7) : import.meta.env.VITE_COMMIT_HASH}`

defineProps({
  page: {
    type: Object,
    required: true
  }
})

const handleEvent = (data) => {
  if (data) {
    loadData()
  }
}

async function loadData() {
  isLoading.value = true;
  fetchFailure.value = false;
  userInfo.value = await API.UserData(await getAccessToken(coreResource, undefined),
      new UIStateHandler({
        always: {
          refs: {
            isLoading: isLoading,
          }
        },
        error: {
          onDefault: {
            events: {
              toast: () => toast.error('Error grabbing User Information:', {description: 'Service Unavailable. Try again later'}),
            },
            refs: {
              fetchFailure: fetchFailure,
            }
          }
        }
      }),
      await fetchUserInfo()
  )
}

provide('userData', userInfo)

onMounted(loadData)
const cleanup = eventBus.on('refreshUserData', handleEvent)
onUnmounted(cleanup)
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col h-screen max-w-[1000px] items-center">
      <NavBar />
      <div v-if="!fetchFailure && !isLoading && userInfo.email" class="flex justify-between gap-6">
        <SideBar />
        <div class="flex-1 flex-grow overflow-auto">
          <CardContent>
            <component :is="page" />
          </CardContent>
        </div>
      </div>
      <div v-else-if="isLoading" class="w-full">
        <div class="flex items-center align-middle justify-center">
          <Loader class="animate-spin" />Loading user information...
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