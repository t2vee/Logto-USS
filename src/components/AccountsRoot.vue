<script setup>
import { useLogto } from "@logto/vue";
import {ref, onMounted, provide, onUnmounted} from "vue";
import { CardContent } from '@/components/ui/card';
import SideBar from "@/components/SIdeBar.vue";
import NavBar from "@/components/NavBar.vue";
import { Loader, Loader2 } from 'lucide-vue-next';
import { eventBus } from '@/lib/eventBus.js';
import axios from "axios";
import {toast} from "vue-sonner";

const { getIdTokenClaims, fetchUserInfo, getAccessToken } = useLogto();
const userInfo = ref(null);
const isLoading = ref(true);
const userConnectorPresent = ref(false);

const handleEvent = (data) => {
  if (data) {
    loadData()
  }
};
async function loadData() {
  try {
    const claims = await getIdTokenClaims();
    const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
    const logtoRepsonse = await fetchUserInfo();
    const response = await axios.get(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/${claims.sub}/extended-user-info`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    userInfo.value = Object.assign(response, logtoRepsonse)
    if (userInfo.value.identities.discord || userInfo.value.identities.github || userInfo.value.identities.google) {
      userConnectorPresent.value = true;
    }
  } catch (error) {
    toast.error('Error grabbing User Information:',{description: 'Service Unavailable. Try again later'})
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadData);

defineProps({
  page: {
    type: Object,
    required: true,
  },
});

provide('userData', userInfo)
provide('moreUserData', )
provide('userConnectorPresent', userConnectorPresent)

const cleanup = eventBus.on('refreshUserData', handleEvent);
onUnmounted(cleanup);
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col h-screen max-w-[1000px] items-center">
      <NavBar />
      <div v-if="!isLoading" class="flex justify-between gap-6">
        <SideBar />
          <div class="flex-1 flex-grow overflow-auto">
            <CardContent>
              <component :is="page" />
            </CardContent>
          </div>
      </div>
      <div v-else-if="isLoading" class="w-full">
        <div class="flex items-center align-middle justify-center">
          <Loader class="animate-spin"/>Loading user information...
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-8">MXS Online Services @ 2024 || Web Build 90a6f1e - API Build 144b5bc</p>
    </div>
    <!--<FooterBar class="mt-auto" />-->
  </div>
</template>

<style scoped>

</style>