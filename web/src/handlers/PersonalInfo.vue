<script setup>
import {CardDescription, CardTitle} from '@/components/ui/card/index.js'
import EditBirthdayDialog from '@/components/Pages/PersonalInfo/EditBirthdayDialog.vue'
import EditUsername from '@/components/Pages/PersonalInfo/EditUsername.vue'
import EditRegionalSettings from '@/components/Pages/PersonalInfo/EditRegionalSettings.vue'
import EditLocaleSettings from '@/components/Pages/PersonalInfo/EditLocaleSettings.vue'
import EditFullName from '@/components/Pages/PersonalInfo/EditFullName.vue'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {DoorClosed} from "lucide-vue-next";

</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Personal Information</CardTitle>
    <CardDescription>
      Manage your personal information, including phone numbers and email addresses where you can
      be reached.
    </CardDescription>
    <div class="flex gap-4 mt-12">
      <!--<EditPublicProfile/>-->
      <MfaVerificationDialog disabled title="Public Profile" :icon="DoorClosed" desc="Open for more details" />
      <EditUsername />
    </div>
    <div class="flex gap-4 mt-4">
      <EditFullName />
      <EditBirthdayDialog />
    </div>
    <div class="flex gap-4 mt-4">
      <EditRegionalSettings />
      <EditLocaleSettings />
    </div>
  </div>
</template>

<style scoped></style>
