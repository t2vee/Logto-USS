<script setup>
import {inject} from 'vue'
import {CardDescription, CardTitle} from '@/components/ui/card/index.js'
import {BookType, CalendarFold, CircleUserRound, DoorOpen, Earth, UserRound} from 'lucide-vue-next'
import EditPublicProfile from "@/components/Pages/PersonalInfo/EditPublicProfile.vue"
import EditBirthdayDialog from '@/components/Pages/PersonalInfo/EditBirthdayDialog.vue'
import EditDetailDialog from '@/components/Global/MFAHelpers/EditDetailDialog.vue'
import EditUsername from '@/components/Pages/PersonalInfo/EditUsername.vue'
import EditRegionalSettings from '@/components/Pages/PersonalInfo/EditRegionalSettings.vue'
import EditLocaleSettings from '@/components/Pages/PersonalInfo/EditLocaleSettings.vue'
import EditFullName from '@/components/Pages/PersonalInfo/EditFullName.vue'

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
        :desc="userData.profile?.address?.country ?? userData.profile?.address?.country ?? 'Not Set'"
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
