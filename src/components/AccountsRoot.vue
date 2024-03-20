<script setup>
import { useLogto } from "@logto/vue";
import {ref, onMounted, computed, provide, onUnmounted} from "vue";
import { CardContent } from '@/components/ui/card';
import SideBar from "@/components/SIdeBar.vue";
import NavBar from "@/components/NavBar.vue";
import BreadCrumb from "@/components/PageComponents/BreadCrumb.vue";
import FooterBar from "@/components/FooterBar.vue";
import { Loader, Loader2 } from 'lucide-vue-next';
import SocialIdentityLoginBanner from "@/components/PageComponents/SocialIdentityLoginBanner.vue";
import { eventBus } from '@/lib/eventBus.js';

const { getIdTokenClaims, fetchUserInfo } = useLogto();
const userId = ref();
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
    userId.value = claims.sub;
    userInfo.value = await fetchUserInfo();
    if (userInfo.value.identities.discord || userInfo.value.identities.github || userInfo.value.identities.google) {
      userConnectorPresent.value = true;
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadData);

const readyUserInfo = computed(() => userInfo.value ? userInfo.value : null);

defineProps({
  page: {
    type: Object,
    required: true,
  },
});

provide('userData', userInfo)
provide('userConnectorPresent', userConnectorPresent)

const cleanup = eventBus.on('refreshUserData', handleEvent);
onUnmounted(cleanup);
</script>

<template>
  <div v-if="!isLoading" class="flex flex-col h-screen">
    <NavBar :user-data="readyUserInfo" />
    <BreadCrumb class="m-0.5" />
    <div>
      <div class="flex gap-1 p-4">
        <SideBar />
        <div class="flex-1 flex-grow overflow-auto">
          <CardContent>
            <SocialIdentityLoginBanner v-if="userConnectorPresent" :user-connector="readyUserInfo.identities" />
            <component :is="page" />
          </CardContent>
        </div>
      </div>
    </div>
    <FooterBar class="mt-auto" />
  </div>
  <div v-else-if="isLoading" class="flex items-center align-middle">
    <Loader class="animate-spin"/>Loading user information...
  </div>
</template>

<style scoped>

</style>