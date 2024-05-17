<script setup>
import { ref, onUnmounted, inject } from 'vue'
import { Dialog, DialogTrigger } from '@/components/ui/dialog/index.js'
import MFAVerificationDialog from '@/components/SettingsPages/Global/MfaVerificationDialog.vue'
import { eventBus } from '@/lib/eventBus.js'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const userData = inject('userData')

const handleEvent = (data) => {
  isDialogOpen.value = data
}
const isDialogOpen = ref(false)
const cleanup = eventBus.on('closeEditDetailDialog', handleEvent)

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: Function,
    required: true
  },
  dialogPage: {
    type: Object,
    required: true
  },
  desc: String,
  disabled: Boolean,
  destructive: Boolean,
  dataRequest: Boolean,
})

onUnmounted(cleanup)
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Alert :class="`h-32 w-full bg-gradient-to-tl ${destructive ? 'from-[#7a1414]' : 'from-[#c2480c]'} to-30% transition-all duration-200 hover:to-60% ${destructive ? 'hover:border-[#dc2626]' : 'hover:border-destructive'} hover:cursor-pointer`">
        <div class="flex items-center align-middle space-x-3">
          <component :is="icon" v-if="icon" :color="destructive ? 'rgb(220 38 38)' : '#f67a3c'"/>
          <AlertTitle class="flex justify-between text-lg" :class="destructive ? 'text-red-600' : 'text-destructive'">{{ title }}</AlertTitle>
        </div>
        <AlertDescription :class="destructive ? 'text-red-600' : 'text-destructive'">{{ desc }}</AlertDescription>
      </Alert>
    </DialogTrigger>
    <MFAVerificationDialog
        :is-visible="isDialogOpen"
        :edit-page="dialogPage"
        :user-data="userData"
        :title="title"
        :icon="icon"
        dataRequest
        @update:isVisible="isDialogOpen = $event"
    />
  </Dialog>
</template>

<style scoped>

</style>