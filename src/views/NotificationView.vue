<script setup>
import { defineAsyncComponent } from "vue";
const NotificationSettings = defineAsyncComponent(() => import("@/components/SettingsPages/NotificationSettings.vue"));
import AccountsRoot from "@/components/AccountsRoot.vue";
</script>

<template>
  <AccountsRoot :page="NotificationSettings" />
</template>