<script setup>
import { CardDescription, CardTitle } from '@/components/ui/card/index.js'
import EditDeveloperStatus from "@/components/Pages/DeveloperOptions/EditDeveloperStatus.vue";
</script>

<template>
  <div class="w-[600px]">
    <CardTitle class="my-4">Developer Options</CardTitle>
    <CardDescription class="mb-6">
      Enabling a developer account will give you access to your developer dashboard where you can create and manage applications.
    </CardDescription>
    <EditDeveloperStatus />
  </div>
</template>
