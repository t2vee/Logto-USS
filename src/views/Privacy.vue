<script setup>
import { defineAsyncComponent } from 'vue'
const PrivacySettings = defineAsyncComponent(
  () => import('@/handlers/Privacy.vue')
)
import AccountsRoot from '@/components/Base/AccountsRoot.vue'
</script>

<template>
  <AccountsRoot :page="PrivacySettings" />
</template>
