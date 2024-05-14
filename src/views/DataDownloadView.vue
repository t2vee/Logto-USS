<script setup>
import { defineAsyncComponent } from 'vue'
const DataDownloadSettings = defineAsyncComponent(
  () => import('@/components/SettingsPages/YourDataDownload.vue')
)
import AccountsRoot from '@/components/AccountsRoot.vue'
</script>

<template>
  <AccountsRoot :page="DataDownloadSettings" />
</template>
