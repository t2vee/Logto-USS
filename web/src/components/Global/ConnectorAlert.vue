<script setup>
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert/index.js'
import { AlertCircle } from 'lucide-vue-next'

defineProps({
  customTitle: {
    type: String,
    default: 'You are connected using a Social Login.'
  },
  customMessage: {
    type: String,
    default:
      'Your details are based on the information provided by your social connector. You cannot edit the details below.'
  }
})
</script>

<template>
  <Alert variant="destructive">
    <AlertCircle class="w-5 h-5" color="#f67a3c" />
    <AlertTitle class="font-bold text-[#f67a3c]">{{ customTitle }}</AlertTitle>
    <AlertDescription class="text-[#f67a3c]">
      {{ customMessage }}
    </AlertDescription>
  </Alert>
</template>

<style scoped></style>
