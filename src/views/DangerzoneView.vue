<script setup>
import { defineAsyncComponent } from 'vue'
const DangerzoneSettings = defineAsyncComponent(() => import('@/components/SettingsPages/DangerzoneSettings.vue'))
import AccountsRoot from '@/components/AccountsRoot.vue'
</script>

<template>
  <AccountsRoot :page="DangerzoneSettings" />
</template>
