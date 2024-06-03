<script setup>
import { defineAsyncComponent, inject, onMounted, ref } from 'vue'
import { CardDescription, CardTitle } from '@/components/ui/card/index.js'
import { Send, TextSearch, UserRoundSearch, BarChart3 } from 'lucide-vue-next'
import AddPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/AddPhoneNumberDialog.vue'

const EditDetailDialog = defineAsyncComponent(() => import('@/components/Global/EditDetailDialog.vue'))
const userData = inject('userData')
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Privacy and Data Usage</CardTitle>
    <CardDescription
      >View and manage information you choose to share with us and configure settings to enhance
      your account privacy.</CardDescription
    >
    <div class="flex gap-16 mt-12 items-center">
      <EditDetailDialog
        disabled
        title="Third Party Data Access"
        desc="Block All"
        :icon="TextSearch"
        :dialog-page="AddPhoneNumberDialog"
      />
      <p class="w-3/4 text-sm">
        Control how third party applications can access your account data. Fully blocking access
        will cause your details to be omitted when requested.
      </p>
    </div>
    <div class="flex gap-16 mt-4 items-center">
      <EditDetailDialog
        disabled
        title="Profile Visibility"
        desc="Friends Only"
        :icon="UserRoundSearch"
        :dialog-page="AddPhoneNumberDialog"
      />
      <p class="w-3/4 text-sm">
        Change who can search for view and your public and/or private profile.
      </p>
    </div>
    <div class="flex gap-16 mt-4 items-center">
      <EditDetailDialog
        disabled
        title="Analytics Mode"
        desc="Opted Out"
        :icon="BarChart3"
        :dialog-page="AddPhoneNumberDialog"
      />
      <p class="w-3/4 text-sm">
        Web Analytics are used by all of our products and services. You can help improve them by
        sharing privatised analytics from your account.
      </p>
    </div>
    <div class="flex gap-16 mt-4 items-center">
      <EditDetailDialog
        disabled
        title="Email Privacy"
        desc="Hide and proxy mail"
        :icon="Send"
        :dialog-page="AddPhoneNumberDialog"
      />
      <p class="w-3/4 text-sm">
        Enabling Email Privacy will mask your email address in all products and services. You will
        also be assigned a private email for receiving email.
      </p>
    </div>
  </div>
</template>