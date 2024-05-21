<script setup>
import { defineAsyncComponent } from 'vue'
const SecuritySettings = defineAsyncComponent(
  () => import('@/handlers/SignIn&Security.vue')
)
import AccountsRoot from '@/components/Base/AccountsRoot.vue'
</script>

<template>
  <AccountsRoot :page="SecuritySettings" />
</template>
