<script setup>
import {defineAsyncComponent, inject, onMounted, ref} from 'vue'
import {CardDescription, CardTitle} from "@/components/ui/card/index.js";
import {BookType, MailCheck, MailX, Phone, PhoneMissed, CircleEllipsis, KeyRound} from "lucide-vue-next";
import AddPhoneNumberDialog
  from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/AddPhoneNumberDialog.vue";
import axios from "axios";
import {toast} from "vue-sonner";
import {useLogto} from "@logto/vue";

const EditPhoneNumberDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditPhoneNumberDialog.vue"));
const EditDetailDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditDetailDialog.vue"));
const EditEmailAddress = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditEmailAddress.vue"));
const EditRegionalSettings = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditRegionalSettings.vue"));
const UpdatePasswordDialog = defineAsyncComponent(() => import("@/components/SettingsPages/SecurityPageComponents/EditDetailComponents/UpdatePasswordDialog.vue"));

const userData = inject('userData')
const { getAccessToken } = useLogto()
const mfaOptions = ref({})

async function grabMfaOptions() {
  try {
    const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
    const response = await axios.get(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/get-user-info/${userData.value.sub}/mfa-methods`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    mfaOptions.value = response.data
  } catch (error) {
    toast.error('Error grabbing MFA Options:', {description: error})
  }
}
onMounted(grabMfaOptions)
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Sign-In and Security</CardTitle>
    <CardDescription>Manage settings related to signing in to your account, account security, as well as how to recover your data when you're having trouble signing in.</CardDescription>
    <div class="flex gap-4 mt-12">
      <EditDetailDialog
          title="Email Address"
          :desc="userData.email.length > 30 ? userData.email.substring(0, 30) + '...' : userData.email"
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
          :desc="`Last Logged in at ${new Date(userData.data.lastSignInAt).toLocaleDateString()}`"
          :icon="CircleEllipsis"
          :dialog-page="UpdatePasswordDialog"
      />
      <EditDetailDialog
          title="Account Security"
          :desc="`${mfaOptions.length > 1 ? mfaOptions.length : 'No'} MFA Methods Set Up`"
          :icon="BookType"
          :dialog-page="EditRegionalSettings"
      />
    </div>
    <div class="flex gap-4 mt-4">
      <EditDetailDialog
          disabled
          title="Recovery Steps"
          desc="Not Avaliable"
          :icon="KeyRound"
          :dialog-page="EditRegionalSettings"
      />
    </div>
  </div>
</template>

<style scoped>

</style>