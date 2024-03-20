<script setup>
import {defineAsyncComponent, inject} from 'vue'
import {Card, CardContent, CardHeader } from "@/components/ui/card/index.js";
import DataTable from "@/components/SettingsPages/AboutMePageComponents/DataTable.vue";
const AvatarEditor = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/AvatarEditor.vue"));
const EditPhoneNumberDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditPhoneNumberDialog.vue"));
const EditDetailDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditDetailDialog.vue"));
const EditBasicInformation = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditBasicInformation.vue"));
const EditEmailAddress = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditEmailAddress.vue"));
const EditRegionalSettings = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditRegionalSettings.vue"));
const AddPhoneNumberDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/AddPhoneNumberDialog.vue"));

const userData = inject('userData')

const basicInformationTable = {
  'User ID': userData.value.sub,
  'Username': userData.value.username || userData.value.name
};

if (userData.value.username) {
  basicInformationTable['Real Name'] = userData.value.name;
}
</script>

<template>
  <Card class="w-[600px] rounded-none" style="border-color: hsla(190, 49%, 78%, 0.2)">
    <CardHeader>
      <div class="flex align-middle items-center space-x-3 justify-between">
        <p class="text-xl font-bold underline">Basic Information</p>
        <EditDetailDialog title="Basic Information" :edit-page="EditBasicInformation" :user-data="userData" />
      </div>
    </CardHeader>
    <CardContent>
      <div class="flex items-center align-middle justify-between">
        <DataTable :userData="basicInformationTable" />
        <AvatarEditor :avatar-url="userData.picture" :user-name="userData.username ? userData.username : userData.name" />
      </div>
    </CardContent>
  </Card>
  <Card class="w-[600px] rounded-none" style="border-color: hsla(190, 49%, 78%, 0.2)">
    <CardHeader>
      <div class="flex align-middle items-center space-x-3 justify-between">
        <p class="text-xl font-bold underline">Email Address</p>
        <EditDetailDialog title="Email Address" :edit-page="EditEmailAddress" :user-data="userData" />
      </div>
    </CardHeader>
    <CardContent>
      <div class="flex align-middle items-center space-x-3">
        <DataTable
            verified
            :detail-verified="userData.email_verified"
            detail-type="email"
            :userData="{
            'Email': userData.email,
          }" />
      </div>
    </CardContent>
  </Card>
  <Card class="w-[600px] rounded-none" style="border-color: hsla(190, 49%, 78%, 0.2)">
    <CardHeader>
      <div class="flex align-middle items-center space-x-3 justify-between">
        <p class="text-xl font-bold underline">Phone Number</p>
        <EditDetailDialog v-if="userData.phone_number" title="Phone Number" :edit-page="EditPhoneNumberDialog" :user-data="userData" />
      </div>
    </CardHeader>
    <CardContent>
      <div class="flex align-middle items-center space-x-3">
        <DataTable
            verified
            v-if="userData.phone_number"
            :detail-verified="userData.phone_number_verified"
            detail-type="phone"
            :userData="{
            'Number': userData.phone_number,
          }" />
        <EditDetailDialog v-if="!userData.phone_number" title="Phone Number" :edit-page="AddPhoneNumberDialog" :user-data="userData" phone />
      </div>
    </CardContent>
  </Card>
  <Card class="w-[600px] rounded-none" style="border-color: hsla(190, 49%, 78%, 0.2)">
    <CardHeader>
      <div class="flex align-middle items-center space-x-3 justify-between">
        <p class="text-xl font-bold underline">Regional Settings</p>
        <EditDetailDialog title="Regional Settings" :edit-page="EditRegionalSettings" :user-data="userData" />
      </div>
    </CardHeader>
    <CardContent>
      <div class="flex align-middle items-center space-x-3">
        <DataTable :userData="{
            'Country': 'Not Set',
            'Language': 'Not Set',
          }" />
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>