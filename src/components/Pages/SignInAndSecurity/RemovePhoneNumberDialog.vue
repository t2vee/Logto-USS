<script setup>
import {inject, ref} from 'vue'
import {useLogto} from '@logto/vue'
import {DialogClose} from '@/components/ui/dialog/index.js'
import {Loader2, Phone, Trash2, Undo2} from 'lucide-vue-next'
import {Button} from '@/components/ui/button/index.js'
import axios from 'redaxios'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {createReusableTemplate, useMediaQuery} from '@vueuse/core'
import {API} from "@/lib/apiRouteMap.js";

const { getAccessToken } = useLogto()
const isLoading = ref(false)
const userData = inject('userData')

async function removeNumber() {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      API.EDIT.REMOVE_SMS,
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
      eventBus.emit('refreshUserData', true)
    }
  } catch (error) {
    toast.error('Error Removing Number:', { description: 'Service Unavailable. Try again later' })
  }
}

const isDesktop = useMediaQuery('(min-width: 1023px)')
const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()

</script>

<template>
  <UseFooterTemplate>
    <DialogClose as-child>
      <Button type="button" variant="outline" class="desktop:h-[30px] tablet:w-full">
        <Undo2 class="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </DialogClose>
    <Button
        @click="removeNumber"
        variant="destructive"
        class="desktop:h-[30px] tablet:w-full"
        :disabled="isLoading"
    >
      <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
      <Trash2 v-else class="w-4 h-4 mr-2" />
      Remove
    </Button>
  </UseFooterTemplate>

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

    <template #footer v-if="isDesktop">
      <FooterTemplate />
    </template>
    <template #drawerFooter v-else>
      <FooterTemplate />
    </template>
  </MfaVerificationDialog>
</template>

<style scoped></style>
