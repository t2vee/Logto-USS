<script setup>
import axios from 'redaxios';
import {onMounted, ref} from "vue";
import {useRoute} from 'vue-router'
import {useLogto} from '@logto/vue'
import {LoaderCircle} from "lucide-vue-next";
import {API} from "@/lib/apiRouteMap.js";

const route = useRoute()
const { getAccessToken } = useLogto();
const isLoading = ref(true);
const loaderText = ref('Loading...')

const redirectToBuiltUri = async () => {
  loaderText.value = 'Grabbing Connector Info...';
  try {
    const response = await axios.post(
        API.CONNECTORS.BUILD_URI(route.params.connector),
        {
          "redirectUri": `${import.meta.env.VITE_ROOT}/callback/connectors/${route.params.connector}`
        },
        {headers: {Authorization: `Bearer ${await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)}`, 'Content-Type': 'application/json'}}
    )
    if (response.status === 200) {
      loaderText.value = 'Redirecting You To ' + route.params.connector;
      await new Promise((resolve) => setTimeout(resolve, 2000))
      window.location.replace(response.data.redirectTo);
    }
  } catch (error) {
    console.log(error);
  }
}

const linkConnectorToAccount = async () => {
  loaderText.value = 'Linking Connector...';
  try {
    const response = await axios.post(
        API.CONNECTORS.LINK(route.params.connector),
        {
          "connectorData": {
            "code": route.query.code,
            "state": route.query.state,
            "redirectUri": `${import.meta.env.VITE_ROOT}/callback/connectors/${route.params.connector}`,
            "key": null,
          }
        },
        {headers: {Authorization: `Bearer ${await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)}`, 'Content-Type': 'application/json'}}
    )
    if (response.status === 200) {
      window.close();
    }
  } catch (error) {
    console.log(error);
  }
}

const connectorFlowControl = async () => {
  if (route.params.action === 'new') {
    await redirectToBuiltUri()
  } else {
    await linkConnectorToAccount()
  }
}

onMounted(connectorFlowControl)
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div v-if="isLoading" class="flex flex-col items-center align-middle">
      <LoaderCircle :size="128" class="animate-spin" />
      <p class="font-bold text-2xl">{{ loaderText }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>