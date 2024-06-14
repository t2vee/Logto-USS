<script setup>
import { Input } from '@/components/ui/input/index.js'
import { Label } from '@/components/ui/label/index.js'
import axios from 'redaxios'
import {inject, ref, onMounted, watch} from 'vue'
import { useLogto } from '@logto/vue'
import debounce from 'lodash/debounce'
import {Ban, UserRoundCheck, MoreHorizontal, CircleUserRound} from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index.js'
import { DialogClose } from '@/components/ui/dialog/index.js'
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js'
import ConnectorAlert from '@/components/Global/ConnectorAlert.vue'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";

const userData = inject('userData')

const { getAccessToken } = useLogto()

const username = ref('')
const isChecking = ref(false)
const isAvailable = ref(false)
const usernameChecked = ref(false)
const waitForNextChange = ref('')
const badWords = ref(false)
const isDialogOpen = ref(false)

const usernameRegex = new RegExp(/^[a-zA-Z0-9]{3,24}$/)

const checkUsernameAvailability = async (value) => {
  badWords.value = false;
  if (!value || !usernameRegex.test(value)) {
    isChecking.value = false
    usernameChecked.value = false
    isAvailable.value = false
    return
  }
  isChecking.value = true
  usernameChecked.value = false
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/utils/check-username-exists/${value}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    isAvailable.value = response.status === 204
  } catch (error) {
    if (error.response.status === 406) { badWords.value = true }
    isAvailable.value = error.response && error.response.status === 404
  } finally {
    isChecking.value = false
    usernameChecked.value = true
  }
}

const debouncedCheckUsername = debounce(() => checkUsernameAvailability(username.value), 500)

const handleInput = (event) => {
  let input = event.target.value;
  input = input.toLowerCase().replace(/\s/g, '');
  username.value = input;
  debouncedCheckUsername();
};

async function updateData() {
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/edit/username`,
      {
        username: username.value
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
    switch (error.response.status) {
      case 406:
      case 400:
        toast.warning('Cant Change Username', { description: error.response.text })
        break;
      case 418:
        toast.error('Error saving changes:', { description: 'Service Unavailable. Try again later' });
        break;
    }
  }
}

const checkNextUsernameChange = async () => {
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/can-change-username`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 200) {
      waitForNextChange.value = response.data
    }
  } catch (error) {
    isAvailable.value = error.response && error.response.status === 404
  }
}

watch(isDialogOpen, () => {
  if (isDialogOpen.value) {
    checkNextUsernameChange()
  }
})

import { useMediaQuery } from '@vueuse/core'
const isDesktop = useMediaQuery('(min-width: 1023px)')

</script>

<template>
  <MfaVerificationDialog title="Username" :icon="CircleUserRound" :desc="userData.username ?? userData.name ?? 'Not Set'" v-model="isDialogOpen">
    <template #body>

      <div class="w-full h-full flex flex-col gap-4 pb-4 items-center align-middle mt-3 phone:px-0 tablet:px-10">
        <ConnectorAlert
            v-if="waitForNextChange"
            :custom-title="`Cant Change Username Until ${waitForNextChange.value}`"
            :custom-message="`You can only change your username once per month. Your next username change will be available on the ${waitForNextChange.value}`"
        />
        <div class="grid tablet:w-full desktop:w-3/5 max-w-sm items-center gap-1.5 relative">
          <Label for="username" class="flex font-bold w-full justify-between">
            Username
            <span v-if="badWords" class="text-xs text-red-500">Contains Bad Words</span>
            <span v-else-if="isAvailable && usernameChecked" class="text-xs text-green-500">
              Username Available!
            </span>
            <span v-else-if="!isAvailable && usernameChecked" class="text-red-500">
              Username Taken
            </span>
          </Label>
          <div>
            <Input
                id="username"
                :disabled="!!waitForNextChange"
                v-model="username"
                @input="handleInput"
                :class="{
              'border-red-500': !isAvailable && usernameChecked,
              'border-green-500': isAvailable && usernameChecked
            }"
                :placeholder="userData.username ? userData.username : userData.name"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pt-7 pr-1">
              <MoreHorizontal v-if="isChecking" />
              <UserRoundCheck v-else-if="isAvailable && usernameChecked" class="text-green-500" />
              <Ban v-else-if="!isAvailable && usernameChecked" class="text-red-500" />
            </div>
          </div>
        </div>
        <p class="text-xs" v-if="!waitForNextChange">
          Keep in mind, You can only <strong>change your username once per month!</strong>
        </p>
      </div>
    </template>
    <template #footer>
      <div v-if="!isDesktop" class="w-full space-y-2">
        <Button variant="link" as-child size="xs">
          <a target="_blank" href="/legal" class="text-sm"> Privacy and Cookies Policy </a>
        </Button>
        <Button
            type="submit"
            class="w-full"
            :disabled="waitForNextChange || !isAvailable"
            @click="updateData"
        >
          Save
        </Button>
        <DialogClose as-child>
          <Button type="button" variant="outline" class="w-full"> Cancel </Button>
        </DialogClose>
      </div>
      <DialogClose as-child v-else>
        <Button type="button" variant="outline" class="h-[30px]"> Cancel </Button>
      </DialogClose>
      <Button variant="link" as-child size="xs" v-if="isDesktop">
        <a target="_blank" href="/legal" class="text-sm"> Privacy and Cookies Policy </a>
      </Button>
      <Button
          type="submit"
          class="h-[30px]"
          :disabled="waitForNextChange || !isAvailable"
          @click="updateData"
          v-if="isDesktop"
      >
        Save
      </Button>
    </template>
  </MfaVerificationDialog>
</template>

<style scoped></style>
