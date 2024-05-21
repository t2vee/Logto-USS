<script setup>
import { defineAsyncComponent } from 'vue'
const DangerzoneSettings = defineAsyncComponent(() => import('@/handlers/DangerZone.vue'))
import AccountsRoot from '@/components/Base/AccountsRoot.vue'
</script>

<template>
  <AccountsRoot :page="DangerzoneSettings" />
</template>
