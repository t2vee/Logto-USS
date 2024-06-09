<script setup>
import { CardDescription, CardTitle } from '@/components/ui/card/index.js'
import {inject} from "vue";
import {Code} from "lucide-vue-next";
import EditDetailDialog from "@/components/Global/EditDetailDialog.vue";
import EditDeveloperStatus from "@/components/Pages/DeveloperOptions/EditDeveloperStatus.vue";
const userData = inject('userData')
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Developer Options</CardTitle>
    <CardDescription class="mb-6">
      Enabling a developer account will give you access to your developer dashboard where you can create and manage applications.
    </CardDescription>
    <EditDetailDialog
        title="Developer Status"
        :desc="userData?.customData?.developer ? 'Enabled' : 'Disabled'"
        :icon="Code"
        :dialog-page="EditDeveloperStatus"
    />
  </div>
</template>
