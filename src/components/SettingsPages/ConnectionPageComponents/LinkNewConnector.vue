<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import { useRoute } from 'vue-router'
import { useLogto } from '@logto/vue'
import { LoaderCircle } from "lucide-vue-next";

const route = useRoute()
const { getAccessToken } = useLogto();
const isLoading = ref(true);

const grabMfaOptions = async () => {
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/connectors/build-uri/${route.params.id}`,
        {
          "redirectUri": `${import.meta.env.VITE_ROOT}/connectors/link/${route.params.id.toLowerCase()}?action=callback`
        },
        {headers: {Authorization: `Bearer ${await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)}`, 'Content-Type': 'application/json'}}
    )
  } catch (error) {
    console.log(error);
  }
}

const connectorFlowControl = async () => {
  if (route.query.action === 'create') {
    await grabMfaOptions()
  }
}

onMounted(connectorFlowControl)
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="isLoading" class="flex flex-col items-center align-middle">
      <LoaderCircle :size="128" class="animate-spin" />
      <p class="font-bold text-2xl">Grabbing Connector Info...</p>
    </div>
  </div>
</template>

<style scoped>

</style>