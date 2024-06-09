<script setup>
import { Input } from '@/components/ui/input/index.js'
import { Label } from '@/components/ui/label/index.js'
import axios from 'redaxios'
import { inject, ref, onMounted } from 'vue'
import { useLogto } from '@logto/vue'
import debounce from 'lodash/debounce'
import { Ban, UserRoundCheck, MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index.js'
import { DialogClose, DialogFooter } from '@/components/ui/dialog/index.js'
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js'
import ConnectorAlert from '@/components/Global/ConnectorAlert.vue'

const userData = inject('userData')

const { getAccessToken } = useLogto()

const username = ref('')
const isChecking = ref(false)
const isAvailable = ref(false)
const usernameChecked = ref(false)
const waitForNextChange = ref('')
const badWords = ref(false)

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
  let failed = false
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
    failed = true
  }
  if (!failed) {
    eventBus.emit('closeEditDetailDialog', false)
    eventBus.emit('refreshUserData', true)
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

onMounted(checkNextUsernameChange)
</script>

<template>
  <div class="space-y-10">
    <ConnectorAlert
      v-if="waitForNextChange"
      :custom-title="`Cant Change Username Until ${waitForNextChange.value}`"
      :custom-message="`You can only change your username once per month. Your next username change will be available on the ${waitForNextChange.value}`"
    />
    <div class="flex flex-col gap-4 pb-4 items-center align-middle">
      <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
        <Label for="username" class="flex font-bold w-full justify-between">
          Username
          <span v-if="badWords" class="text-xs text-red-500">Contains Bad Words</span>
          <span v-else-if="isAvailable && usernameChecked" class="text-xs text-green-500"
            >Username Available!</span
          >
          <span v-else-if="!isAvailable && usernameChecked" class="text-red-500"
            >Username Taken</span
          >
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
    <DialogFooter>
      <div class="flex space-x-10 items-center align-middle">
        <Button variant="link" as-child>
          <a target="_blank" href="/legal"> Privacy and Cookies Policy </a>
        </Button>
        <div class="space-x-2">
          <Button
            type="submit"
            class="h-[30px]"
            :disabled="waitForNextChange || !isAvailable"
            @click="updateData"
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

<style scoped></style>
