<script setup>
import {Input} from '@/components/ui/input/index.js'
import {Label} from '@/components/ui/label/index.js'
import axios from 'redaxios'
import {inject, ref} from 'vue'
import {useLogto} from '@logto/vue'
import {Button} from '@/components/ui/button/index.js'
import {DialogClose} from '@/components/ui/dialog/index.js'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import debounce from 'lodash/debounce'
import {Ban, MoreHorizontal, Save, Undo2, UserRound, UserRoundCheck} from 'lucide-vue-next'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";

const userData = inject('userData')
const { getAccessToken } = useLogto()

const fullName = ref('')
const isOk = ref(false)
const isChecking = ref(false)
const nameChecked = ref(false)
const badWords = ref(false)

async function updateData() {
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/edit/full-name`,
      {
        name: fullName.value
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 204) {
      toast.success('Success!', { description: 'Your changes were saved successfully.' })
      eventBus.emit('closeEditDetailDialog', false)
      eventBus.emit('refreshUserData', true)
    }
  } catch (error) {
    if (error.response.status === 406) {
      badWords.value = true
      isOk.value = false
      fullName.value = '';
      toast.warning('Did not save changes:', { description: 'Name contains bad words.' })
    } else {
      toast.error('Error saving changes:', { description: 'Service Unavailable. Try again later' })
    }
  }
}

const checkName = async (value) => {
  badWords.value = false;
  isChecking.value = true
  nameChecked.value = false
  value = value.trim()
  if (!value) {
    isChecking.value = false
    isOk.value = false
    return
  }
  if (value.length > 64) {
    isChecking.value = false
    nameChecked.value = true
    isOk.value = false
    return
  }
  isChecking.value = false
  nameChecked.value = true
  isOk.value = true
}

const debouncedCheckName = debounce(() => checkName(fullName.value), 500)

import { useMediaQuery } from '@vueuse/core'
const isDesktop = useMediaQuery('(min-width: 1023px)')

</script>

<template>
  <MfaVerificationDialog title="Full Name" :icon="UserRound" :desc="userData.name ? userData.name : 'Not Set'">
    <template #body>
        <div class="w-full h-full flex flex-col gap-4 pb-4 items-center align-middle">
          <div class="grid tablet:w-full desktop:w-3/5 max-w-sm items-center gap-1.5 relative">
            <Label for="username" class="flex font-bold w-full justify-between">
              Full Name
              <span v-if="badWords" class="text-xs text-red-500">Contains Bad Words</span>
              <span v-else-if="!isOk && nameChecked" class="text-xs text-red-500">Invalid Name</span>
            </Label>
            <div>
              <Input
                  id="username"
                  v-model="fullName"
                  @input="debouncedCheckName"
                  :class="{
              'border-red-500': !isOk && nameChecked
            }"
                  :placeholder="userData.name"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pt-1 pr-1.5">
                <MoreHorizontal v-if="isChecking" />
                <UserRoundCheck v-else-if="isOk && nameChecked" class="text-white" />
                <Ban v-else-if="!isOk && nameChecked" class="text-red-500" />
              </div>
            </div>
            <div class="flex w-full justify-end">
              <p class="text-xs text-gray-500">{{ fullName.length }}/64</p>
            </div>
          </div>
        </div>
    </template>
    <template #footer>
      <div v-if="!isDesktop" class="w-full space-y-2">
        <Button variant="link" as-child size="xs">
          <a target="_blank" href="/legal" class="text-sm"> Privacy and Cookies Policy </a>
        </Button>
        <DialogClose as-child>
          <Button type="button" variant="outline" class="w-full">
            <Undo2 class="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </DialogClose>
        <Button
            type="submit"
            class="w-full"
            :disabled="!isOk"
            @click="updateData"
        >
          <Save class="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
      <DialogClose as-child v-else>
        <Button type="button" variant="outline" class="h-[30px]">
          <Undo2 class="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </DialogClose>
      <Button variant="link" as-child size="xs" v-if="isDesktop">
        <a target="_blank" href="/legal" class="text-sm"> Privacy and Cookies Policy </a>
      </Button>
      <Button
          type="submit"
          class="h-[30px]"
          :disabled="!isOk"
          @click="updateData"
          v-if="isDesktop"
      >
        <Save class="w-4 h-4 mr-2" />
        Save
      </Button>
    </template>
  </MfaVerificationDialog>
</template>
