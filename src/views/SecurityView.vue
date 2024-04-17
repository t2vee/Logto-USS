<script setup>
import { defineAsyncComponent } from "vue";
const SecuritySettings = defineAsyncComponent(() => import("@/components/SettingsPages/SecuritySettings.vue"));
import AccountsRoot from "@/components/AccountsRoot.vue";
</script>

<template>
  <AccountsRoot :page="SecuritySettings" />
</template>