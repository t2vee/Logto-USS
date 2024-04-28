<script setup>
import { RouterView } from 'vue-router'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { Toaster } from "@/components/CustomShadcnComponents/toast"
import AnalyticsOptNotify from "@/components/PageComponents/AnalyticsOptNotify.vue";

</script>

<template>
  <RouterView />
  <AnalyticsOptNotify />
  <Toaster />
  <SonnerToaster position="bottom-center" richColors theme="dark"></SonnerToaster>
</template>

<style scoped>

</style>
