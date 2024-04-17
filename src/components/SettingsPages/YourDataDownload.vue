<script setup>
import {CardDescription, CardTitle} from "@/components/ui/card/index.js";
import {HardDriveDownload} from 'lucide-vue-next';
import AddPhoneNumberDialog
  from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/AddPhoneNumberDialog.vue";
import EditDetailDialog
  from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditDetailDialog.vue";
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Download Your Data</CardTitle>
    <CardDescription class="mb-6">
      Select the data you’d like to download, and we’ll prepare a copy for you. This process may take up to seven days.
      To ensure the security of your data, we use this time to verify that the request was made by you.
      <br>
      <br>
      Your download will include:
      <br>
      <br>
      <ul>
        <li>App usage and activity information as spreadsheets or files in .json, .csv, or .pdf format.</li>
        <li>Documents, photos and videos in their original format.</li>
        <li>Contacts, calendars, bookmarks and mail in .vcf, .ics, .html, and .eml format.</li>
      </ul>
      <br>
      Your download will not include App, book, movie, TV show, or music purchases.
    </CardDescription>
    <EditDetailDialog
        title="Request Your Data"
        desc="You will receive a email with a link to your data archive. The link will be valid for up to 72 hours."
        :icon="HardDriveDownload"
        :dialog-page="AddPhoneNumberDialog"
        data-request
    />
  </div>
</template>

<style scoped>

</style>