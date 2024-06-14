<script setup>
import {onMounted, ref} from 'vue'
import axios from 'redaxios'
import {useLogto} from '@logto/vue'
import {VueTelInput} from 'vue-tel-input'
import {Button} from '@/components/ui/button/index.js'
import {DialogClose} from '@/components/ui/dialog/index.js'
import {Label} from '@/components/ui/label/index.js'
import {Loader, Phone, PhoneMissed, ShieldEllipsis, Undo2} from 'lucide-vue-next'
import {toast} from 'vue-sonner'
import MfaCodeInput from '@/components/Global/MFAHelpers/MfaCodeInput.vue'
import {eventBus} from '@/lib/eventBus.js'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";

const { getAccessToken } = useLogto()
const phone = ref('')
const isNumberValid = ref(false)
const isEditing = ref(true)
const accessTokenRef = ref('')
const smsSent = ref(false)
const isLoading = ref(false)
const smsVerified = ref(false)
const resendCodeTimer = ref(60)
const readyToSend = ref(true)

const countdown = () => {
  const interval = setInterval(() => {
    if (resendCodeTimer.value > 0) {
      resendCodeTimer.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

const dropdownOptions = {
  showDialCodeInList: true,
  showDialCodeInSelection: true,
  showSearchBox: true,
  showFlags: true
}

function checkNumber() {
  const phonePattern = /^\d+$/
  if (
    phone.value !== '' &&
    phonePattern.test(phone.value) &&
    phone.value.length >= 5 &&
    phone.value.length <= 15
  ) {
    isNumberValid.value = true
    isEditing.value = false
  } else {
    isNumberValid.value = false
    isEditing.value = true
  }
}

async function sendVerificationSMS() {
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  accessTokenRef.value = accessToken
  console.log(phone.value)
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/verify/push-sms`,
      {
        encryptedPhoneNumber: phone.value
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    smsSent.value = response.status === 204
    if (response.status === 204) {
      toast.info('Sent Text to ' + phone.value, { description: 'Code will last for 10 minutes.' })
    }
  } catch (error) {
    toast.error('Error Sending Verification Code:', {
      description: 'Service Unavailable. Try again later'
    })
    isEditing.value = true
    smsSent.value = false
    isLoading.value = false
    readyToSend.value = true
    phone.value = null;
  } finally {
    isLoading.value = false
    resendCodeTimer.value = 60
    countdown()
  }
}

async function handleCodeResend() {
  await verifyNumber()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
async function handleChangeInput() {
  readyToSend.value = false
  smsSent.value = false
  sleep(resendCodeTimer.value * 1000).then(() => {
    readyToSend.value = true
  })
}

const handleCodeComplete = async (code) => {
  isLoading.value = true
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/verify/verify-sms?verification-code=${code}`,
      { encryptedPhoneNumber: phone.value },
      {
        headers: {
          Authorization: `Bearer ${accessTokenRef.value}`,
          'Content-Type': 'application/json'
        }
      }
    )
    smsSent.value = response.status === 204
    if (response.status === 204) {
      toast.success('Successfully Verified', {
        description: `${phone.value} has been successfully added to your account.`
      })
      eventBus.emit('closeEditDetailDialog', false)
      if (isDesktop) {eventBus.emit('refreshUserData', true)}
    }
    smsVerified.value = !(response.status === 204)
  } catch (error) {
    toast.error('Error sending verification code:', { description: error })
    smsSent.value = false
  } finally {
    isLoading.value = false
  }
}

async function verifyNumber() {
  if (!isNumberValid.value || !phone.value) return
  isLoading.value = true
  try {
    await sendVerificationSMS()
  } catch (error) {
    console.log('failed:', error)
    isLoading.value = false
  }
}

onMounted(() => { //this needs to be done because the css file that comes with vue-tel-input is gigantic and i had to apply manual changes and optimisations
  isLoading.value = true
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.vstatic.net/content/lHvXlqL2OkmpAMi9x15E/mxs.app/Stylesheet/TelInput.min.css';
  document.head.appendChild(link);
  isLoading.value = false
});

import {createReusableTemplate, useMediaQuery} from '@vueuse/core'
const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()
import PrivacyFooter from "@/components/Global/PrivacyFooter.vue";
const isDesktop = useMediaQuery('(min-width: 1023px)')
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
        @click="verifyNumber"
        class="desktop:h-[30px] tablet:w-full"
        :disabled="!isNumberValid || !phone || (resendCodeTimer > 0 && !readyToSend)"
    >
      <ShieldEllipsis class="w-4 h-4 mr-2" />
      Verify
    </Button>
  </UseFooterTemplate>

  <MfaVerificationDialog title="Phone Number" :icon="PhoneMissed" desc="Number Not Added">
    <template #body>
      <transition name="fade" mode="out-in">
        <div
            v-if="!isLoading && !smsSent"
            class="w-full h-full flex flex-col gap-4 pb-4 items-center align-middle mt-5"
        >
          <div class="grid w-6/8 max-w-sm items-center gap-1.5 relative">
            <Label for="email" class="flex font-bold w-full justify-between">
              Enter Number
              <span v-if="isNumberValid && !isEditing" class="text-xs text-green-500">
                Valid Number
              </span>
              <span v-else-if="!isNumberValid && !isEditing" class="text-xs text-red-500">
                Invalid Number
              </span>
            </Label>
            <vue-tel-input
                v-model="phone"
                mode="international"
                default-country="au"
                :dropdown-options="dropdownOptions"
                :valid-characters-only="true"
                :preferred-countries="['au', 'nz', 'us', 'gb', 'ca']"
                class="w-full"
                @validate="checkNumber"
            >
            </vue-tel-input>
            <div class="absolute inset-y-0 right-0 flex items-center pt-5 pr-1">
              <Phone v-if="isNumberValid && !isEditing" class="text-green-500" />
              <PhoneMissed v-else-if="!isNumberValid && !isEditing" class="text-red-500" />
            </div>
          </div>
          <p class="text-xs" v-if="resendCodeTimer > 0 && !readyToSend">
            Please wait {{ resendCodeTimer }} seconds before sending another code
          </p>
        </div>
        <div v-else-if="isLoading" class="flex items-center align-middle">
          <Loader class="animate-spin" :size="32" />
          <p class="text-xl font-bold">Loading...</p>
        </div>
        <div v-else-if="!isLoading && !isEditing && smsSent">
          <MfaCodeInput
              :resend-code-timer="resendCodeTimer"
              @codeComplete="handleCodeComplete"
              @resendCode="handleCodeResend"
              @changeInput="handleChangeInput"
          />
        </div>
      </transition>
    </template>
    <template #footer v-if="!isLoading && !smsSent && isDesktop">
      <FooterTemplate />
    </template>
    <template #drawerFooter v-else-if="!isLoading && !smsSent">
      <FooterTemplate />
    </template>
  </MfaVerificationDialog>
</template>
