<script setup>
import { CardDescription, CardTitle } from '@/components/ui/card/index.js'
import {LifeBuoy, HardDriveDownload} from 'lucide-vue-next'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
</script>

<template>
  <div class="w-screen desktop:w-[600px] phone:px-4 tablet:px-32 ">
    <CardTitle class="my-4 flex">
      <LifeBuoy class="mr-1" />
      Download Your Data
    </CardTitle>
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
    <MfaVerificationDialog title="Request Your Data" :icon="HardDriveDownload" desc="You will receive a email with a link to your data archive. The link will be valid for up to 72 hours." disabled edit />
  </div>
</template>
