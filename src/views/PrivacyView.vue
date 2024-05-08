<script setup>
import { defineAsyncComponent } from "vue";
const PrivacySettings = defineAsyncComponent(() => import("@/components/SettingsPages/PrivacySettings.vue"));
import AccountsRoot from "@/components/AccountsRoot.vue";
</script>

<template>
  <AccountsRoot :page="PrivacySettings" />
</template>