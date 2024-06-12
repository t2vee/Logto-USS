<script setup>
import { CardDescription, CardTitle } from '@/components/ui/card/index.js'
import { HardDriveDownload } from 'lucide-vue-next'
import AddPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/AddPhoneNumberDialog.vue'
import EditDetailDialog from '@/components/Global/MFAHelpers/EditDetailDialog.vue'
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Download Your Data</CardTitle>
    <CardDescription class="mb-6">
      Select the data you’d like to download, and we’ll prepare a copy for you. This process may
      take up to seven days. To ensure the security of your data, we use this time to verify that
      the request was made by you.
      <br />
      <br />
      Your download will include:
      <br />
      <p>
        User Information like personal info, privacy settings, connection information, security settings,
        data history and developer applications. These will be in the .json format.
      </p>
      <p>
        User Uploaded Media like avatars. These will be in the web optimised .webp format.
      </p>
    </CardDescription>
    <EditDetailDialog
      disabled
      title="Request Your Data"
      desc="You will receive a email with a link to your data archive. The link will be valid for up to 72 hours."
      :icon="HardDriveDownload"
      :dialog-page="AddPhoneNumberDialog"
      data-request
    />
  </div>
</template>
