<script setup>
import {inject, ref} from 'vue'
import {Button} from "@/components/ui/button/index.js";
import {DialogClose, DialogFooter} from "@/components/ui/dialog/index.js";
import Label from "@/components/ui/label/Label.vue";
import axios from "axios";
import {toast} from "vue-sonner";
import {eventBus} from "@/lib/eventBus.js";
import {useLogto} from "@logto/vue";

import {
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils.js'
import CalendarWithSelects
  from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/CalendarWithSelects.vue";
import countries from "@/lib/countries.json.js";

const df = new DateFormatter('en-AU', {
  dateStyle: 'long',
})

const value = ref()

const userData = inject('userData')

const footer = import.meta.env.VITE_EDIT_DIALOG_FOOTER_LINK;
const { getAccessToken } = useLogto();
const dateSelected = ref(false)

async function updateData() {
  let failed = false;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/user-data-entry/update-user-information/profile/birthday`,
        {
          "birthday": df.format(value.value.toDate(getLocalTimeZone()))
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        });
    if (response.status === 204) {
      toast.success('Success!',{description: 'Your changes were saved successfully.'})
    }
  } catch (error) {
    toast.error('Error saving changes:',{description: 'Service Unavailable. Try again later'})
    failed = true;
  }
  if (!failed) {
    eventBus.emit('closeEditDetailDialog', false);
    eventBus.emit('refreshUserData', true);
  }
}

function allowSave() {
  dateSelected.value = !!value.value;
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 py-4 items-center align-middle">
      <div class="grid w-3/4 max-w-sm items-center gap-1.5">
        <Label for="username" class="flex font-bold w-full justify-between">
          Birthday (Optional)
        </Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button
                variant="outline"
                :class="cn(
          'w-[280px] justify-start text-left font-normal',
          !value && 'text-muted-foreground',
        )"
            >
              <CalendarIcon class="mr-2 h-4 w-4" />
              <p><span v-if="userData.birthdate && !value">(Currently)</span> <span>{{
                  value ? df.format(value.toDate(getLocalTimeZone())) : (userData.birthdate ? userData.birthdate : 'Pick a date')
                }}</span></p>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <CalendarWithSelects v-model="value" @update:model-value="allowSave" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
    <DialogFooter>
      <div class="flex space-x-10 items-center align-middle">
        <Button variant="link" as-child>
          <a target="_blank" :href="footer">
            Privacy and Cookies Policy
          </a>
        </Button>
        <div class="space-x-2">
          <Button type="submit" class="h-[30px]" :onclick="updateData" :disabled="!dateSelected">
            Save
          </Button>
          <DialogClose as-child>
            <Button type="button" variant="outline" class="h-[30px]">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogFooter>
  </div>
</template>