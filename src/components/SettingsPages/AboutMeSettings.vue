<script setup>
import {defineAsyncComponent, inject} from 'vue'
import {
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
const EditDetailDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditDetailDialog.vue"));
const EditUsername = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditUsername.vue"));
const EditRegionalSettings = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditRegionalSettings.vue"));
import { CircleUserRound, UserRound, BookType, Earth } from 'lucide-vue-next';
import EditFullName from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditFullName.vue";

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