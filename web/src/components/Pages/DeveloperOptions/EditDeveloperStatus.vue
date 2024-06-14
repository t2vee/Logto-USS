<script setup>
import {ref, inject} from 'vue'
import { useLogto } from '@logto/vue'
import { DialogClose } from '@/components/ui/dialog/index.js'
import {Loader2, Code, Undo2, Save} from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index.js'
import axios from 'redaxios'
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js'
import { Checkbox } from '@/components/ui/checkbox'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {createReusableTemplate, useMediaQuery} from "@vueuse/core";

const { getAccessToken } = useLogto()
const isLoading = ref(false)
const checked = ref(false)
const userData = inject('userData')

async function updateStatus() {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/edit/developer-status`,
        {
          enable: checked.value
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
    )
    if (response.status === 204) {
      toast.success('Developer Account Enabled Successfully', {
        description: 'You can now access your developer dashboard.'
      })
    } else {
      toast.success('Developer Account Disabled Successfully', {
        description: 'You will no longer be able to access your developer dashboard.'
      })
    }
    eventBus.emit('closeEditDetailDialog', false)
    eventBus.emit('refreshUserData', true)
  } catch (error) {
    toast.error('Error Saving Changes:', { description: 'Service Unavailable. Try again later',
      action: {
        label: 'Retry',
        onClick: updateStatus
      } })
  } finally {
    isLoading.value = false
  }
}

function onCheckboxChange() {
  checked.value = !checked.value;
}

const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 1023px)')
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
        @click="updateStatus"
        class="desktop:h-[30px] tablet:w-full"
        :disabled="isLoading"
    >
      <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
      <Save v-else class="w-4 h-4 mr-2" />
      Save
    </Button>
  </UseFooterTemplate>

  <MfaVerificationDialog title="Developer Status" :icon="Code" :desc="userData?.customData?.developer ? 'Enabled' : 'Disabled'" >
    <template #body>
      <div class="flex flex-col items-center align-middle justify-center space-y-8">
        <div class="mb-8 w-full">
          <div class="flex flex-col items-center space-y-3">
            <p>Currently <strong>{{ userData?.customData?.developer ? 'Enabled' : 'Disabled' }}</strong></p>
            <div class="flex items-center space-x-2">
              <Checkbox
                  id="enable"
                  :checked="checked"
                  :default-checked="userData?.customData?.developer"
                  @update:checked="onCheckboxChange"
              />
              <label
                  for="enable"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Developer Account
              </label>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div v-if="!isDesktop" class="w-full space-y-2">
        <FooterTemplate />
      </div>
      <FooterTemplate v-else />
    </template>
  </MfaVerificationDialog>
</template>