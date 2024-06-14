<script setup>
import {inject, ref} from 'vue'
import {Button} from '@/components/ui/button/index.js'
import {DialogClose} from '@/components/ui/dialog/index.js'
import Label from '../../ui/label/Label.vue'
import axios from 'redaxios'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import {useLogto} from '@logto/vue'
import {DateFormatter, getLocalTimeZone} from '@internationalized/date'
import {Calendar as CalendarIcon, CalendarFold, Save, Undo2} from 'lucide-vue-next'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover/index.js'
import {cn} from '@/lib/utils.js'
import CalendarWithSelects from '@/components/Pages/PersonalInfo/Utils/CalendarWithSelects.vue'
import {DateFieldInput, DateFieldRoot,} from 'radix-vue'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";

const df = new DateFormatter('en-AU', {
  dateStyle: 'long'
})

const value = ref()
const userData = inject('userData')

const { getAccessToken } = useLogto()
const dateSelected = ref(false)

async function updateData() {
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/edit/birthday`,
      {
        birthday: df.format(value.value.toDate(getLocalTimeZone()))
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
      if (isDesktop) {eventBus.emit('refreshUserData', true)}
    }
  } catch (error) {
    switch (error.response.status) {
      case 400:
        toast.warning('Error saving changes:', { description: 'The Date you have submitted is invalid. Please check your request' })
        break;
      case 422:
        toast.warning('Error saving changes:', { description: 'You were NOT born then. Please check your request' })
        break;
      default:
        toast.error('Error saving changes:', { description: 'Service Unavailable. Try again later' })
    }
  }
}

function allowSave() {
  dateSelected.value = !!value.value
}

import { useMediaQuery } from '@vueuse/core'
const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <MfaVerificationDialog title="Birthday" :icon="CalendarFold" :desc="userData.profile?.birthdate ? userData.profile.birthdate : 'Not Set'">
    <template #body>
      <div class="w-full h-full flex flex-col gap-4 pb-4 items-center align-middle">
        <div class="grid tablet:w-full desktop:w-3/5 max-w-sm items-center gap-1.5 relative">
            <Label for="birthday" class="flex font-bold w-full justify-between">
              Birthday
            </Label>
            <div>
              <div class="flex flex-col gap-2">
                <DateFieldRoot
                    id="date-field"
                    v-model="value"
                    v-slot="{ segments }"
                    @update:model-value="allowSave"
                    class="flex space-x-2 items-center align-middle data-[invalid]:border-red-500"
                >
                  <template v-for="item in segments" :key="item.part">
                    <DateFieldInput
                        v-if="item.part === 'literal'"
                        :part="item.part"
                    >
                      {{ item.value }}
                    </DateFieldInput>
                    <DateFieldInput
                        v-else
                        :part="item.part"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {{ item.value }}
                    </DateFieldInput>
                  </template>
                </DateFieldRoot>
              </div>
            </div>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                    variant="outline"
                    :class="cn('justify-start text-left font-normal',!value && 'text-muted-foreground')">
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  <p>
                    <span v-if="userData.birthdate && !value">(Currently)&nbsp;</span>
                    <span>{{
                        value
                            ? df.format(value.toDate(getLocalTimeZone()))
                            : userData.birthdate
                                ? userData.birthdate
                                : 'Use a Calender'
                      }}</span>
                  </p>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <CalendarWithSelects v-model="value" @update:model-value="allowSave" />
              </PopoverContent>
            </Popover>
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
            :disabled="!dateSelected"
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
      <Button v-if="isDesktop" type="submit" class="h-[30px]" :onclick="updateData" :disabled="!dateSelected">
        <Save class="w-4 h-4 mr-2" />
        Save
      </Button>
    </template>
  </MfaVerificationDialog>
</template>