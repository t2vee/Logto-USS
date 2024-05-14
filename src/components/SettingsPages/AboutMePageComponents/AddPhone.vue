<script setup>
import { Button } from '@/components/ui/button/index.js'
import { Plus } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-2">
    <p class="text-sm">You do not have a phone number attached to your account.</p>
    <Button class="rounded-xl font-bold h-8" variant="secondary">
      <Plus class="pr-1" />
      Add Phone Number
    </Button>
  </div>
</template>

<style scoped></style>
