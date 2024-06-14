<script setup>
import {computed, inject, ref} from 'vue'
import {useLogto} from '@logto/vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog/index.js'
import {Input} from '@/components/ui/input/index.js'
import {Label} from '@/components/ui/label/index.js'
import {ArrowBigRightDash, Loader, MailCheck, MailX, ShieldEllipsis, Undo2} from 'lucide-vue-next'
import {Button} from '@/components/ui/button/index.js'
import {DialogClose} from '@/components/ui/dialog/index.js'
import MfaCodeInput from '@/components/Global/MFAHelpers/MfaCodeInput.vue'
import axios from 'redaxios'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {createReusableTemplate, useMediaQuery} from "@vueuse/core";
import PrivacyFooter from "@/components/Global/PrivacyFooter.vue";

const userData = inject('userData')

const { getAccessToken } = useLogto()
const accessTokenRef = ref('')
const emailSent = ref(false)
const isLoading = ref(false)
const emailVerified = ref(false)
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

const email = ref('')

const emailRegex = new RegExp(/^[\w-\.]+(?:\+[\w]+)?@([\w-]+\.)+[\w-]{2,7}$/)

const isEmailValid = computed(() => {
  return emailRegex.test(email.value)
})

const isEditing = computed(() => {
  return email.value.length > 0
})

async function sendVerificationCode() {
  isLoading.value = true;
  let failed;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  accessTokenRef.value = accessToken
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/verify/push-email`,
      {
        email: email.value
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    emailSent.value = response.status === 204
  } catch (error) {
    toast.error('Error Sending Verification Code:', {
      description: 'Service Unavailable. Try again later'
    })
    emailSent.value = error.response && error.response.status === 404;
    failed = true;
  } finally {
    isLoading.value = false;
    resendCodeTimer.value = 60;
    countdown()
    if (!failed) {
      toast.info('Sent Email to ' + email.value, { description: 'Code will last for 10 minutes.' });
    }
  }
}

async function handleCodeResend() {
  await sendVerificationCode()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
async function handleChangeInput() {
  readyToSend.value = false
  emailSent.value = false
  sleep(resendCodeTimer.value * 1000).then(() => {
    readyToSend.value = true
  })
}

const handleCodeComplete = async (code) => {
  isLoading.value = true
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/verify/verify-email?verification-code=${code}`,
      { email: email.value },
      {
        headers: {
          Authorization: `Bearer ${accessTokenRef.value}`,
          'Content-Type': 'application/json'
        }
      }
    )
    emailSent.value = response.status === 204
    if (response.status === 204) {
      toast.success('Successfully Verified', {
        description: `${email.value} has been successfully added to your account.`
      })
      eventBus.emit('closeEditDetailDialog', false)
      if (isDesktop) {eventBus.emit('refreshUserData', true)}
    }
    emailVerified.value = !(response.status === 204)
  } catch (error) {
    toast.error('Error sending verification code:', { description: error })
    emailSent.value = false
  } finally {
    isLoading.value = false
  }
}

const [UseAlertDialogTemplate, AlertDialogTemplate] = createReusableTemplate()
const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 1023px)')

</script>

<template>
  <UseAlertDialogTemplate>
    <AlertDialog>
      <AlertDialogTrigger as-child>
        <Button
            class="desktop:h-[30px] tablet:w-full"
            :disabled="
                    !isEmailValid || (resendCodeTimer > 0 && !readyToSend)
                  "
        >
          <ShieldEllipsis class="w-4 h-4 mr-2" />
          Verify
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription class="space-y-4">
            Changing your email means that you will <strong>no longer</strong> be able to:
            <ul class="space-y-1">
              <li class="flex items-center align-middle">
                <ArrowBigRightDash /> <span class="font-bold">Login with&nbsp;</span>
                {{
                  userData.email.length > 30
                      ? `${userData.email.substring(0, 30)}...`
                      : userData.email
                }}
              </li>
              <li class="flex items-center align-middle">
                <ArrowBigRightDash /> <span class="font-bold">Contact us with&nbsp;</span>
                {{
                  userData.email.length > 30
                      ? `${userData.email.substring(0, 30)}...`
                      : userData.email
                }}
              </li>
              <li class="flex items-center align-middle">
                <ArrowBigRightDash />
                <span class="font-bold">Receive any mail with&nbsp;</span>
                {{
                  userData.email.length > 30
                      ? `${userData.email.substring(0, 30)}...`
                      : userData.email
                }}
              </li>
              <li class="flex items-center align-middle">
                <ArrowBigRightDash />
                <span class="font-bold">Verify your identity with&nbsp;</span>
                {{
                  userData.email.length > 30
                      ? `${userData.email.substring(0, 30)}...`
                      : userData.email
                }}
              </li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="sendVerificationCode">I'm Sure</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </UseAlertDialogTemplate>

  <UseFooterTemplate>
    <PrivacyFooter v-if="!isDesktop" />
    <DialogClose as-child>
      <Button type="button" variant="outline" class="desktop:h-[30px] tablet:w-full">
        <Undo2 class="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </DialogClose>
    <PrivacyFooter v-if="isDesktop" />
    <AlertDialogTemplate />
  </UseFooterTemplate>

  <MfaVerificationDialog title="Email Address" :icon="userData.email_verified ? MailCheck : MailX" :desc="userData.email.length > 30 ? userData.email.substring(0, 30) + '...' : userData.email">
    <template #body>
      <transition name="fade" mode="out-in">
        <div
            v-if="!isLoading && !emailSent"
            class="w-full h-full flex flex-col gap-4 pb-4 items-center align-middle mt-5"
        >
          <div class="grid tablet:w-full desktop:w-3/5 max-w-sm items-center gap-1.5 relative">
            <Label for="email" class="flex font-bold w-full justify-between">
              Email
              <span v-if="isEmailValid && isEditing" class="text-xs text-green-500">Valid Email</span>
              <span v-else-if="!isEmailValid && isEditing" class="text-xs text-red-500">
                Invalid Email Format
              </span>
            </Label>
            <Input
                id="email"
                type="email"
                v-model="email"
                :class="{
            'border-red-500': !isEmailValid && isEditing,
            'border-green-500': isEmailValid && isEditing
          }"
                placeholder="Enter your email"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pt-5 pr-3">
              <MailCheck v-if="isEmailValid && isEditing" class="text-green-500" />
              <MailX v-else-if="!isEmailValid && isEditing" class="text-red-500" />
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
        <div v-else-if="!isLoading && emailSent">
          <MfaCodeInput
              :resend-code-timer="resendCodeTimer"
              @codeComplete="handleCodeComplete"
              @resendCode="handleCodeResend"
              @changeInput="handleChangeInput"
          />
        </div>
      </transition>
    </template>
    <template #footer v-if="!isLoading && !emailSent && isDesktop">
      <FooterTemplate />
    </template>
    <template #drawerFooter v-else-if="!isLoading && !emailSent">
      <FooterTemplate />
    </template>
  </MfaVerificationDialog>
</template>

<style scoped></style>
