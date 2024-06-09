<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select/index.js'
import { ref, inject } from 'vue'
import { Button } from '@/components/ui/button/index.js'
import { DialogClose, DialogFooter } from '@/components/ui/dialog/index.js'
import Label from '../../ui/label/Label.vue'
import axios from 'redaxios'
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js'
import { useLogto } from '@logto/vue'
const { getAccessToken } = useLogto()
const selectedLocale = ref('')
const userData = inject('userData')

async function updateData() {
  let failed = false
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
    }
  } catch (error) {
    toast.error('Error saving changes:', { description: 'Service Unavailable. Try again later' })
    failed = true
  }
  if (!failed) {
    eventBus.emit('closeEditDetailDialog', false)
    eventBus.emit('refreshUserData', true)
  }
}
</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-col gap-4 py-4 items-center align-middle">
      <div class="grid w-3/4 max-w-sm items-center gap-1.5">
        <Label class="font-bold"> Language </Label>
        <Select v-model="selectedLocale">
          <SelectTrigger class="w-[280px]">
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
    <DialogFooter>
      <div class="flex space-x-10 items-center align-middle">
        <Button variant="link" as-child>
          <a target="_blank" href="/legal"> Privacy and Cookies Policy </a>
        </Button>
        <div class="space-x-2">
          <Button type="submit" class="h-[30px]" :onclick="updateData" :disabled="!selectedLocale">
            Save
          </Button>
          <DialogClose as-child>
            <Button type="button" variant="outline" class="h-[30px]"> Cancel </Button>
          </DialogClose>
        </div>
      </div>
    </DialogFooter>
  </div>
</template>
