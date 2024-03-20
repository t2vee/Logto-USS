<script setup>
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert/index.js";
import {AlertCircle} from "lucide-vue-next";
</script>

<template>
  <Alert variant="destructive">
    <AlertCircle class="w-4 h-4" />
    <AlertTitle class="font-bold">You are connected using a Social Login.</AlertTitle>
    <AlertDescription>
      Your details are based on the information provided by your social connector. You cannot edit the details below.
    </AlertDescription>
  </Alert>
</template>

<style scoped>

</style>