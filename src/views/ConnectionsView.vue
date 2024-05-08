<script setup>
import { defineAsyncComponent } from "vue";
const ConnectionSettings = defineAsyncComponent(() => import("@/components/SettingsPages/ConnectionSettings.vue"));
import AccountsRoot from "@/components/AccountsRoot.vue";
</script>

<template>
  <AccountsRoot :page="ConnectionSettings" />
</template>