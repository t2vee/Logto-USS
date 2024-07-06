<script setup>
import {inject, provide} from 'vue'
import {CardDescription, CardTitle} from '@/components/ui/card/index.js'
import AddPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/AddPhoneNumberDialog.vue'
import EditPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/RemovePhoneNumberDialog.vue'
import EditEmailAddress from '@/components/Pages/SignInAndSecurity/EditEmailAddress.vue'
import EditMfaMethods from '@/components/Pages/SignInAndSecurity/EditMfaMethods.vue'
import UpdatePasswordDialog from '@/components/Pages/SignInAndSecurity/UpdatePasswordDialog.vue'
import EditLoginVerification from "@/components/Pages/SignInAndSecurity/EditLoginVerification.vue";
import {Cog} from "lucide-vue-next";

const userData = inject('userData')
const mfaOptions = inject('mfaMethods')

provide('mfaMethods', mfaOptions)
</script>

<template>
  <div class="w-screen desktop:w-[600px] phone:px-4 tablet:px-32 ">
    <CardTitle class="flex my-4">
      <Cog class="mr-1" />
      Sign-In and Security
    </CardTitle>
    <CardDescription>
      Manage settings related to signing in to your account, account security, as well as how to
      recover your data when you're having trouble signing in.
    </CardDescription>
    <div class="desktop:flex space-y-4 desktop:space-y-0 desktop:gap-4 mt-12">
      <EditEmailAddress />
      <component :is="userData.phone_number ? EditPhoneNumberDialog : AddPhoneNumberDialog" />
    </div>
    <div class="desktop:flex space-y-4 desktop:space-y-0 desktop:gap-4 mt-4">
      <UpdatePasswordDialog />
      <EditMfaMethods />
    </div>
    <div class="desktop:flex space-y-4 desktop:space-y-0 desktop:gap-4 mt-4">
      <EditLoginVerification />
    </div>
  </div>
</template>

<style scoped></style>
