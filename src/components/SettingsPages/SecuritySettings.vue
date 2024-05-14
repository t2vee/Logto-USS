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

const AddPhoneNumberDialog = defineAsyncComponent(
  () =>
    import(
      '@/components/SettingsPages/SecurityPageComponents/EditDetailComponents/AddPhoneNumberDialog.vue'
    )
)
const EditPhoneNumberDialog = defineAsyncComponent(
  () =>
    import(
      '@/components/SettingsPages/SecurityPageComponents/EditDetailComponents/EditPhoneNumberDialog.vue'
    )
)
const EditDetailDialog = defineAsyncComponent(
  () => import('@/components/SettingsPages/Global/EditDetailDialog.vue')
)
const EditEmailAddress = defineAsyncComponent(
  () =>
    import(
      '@/components/SettingsPages/SecurityPageComponents/EditDetailComponents/EditEmailAddress.vue'
    )
)
const EditMfaMethods = defineAsyncComponent(
  () =>
    import(
      '@/components/SettingsPages/SecurityPageComponents/EditDetailComponents/EditMfaMethods.vue'
    )
)
const UpdatePasswordDialog = defineAsyncComponent(
  () =>
    import(
      '@/components/SettingsPages/SecurityPageComponents/EditDetailComponents/UpdatePasswordDialog.vue'
    )
)

const userData = inject('userData')
const { getAccessToken } = useLogto()
const mfaOptions = ref({})

async function grabMfaOptions() {
  try {
    const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
    const response = await axios.get(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/me/mfa-methods`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    mfaOptions.value = response.data
    if (mfaOptions.value[0] === 'none') {
      mfaOptions.value[1] = 'none'
    }
  } catch (error) {
    toast.error('Error grabbing MFA Options:', { description: error })
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
          userData.primaryEmail.length > 30
            ? userData.primaryEmail.substring(0, 30) + '...'
            : userData.primaryEmail
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
        :desc="`${(mfaOptions[1] = 'none' && mfaOptions.length > 2 ? mfaOptions.length + 1 : userData.phone_number_verified ? '2' : '1')} MFA Methods Set Up`"
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
