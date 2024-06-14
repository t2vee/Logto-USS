<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select/index.js'
import {inject, ref} from 'vue'
import {Button} from '@/components/ui/button/index.js'
import {DialogClose} from '@/components/ui/dialog/index.js'
import Label from '../../ui/label/Label.vue'
import axios from 'redaxios'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import {useLogto} from '@logto/vue'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {BookType, Save, Undo2} from "lucide-vue-next";

const { getAccessToken } = useLogto()
const selectedLocale = ref('')
const userData = inject('userData')

async function updateData() {
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/edit/language`,
      {
        locale: selectedLocale.value
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
    toast.error('Error saving changes:', { description: 'Service Unavailable. Try again later' })
  }
}

function expandLocale(shortLocale) {
  const localeMap = {
    en: '(EN-US) English US',
    'en-au': '(EN-AU) English AU'
  }
  if (localeMap.hasOwnProperty(shortLocale)) {
    return localeMap[shortLocale]
  } else {
    return shortLocale
  }
}

import { useMediaQuery } from '@vueuse/core'
const isDesktop = useMediaQuery('(min-width: 1023px)')

</script>

<template>
  <MfaVerificationDialog title="Language" :icon="BookType" :desc="userData.profile.locale ? expandLocale(userData.profile.locale) : 'Not Set'" >
    <template #body>
      <div class="w-full h-full flex flex-col gap-4 pb-4 items-center align-middle">
        <div class="grid tablet:w-full desktop:w-3/5 max-w-sm items-center gap-1.5 relative">
          <Label class="font-bold"> Language </Label>
          <Select v-model="selectedLocale">
            <SelectTrigger class="w-full">
              <SelectValue
                  :placeholder="
                userData.locale
                  ? `(Currently) ${userData.locale.toUpperCase()}`
                  : 'Select a Language'
              "
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="en-au"> (EN-AU) English AU </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </template>
    <template #footer>
      <div v-if="!isDesktop" class="w-full space-y-2">
        <Button variant="link" as-child size="xs">
          <a target="_blank" href="/legal" class="text-sm"> Privacy and Cookies Policy </a>
        </Button>
        <DialogClose as-child >
          <Button type="button" variant="outline" class="w-full">
            <Undo2 class="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </DialogClose>
        <Button
            type="submit"
            class="w-full"
            :disabled="!selectedLocale"
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
      <Button v-if="isDesktop" type="submit" class="h-[30px]" :onclick="updateData" :disabled="!selectedLocale">
        <Save class="w-4 h-4 mr-2" />
        Save
      </Button>
    </template>
  </MfaVerificationDialog>

</template>
