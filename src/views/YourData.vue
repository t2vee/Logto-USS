<script setup>
import { defineAsyncComponent } from 'vue'
const DataDownloadSettings = defineAsyncComponent(
  () => import('@/handlers/YourData.vue')
)
import AccountsRoot from '@/components/Base/AccountsRoot.vue'
</script>

<template>
  <AccountsRoot :page="DataDownloadSettings" />
</template>
