<script setup>
import {Input} from '@/components/ui/input/index.js'
import {Label} from '@/components/ui/label/index.js'
import axios from 'redaxios'
import {inject, ref, watch} from 'vue'
import {useLogto} from '@logto/vue'
import debounce from 'lodash/debounce'
import {Ban, CircleUserRound, MoreHorizontal, Save, Undo2, UserRoundCheck} from 'lucide-vue-next'
import {Button} from '@/components/ui/button/index.js'
import {DialogClose} from '@/components/ui/dialog/index.js'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import ConnectorAlert from '@/components/Global/ConnectorAlert.vue'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {createReusableTemplate, useMediaQuery} from '@vueuse/core'
import PrivacyFooter from "@/components/Global/PrivacyFooter.vue";
import {API} from "@/lib/apiRouteMap.js";

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
      API.UTILS.CHECK_USERNAME_EXISTS(value),
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
      API.EDIT.USERNAME,
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
      API.ME.USERNAME_CHANGE,
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

const isDesktop = useMediaQuery('(min-width: 1023px)')
const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()
</script>

<template>
  <UseFooterTemplate>
    <PrivacyFooter v-if="!isDesktop" />
    <DialogClose as-child>
      <Button type="button" variant="outline" class="desktop:h-[30px] tablet:w-full">
        <Undo2 class="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </DialogClose>
    <PrivacyFooter v-if="isDesktop" />
    <Button
        type="submit"
        class="desktop:h-[30px] tablet:w-full"
        :disabled="waitForNextChange || !isAvailable"
        @click="updateData"
    >
      <Save class="w-4 h-4 mr-2" />
      Save
    </Button>
  </UseFooterTemplate>

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
    <template #footer v-if="isDesktop">
      <FooterTemplate />
    </template>
    <template #drawerFooter v-else>
      <FooterTemplate />
    </template>
  </MfaVerificationDialog>
</template>

<style scoped></style>
