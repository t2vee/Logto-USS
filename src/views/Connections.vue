<script setup>
import { defineAsyncComponent } from 'vue'
const ConnectionSettings = defineAsyncComponent(
  () => import('@/handlers/Connections.vue')
)
import AccountsRoot from '@/components/Base/AccountsRoot.vue'
</script>

<template>
  <AccountsRoot :page="ConnectionSettings" />
</template>
