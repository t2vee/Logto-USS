<script setup>
import { defineAsyncComponent, inject, onMounted, provide, ref } from 'vue'
import { CardDescription, CardTitle } from '@/components/ui/card/index.js'
import {
  Fingerprint,
  MailCheck,
  MailX,
  Phone,
  PhoneMissed,
  CircleEllipsis,
  KeyRound
} from 'lucide-vue-next'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { useLogto } from '@logto/vue'

const AddPhoneNumberDialog = defineAsyncComponent(() => import('@/components/Pages/SignInAndSecurity/AddPhoneNumberDialog.vue'))
const EditPhoneNumberDialog = defineAsyncComponent(() => import('@/components/Pages/SignInAndSecurity/RemovePhoneNumberDialog.vue'))
const EditDetailDialog = defineAsyncComponent(() => import('@/components/Global/EditDetailDialog.vue'))
const EditEmailAddress = defineAsyncComponent(() => import('@/components/Pages/SignInAndSecurity/EditEmailAddress.vue'))
const EditMfaMethods = defineAsyncComponent(() => import('@/components/Pages/SignInAndSecurity/EditMfaMethods.vue'))
const UpdatePasswordDialog = defineAsyncComponent(() => import('@/components/Pages/SignInAndSecurity/UpdatePasswordDialog.vue'))

const userData = inject('userData')
const { getAccessToken } = useLogto()
const mfaOptions = ref({})
const mfaOptionsNum = ref([])

async function grabMfaOptions() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/mfa/methods`,
      {headers: {Authorization: `Bearer ${await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)}`, 'Content-Type': 'application/json'}}
    )
    if (response.data[0]?.type === 'Totp') {mfaOptions.value.totp = response.data[0]}
    mfaOptionsNum.value.push(userData.value.email)
    if (userData.value.phone_number) {mfaOptionsNum.value.push(userData.value.phone_number)}
    if (response.data[0] !== 'none') {mfaOptionsNum.value.push(response.data[0])}
  } catch (error) {
    toast.error('Error grabbing MFA Options:', { description: 'Some account actions will be unavailable' })
  }
}

provide('mfaMethods', mfaOptions)

onMounted(grabMfaOptions)
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Sign-In and Security</CardTitle>
    <CardDescription
      >Manage settings related to signing in to your account, account security, as well as how to
      recover your data when you're having trouble signing in.</CardDescription
    >
    <div class="flex gap-4 mt-12">
      <EditDetailDialog
        title="Email Address"
        :desc="
          userData.email.length > 30
            ? userData.email.substring(0, 30) + '...'
            : userData.email
        "
        :icon="userData.email_verified ? MailCheck : MailX"
        :dialog-page="EditEmailAddress"
      />
      <EditDetailDialog
        title="Phone Number"
        :desc="userData.phone_number ? userData.phone_number : 'Number Not Added'"
        :icon="userData.phone_number_verified ? Phone : PhoneMissed"
        :dialog-page="userData.phone_number ? EditPhoneNumberDialog : AddPhoneNumberDialog"
      />
    </div>
    <div class="flex gap-4 mt-4">
      <EditDetailDialog
        title="Password"
        :desc="`Last Logged in at ${new Date(userData.lastSignInAt).toLocaleDateString()}`"
        :icon="CircleEllipsis"
        :dialog-page="UpdatePasswordDialog"
      />
      <EditDetailDialog
        title="Account Security"
        :desc="`${mfaOptionsNum.length} MFA Method${mfaOptionsNum.length === 1 ? '' : 's'} Set Up`"
        :icon="Fingerprint"
        :dialog-page="EditMfaMethods"
      />
    </div>
    <div class="flex gap-4 mt-4">
      <EditDetailDialog
        disabled
        title="Recovery Steps"
        desc="Not Avaliable"
        :icon="KeyRound"
        :dialog-page="EditEmailAddress"
      />
    </div>
  </div>
</template>

<style scoped></style>
