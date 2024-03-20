<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <RouterView />
  <Toaster position="bottom-center" richColors theme="dark" />
</template>

<style scoped>

</style>
