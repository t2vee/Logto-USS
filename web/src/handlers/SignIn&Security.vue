<script setup>
import {inject, provide} from 'vue'
import {CardDescription, CardTitle} from '@/components/ui/card/index.js'

import AddPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/AddPhoneNumberDialog.vue'
import EditPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/RemovePhoneNumberDialog.vue'
import EditEmailAddress from '@/components/Pages/SignInAndSecurity/EditEmailAddress.vue'
import EditMfaMethods from '@/components/Pages/SignInAndSecurity/EditMfaMethods.vue'
import UpdatePasswordDialog from '@/components/Pages/SignInAndSecurity/UpdatePasswordDialog.vue'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";

const userData = inject('userData')
const mfaOptions = inject('mfaMethods')

provide('mfaMethods', mfaOptions)
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Sign-In and Security</CardTitle>
    <CardDescription>
      Manage settings related to signing in to your account, account security, as well as how to
      recover your data when you're having trouble signing in.
    </CardDescription>
    <div class="flex gap-4 mt-12">
      <EditEmailAddress />
      <component :is="userData.phone_number ? EditPhoneNumberDialog : AddPhoneNumberDialog" />
    </div>
    <div class="flex gap-4 mt-4">
      <UpdatePasswordDialog />
      <EditMfaMethods />
    </div>
    <div class="flex gap-4 mt-4">
      <MfaVerificationDialog disabled title="Recovery Steps" icon="KeyRound" desc="Not Available" />
    </div>
  </div>
</template>

<style scoped></style>
