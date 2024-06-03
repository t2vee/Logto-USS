<script setup>
import { defineAsyncComponent, inject } from 'vue'
import { CardDescription, CardTitle } from '@/components/ui/card/index.js'
import {
  CircleUserRound,
  UserRound,
  BookType,
  Earth,
  CalendarFold,
  DoorOpen
} from 'lucide-vue-next'
const EditPublicProfile = defineAsyncComponent(() => import( "@/components/Pages/PersonalInfo/EditPublicProfile.vue"));
const EditBirthdayDialog = defineAsyncComponent(() => import('@/components/Pages/PersonalInfo/EditBirthdayDialog.vue'))
const EditDetailDialog = defineAsyncComponent(() => import('@/components/Global/EditDetailDialog.vue'))
const EditUsername = defineAsyncComponent(() => import('@/components/Pages/PersonalInfo/EditUsername.vue'))
const EditRegionalSettings = defineAsyncComponent(() => import('@/components/Pages/PersonalInfo/EditRegionalSettings.vue'))
const EditLocaleSettings = defineAsyncComponent(() => import('@/components/Pages/PersonalInfo/EditLocaleSettings.vue'))
const EditFullName = defineAsyncComponent(() => import('@/components/Pages/PersonalInfo/EditFullName.vue'))

const userData = inject('userData')

function expandLocale(shortLocale) {
  const localeMap = {
    en: '(EN-US) English US',
    'en-au': '(EN-AU) English AU'
  }
  if (localeMap.hasOwnProperty(shortLocale)) {
    return localeMap[shortLocale]
  } else {
    return shortLocale
  }
}
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Personal Information</CardTitle>
    <CardDescription
      >Manage your personal information, including phone numbers and email addresses where you can
      be reached.</CardDescription
    >
    <div class="flex gap-4 mt-12">
      <EditDetailDialog
        disabled
        title="Public Profile"
        desc="Open For More Details"
        :icon="DoorOpen"
        :dialog-page="EditPublicProfile"
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
        :desc="userData.profile?.birthdate ? userData.profile.birthdate : 'Not Set'"
        :icon="CalendarFold"
        :dialog-page="EditBirthdayDialog"
      />
    </div>
    <div class="flex gap-4 mt-4">
      <EditDetailDialog
        title="Country/Region"
        :desc="
          userData.profile?.address?.country ?? userData.profile?.address?.country ?? 'Not Set'
        "
        :icon="Earth"
        :dialog-page="EditRegionalSettings"
      />
      <EditDetailDialog
        title="Language"
        :desc="userData.profile.locale ? expandLocale(userData.profile.locale) : 'Not Set'"
        :icon="BookType"
        :dialog-page="EditLocaleSettings"
      />
    </div>
  </div>
</template>

<style scoped></style>
