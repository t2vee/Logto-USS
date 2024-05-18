<script setup>
import {Button} from "@/components/ui/button";
import { Input } from '@/components/ui/input'
import {ref} from "vue";
import axios from "axios";
import {toast} from "vue-sonner";
import { useClipboard } from '@vueuse/core'
import { Loader2, ClipboardCopy, ClipboardCheck } from 'lucide-vue-next';
import { useLogto } from '@logto/vue';
import {eventBus} from "@/lib/eventBus.js";
const { getAccessToken } = useLogto()
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

const props = defineProps({
  mfaMethods: {type: Array, required: true}
})

const removeFooter = defineModel()

const isLoading = ref(false)
const mfaSetup = ref(false)
const cantScan = ref(false)
const appMfaData = ref({})
const { copy, copied } = useClipboard({ appMfaData })

async function setupAppAuthenticator() {
  removeFooter.value = true;
  isLoading.value = true;
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/mfa/create`,
        {mfatype: "Totp"},
        { headers: {
            Authorization: `Bearer ${await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)}`,
            'Content-Type': 'application/json'
          } }
    )
    if (response.status === 200) {
      appMfaData.value = response.data;
      mfaSetup.value = true;
      toast.info('Action Completed Successfully', { description: 'A new app authenticator has been generated successfully.' })
    }
  } catch (error) {
    toast.error('Unable to complete action:', {
      description: 'Service Unavailable. Try again later'
    });
  } finally {
    isLoading.value = false;
  }
}

async function deleteAppAuthenticator() {
  isLoading.value = true;
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/mfa/remove`,
        {"verificationid": props.mfaMethods[2].id},
        { headers: {Authorization: `Bearer ${await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)}`, 'Content-Type': 'application/json'}}
    )
    if (response.status === 204) {
      toast.success('Action Completed Successfully', { description: 'Connected App Authenticator was removed from your account.' })
      complete()
    }
  } catch (error) {
    console.log(error)
    toast.error('Unable to complete action:', {
      description: 'Service Unavailable. Try again later'
    });
  } finally {
    isLoading.value = false;
  }
}

function complete() {
  eventBus.emit('closeEditDetailDialog', false)
  eventBus.emit('refreshUserData', true)
}
</script>

<template>
  <div class="space-y-3 flex flex-col items-center mt-[-30px] mb-10">
    <p class="text-sm w-2/3 text-center" v-if="Boolean(!mfaMethods[2]) && !mfaSetup">
      Use a app authenticator to greatly increase the security of your account. Some popular 2FA solutions are Google/Microsoft Authenticator.
    </p>
    <div v-if="mfaMethods[2]" class="flex flex-col items-center gap-y-2">
      <p>You currently have a App Authenticator setup.</p>
      <p class="text-xs">Created at {{ mfaMethods[2].createdAt }}</p>
      <Button variant="destructive" class="h-[30px]" :disabled="isLoading" @click="deleteAppAuthenticator">
        <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" color="black" />
        Remove Authenticator
      </Button>
    </div>
    <div v-else>
      <div v-if="!mfaSetup">
        <Button class="h-[30px]" @click="setupAppAuthenticator" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" color="black" />
          {{ isLoading ? 'Generating...' : 'Setup App Authenticator' }}
        </Button>
      </div>
      <div v-else class="flex flex-col items-center gap-y-2">
        <p class="text-lg font-bold">Add the {{ cantScan ? 'Secret' : 'QR Code' }} to your Authenticator App</p>
        <div class="flex flex-col items-center">
          <img :src="appMfaData.secretQrCode" alt="mfaqrcode" v-if="!cantScan" />
          <div class="flex w-full max-w-sm items-center gap-1.5" v-else>
            <Input :value="appMfaData.secret" :default-value="appMfaData.secret" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button type="submit" @click="copy(appMfaData.secret)">
                    <component :is="copied ? ClipboardCheck : ClipboardCopy" color="black" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ copied ? 'Copied' : 'Copy' }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="link" class="text-xs" @click="() => cantScan = !cantScan">
            {{ cantScan ? "Show QR Code" : "Cant Scan the QR Code?" }}
          </Button>
        </div>
        <Button class="h-[30px]" @click="complete">
          Complete Setup
        </Button>
      </div>
    </div>
  </div>
</template>