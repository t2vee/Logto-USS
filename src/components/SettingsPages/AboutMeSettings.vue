<script setup>
import {defineAsyncComponent, inject} from 'vue'
import {
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
const EditDetailDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditDetailDialog.vue"));
const EditBasicInformation = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditBasicInformation.vue"));
const EditRegionalSettings = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditRegionalSettings.vue"));
import { CircleUserRound, UserRound, BookType, Earth } from 'lucide-vue-next';

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
   <div class="w-[600px]">
      <CardTitle class="my-4">Personal Information</CardTitle>
      <CardDescription>Manage your personal information, including phone numbers and email addresses where you can be reached.</CardDescription>
      <div class="flex gap-4 mt-12">
        <EditDetailDialog
          title="Full Name"
          :desc="userData.name ? userData.name : 'Not Set'"
          :icon="UserRound"
          :dialog-page="EditBasicInformation"
        />
        <EditDetailDialog
            title="Username"
            :desc="userData.username ?? userData.name ?? 'Not Set'"
            :icon="CircleUserRound"
            :dialog-page="EditBasicInformation"
        />
      </div>
       <div class="flex gap-4 mt-4">
         <EditDetailDialog
             title="Country/Region"
             desc="Not Set"
             :icon="Earth"
             :dialog-page="EditRegionalSettings"
         />
         <EditDetailDialog
             title="Language"
             desc="English-AU"
             :icon="BookType"
             :dialog-page="EditRegionalSettings"
         />
       </div>
  </div>
</template>

<style scoped>

</style>