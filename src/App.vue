<script setup>
import { RouterView } from 'vue-router'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/Custom/toast'
import AnalyticsOptNotify from '@/components/Global/AnalyticsOptNotify.vue'
import { useMediaQuery } from '@vueuse/core'
const isDesktop = useMediaQuery('(min-width: 1023px)')

</script>

<template>
  <SonnerToaster class="pointer-events-auto" :position="isDesktop ? 'bottom-center' : 'top-center'" richColors theme="dark"></SonnerToaster>
  <RouterView />
  <AnalyticsOptNotify />
  <Toaster />
</template>

<style scoped></style>
