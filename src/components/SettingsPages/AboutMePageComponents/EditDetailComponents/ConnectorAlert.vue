<script setup>
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert/index.js";
import {AlertCircle} from "lucide-vue-next";

defineProps({
  customMessage: {
    type: String,
  }
})
</script>

<template>
  <Alert variant="destructive">
    <AlertCircle class="w-4 h-4" />
    <AlertTitle class="font-bold">You are connected using a Social Login.</AlertTitle>
    <AlertDescription>
      <p v-if="!customMessage">Your details are based on the information provided by your social connector. You cannot edit the details below.</p>
      <p v-else>{{ customMessage }}</p>
    </AlertDescription>
  </Alert>
</template>

<style scoped>

</style>