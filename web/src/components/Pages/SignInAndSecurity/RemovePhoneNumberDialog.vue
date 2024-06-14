<script setup>
import {inject, ref} from 'vue'
import {useLogto} from '@logto/vue'
import {DialogClose} from '@/components/ui/dialog/index.js'
import {Loader2, Phone, Save, Undo2} from 'lucide-vue-next'
import {Button} from '@/components/ui/button/index.js'
import axios from 'redaxios'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";

const { getAccessToken } = useLogto()
const isLoading = ref(false)
const userData = inject('userData')

async function removeNumber() {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/edit/remove-sms`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 204) {
      toast.success('Number Successfully Removed', {
        description: 'You can now add a new number to your account.'
      })
      isLoading.value = false
      eventBus.emit('closeEditDetailDialog', false)
      if (isDesktop) {eventBus.emit('refreshUserData', true)}
    }
  } catch (error) {
    toast.error('Error Removing Number:', { description: 'Service Unavailable. Try again later' })
  }
}

import { useMediaQuery } from '@vueuse/core'
const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <MfaVerificationDialog title="Remove Phone Number" :icon="Phone" :desc="userData.phone_number" edit>
    <template #body>
      <div class="flex flex-col items-center align-middle justify-center">
        <div class="mb-8 w-full">
          <p class="font-bold text-sm">
            You can only have one number per account. To change your connected number, remove it first
            then add a number as normal.
          </p>
          <br />
          <div class="flex justify-evenly">
            <p>Currently Connected Number:</p>
            <strong>{{ userData.phone_number }}</strong>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div v-if="!isDesktop" class="w-full space-y-2">
        <DialogClose as-child>
          <Button type="button" variant="outline" class="w-full">
            <Undo2 class="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </DialogClose>
        <Button
            @click="removeNumber"
            variant="destructive"
            class="w-full"
            :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          <Save v-else class="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>
      <DialogClose as-child v-else>
        <Button type="button" variant="outline" class="h-[30px]">
          <Undo2 class="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </DialogClose>
      <Button
          v-if="isDesktop"
          @click="removeNumber"
          variant="destructive"
          class="h-[30px]"
          :disabled="isLoading"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
        <Save v-else class="w-4 h-4 mr-2" />
        Remove
      </Button>
    </template>
  </MfaVerificationDialog>
</template>

<style scoped></style>
