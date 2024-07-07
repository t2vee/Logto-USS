<script setup>
import {CardDescription, CardTitle} from '@/components/ui/card/index.js'
import {BarChart3, Send, TextSearch, UserRoundSearch} from 'lucide-vue-next'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
</script>

<template>
  <div class="w-screen desktop:w-[600px] phone:px-4 tablet:px-32">
    <CardTitle class="my-4">Privacy and Data Usage</CardTitle>
    <CardDescription
      >View and manage information you choose to share with us and configure settings to enhance
      your account privacy.</CardDescription
    >
    <div class="flex tablet:flex-col desktop:gap-16 mt-12 items-center justify-center align-middle mobile:gap-2">
      <MfaVerificationDialog title="Third Party Data Access" :icon="TextSearch" desc="Block All" disabled />
      <p class="desktop:w-3/4 text-sm text-center">
        Control how third party applications can access your account data. Fully blocking access
        will cause your details to be omitted when requested.
      </p>
    </div>
    <div class="flex tablet:flex-col desktop:gap-16 mt-4 items-center justify-center align-middle mobile:gap-2">
      <MfaVerificationDialog title="Profile Visibility" :icon="UserRoundSearch" desc="Friends Only" disabled />
      <p class="desktop:w-3/4 text-sm text-center">
        Change who can search for view and your public and/or private profile.
      </p>
    </div>
    <div class="flex tablet:flex-col desktop:gap-16 mt-4 items-center justify-center align-middle mobile:gap-2">
      <MfaVerificationDialog title="Analytics Mode" :icon="BarChart3" desc="Opted Out" disabled />
      <p class="desktop:w-3/4 text-sm text-center">
        Web Analytics are used by all of our products and services. You can help improve them by
        sharing privatised analytics from your account.
      </p>
    </div>
    <div class="flex tablet:flex-col desktop:gap-16 mt-4 items-center justify-center align-middle mobile:gap-2">
      <MfaVerificationDialog title="Email Privacy" :icon="Send" desc="Hide and proxy mail" disabled />
      <p class="desktop:w-3/4 text-sm text-center">
        Enabling Email Privacy will mask your email address in all products and services. You will
        also be assigned a private email for receiving email.
      </p>
    </div>
  </div>
</template>