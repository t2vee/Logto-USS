<script setup>
import { ref, onUnmounted } from 'vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible/index.js'
import { Card } from '@/components/ui/card/index.js'
import {Link2, Link2Off, ChevronDown, Loader2} from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index.js'
import { eventBus } from '@/lib/eventBus.js'
import axios from 'redaxios';
import {toast} from "vue-sonner";
import { useLogto } from '@logto/vue'

const { getAccessToken } = useLogto()
const isLoading = ref(false)

const props = defineProps({
  disabled: Boolean,
  image: String,
  icon: Object,
  service: {
    type: String,
    required: true
  },
  linked: Boolean
})

const isOpen = ref(false)
function closeOther() {
  eventBus.emit('flipCollapsibleValues', props.service)
}
const handleStateChange = (data) => {
  if (data !== props.service) {
    isOpen.value ? (isOpen.value = false) : (isOpen.value = false)
  }
}
const cleanup = eventBus.on('flipCollapsibleValues', handleStateChange)

async function removeConnector() {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/connectors/remove/${props.service.toLowerCase()}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
    )
    if (response.status === 204) {
      toast.success('Connector Removed Successfully', {
        description: 'Remember to revoke access via your connectors account management.'
      })
    }
  } catch (error) {
    toast.error('Error Removing Connector:', { description: 'Service Unavailable. Try again later' });
  } finally {
    isLoading.value = false;
    isOpen.value = false;
    eventBus.emit('refreshUserData', true);
  }
}

const disableLinkButton = ref(false);

let windowChecker = null;
let authWindow = null;

const beginAuthorizationFlow = () => {
  disableLinkButton.value = true;
  const url = `/oauth/connectors/new/${props.service.toLowerCase()}`;
  const width = 400;
  const height = 700;
  const left = (screen.width / 2) - (width / 2);
  const top = (screen.height / 2) - (height / 2);
  authWindow = window.open(
      url,
      'AuthorizationWindow',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
  );
  windowChecker = setInterval(() => {
    if (authWindow && authWindow.closed) {
      eventBus.emit('refreshUserData', true);
      clearInterval(windowChecker);
    }
  }, 500);
};

onUnmounted(cleanup)

import {useMediaQuery} from "@vueuse/core";

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <Card
    class="w-full bg-gradient-to-tl from-[#6c888e] to-30% transition-all duration-200 hover:to-60% hover:border-[#abd9e2] mb-4 p-4"
  >
    <Collapsible v-model:open="isOpen" @update:open="closeOther">
      <CollapsibleTrigger class="flex items-center align-middle justify-between w-full">
        <div class="flex gap-x-4">
          <component :is="icon" color="white" />
          <p>{{ service }}</p>
        </div>
        <div class="flex gap-x-3">
          <div class="flex gap-x-2 items-center align-middle">
            <p :class="linked ? 'text-green-500' : 'text-gray-500'">
              {{ linked ? '' : 'Not' }} Linked
            </p>
            <Link2Off v-if="!linked" color="#718096" />
            <Link2 v-else color="#48bb78" />
          </div>
          <ChevronDown :class="{ 'rotate-180': isOpen }" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="desktop:flex" v-if="!linked">
        <div class="w-full desktop:w-1/2 p-2">
          <p class="text-gray-400 text-sm">
            Click "Link" to visit {{ service }} and link your {{ service }} to your current account. Please
            note that as part of linking these accounts, {{ service }} will share some of your data
            with us.
          </p>
        </div>
        <div class="w-1/2 flex flex-col items-center align-middle justify-center gap-y-2">
          <Button
              :disabled="disabled"
              @click="beginAuthorizationFlow"
          >
            <Link color="black" class="mr-1" />
            <strong class="text-black" v-if="!disableLinkButton">
              {{ disabled ? 'Unavailable' : 'Link Account' }}
            </strong>
            <p v-else class="flex items-center align-middle text-black">
              <Loader2 class="animate-spin mr-1" color="black" />
              Waiting...
            </p>
          </Button>
        </div>
      </CollapsibleContent>
      <CollapsibleContent v-else class="desktop:flex">
        <div class="w-full desktop:w-1/2 p-2">
          <p class="text-gray-400 text-sm">
            Click to immediately remove the connector from your account.
          </p>
        </div>
        <div class="w-1/2 flex flex-col items-center align-middle justify-center gap-y-2">
          <Button variant="destructive" @click="removeConnector">
            Remove {{ isDesktop ? 'Connector' : '' }}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </Card>
</template>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease-in-out;
}
</style>
