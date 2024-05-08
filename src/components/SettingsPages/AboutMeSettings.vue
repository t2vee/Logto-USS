<script setup>
import {defineAsyncComponent, inject, onMounted} from 'vue'
import {
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { CircleUserRound, UserRound, BookType, Earth, CalendarFold } from 'lucide-vue-next';
const EditBirthdayDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditBirthdayDialog.vue"));
const EditDetailDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditDetailDialog.vue"));
const EditUsername = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditUsername.vue"));
const EditRegionalSettings = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditRegionalSettings.vue"));
const EditLocaleSettings = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditLocaleSettings.vue"));
const EditFullName = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditFullName.vue"));

const userData = inject('userData')

function expandLocale(shortLocale) {
  const localeMap = {
    "en": "(EN-US) English US",
    "en-au": "(EN-AU) English AU",
  };
  if (localeMap.hasOwnProperty(shortLocale)) {
    return localeMap[shortLocale];
  } else {
    return shortLocale;
  }
}
</script>

<template>
   <div class="w-[600px]">
      <CardTitle class="my-4">Personal Information</CardTitle>
      <CardDescription>Manage your personal information, including phone numbers and email addresses where you can be reached.</CardDescription>
      <div class="flex gap-4 mt-12">
        <EditDetailDialog
          title="Public Profile"
          desc="Open For More Details"
          :icon="UserRound"
          :dialog-page="EditFullName"
        />
        <EditDetailDialog
            title="Username"
            :desc="userData.username ?? userData.name ?? 'Not Set'"
            :icon="CircleUserRound"
            :dialog-page="EditUsername"
        />
      </div>
      <div class="flex gap-4 mt-4">
        <EditDetailDialog
            title="Full Name"
            :desc="userData.name ? userData.name : 'Not Set'"
            :icon="UserRound"
            :dialog-page="EditFullName"
        />
        <EditDetailDialog
            title="Birthday"
            :desc="userData.birthdate ?? userData.birthdate ?? 'Not Set'"
            :icon="CalendarFold"
            :dialog-page="EditBirthdayDialog"
        />
      </div>
      <div class="flex gap-4 mt-4">
        <EditDetailDialog
            title="Country/Region"
            :desc="userData.data.profile.address.country ?? userData.data.profile.address.locality ?? 'Not Set'"
            :icon="Earth"
            :dialog-page="EditRegionalSettings"
        />
        <EditDetailDialog
            title="Language"
            :desc="userData.locale ? expandLocale(userData.locale) : 'Not Set'"
            :icon="BookType"
            :dialog-page="EditLocaleSettings"
        />
      </div>
  </div>
</template>

<style scoped>

</style>