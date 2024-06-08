<script setup>
import { Input } from '@/components/ui/input/index.js'
import { Label } from '@/components/ui/label/index.js'
import { inject, ref } from 'vue'
import { Button } from '@/components/ui/button/index.js'
import { DialogClose, DialogFooter } from '@/components/ui/dialog/index.js'
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js'
import debounce from 'lodash/debounce'
import { Ban, MoreHorizontal, UserRoundCheck } from 'lucide-vue-next'
import {useAPI} from "@/lib/api/useAPI.js";

const { API, UIStateHandler, getAccessToken, coreResource } = useAPI()
const userData = inject('userData')

const fullName = ref('')
const isOk = ref(false)
const isChecking = ref(false)
const nameChecked = ref(false)
const badWords = ref(false)

async function updateData() {
  await API.UpdateBaseUserData(
      await getAccessToken(coreResource, undefined),
      new UIStateHandler({
        success: {
          on204: {
            events: {
              toast: () => toast.success('Success!', { description: 'Your changes were saved successfully.' }),
              closeDialog: () => eventBus.emit('closeEditDetailDialog', false),
              refreshUserData: () => eventBus.emit('refreshUserData', true)
            }
          }
        },
        error: {
          on406: {
            events: {
              toast: () => toast.warning('Did not save changes:', { description: 'Name contains bad words.' }),
            },
            refs: {
              badWords: badWords,
              isOk: isOk,
              setValue: {
                fullName: {
                  target: fullName,
                  value: ''
                }
              }
            }
          },
          onDefault: {
            events: {
              toast: () => toast.error('Error saving changes:', { description: 'Service Unavailable. Try again later' })
            }
          },
        }
      }),
      '/api/v2/me/edit/full-name',
      {
        name: fullName.value
      }
  )
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
</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-col gap-4 pb-4 items-center align-middle">
      <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
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
          <div class="absolute inset-y-0 right-0 flex items-center pt-7 pr-1">
            <MoreHorizontal v-if="isChecking" />
            <UserRoundCheck v-else-if="isOk && nameChecked" class="text-white" />
            <Ban v-else-if="!isOk && nameChecked" class="text-red-500" />
          </div>
        </div>
      </div>
    </div>
    <DialogFooter>
      <div class="flex space-x-10 items-center align-middle">
        <Button variant="link" as-child>
          <a target="_blank" href="/legal"> Privacy and Cookies Policy </a>
        </Button>
        <div class="space-x-2">
          <Button
            type="submit"
            class="h-[30px]"
            :disabled="!isOk"
            :onclick="updateData"
          >
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
