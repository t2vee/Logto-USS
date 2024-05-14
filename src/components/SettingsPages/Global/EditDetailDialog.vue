<script setup>
import { ref, onUnmounted, inject } from 'vue'
import { Dialog, DialogTrigger } from '@/components/ui/dialog/index.js'
import MFAVerificationDialog from '@/components/SettingsPages/Global/MfaVerificationDialog.vue'
import { eventBus } from '@/lib/eventBus.js'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/index.js'

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
    required: true
  },
  dialogPage: {
    type: Object,
    required: true
  },
  desc: String,
  disabled: Boolean,
  dataRequest: Boolean
})

onUnmounted(cleanup)
</script>

<template>
  <Card
    v-if="disabled"
    class="h-32 w-full bg-gradient-to-tl from-gray-800 to-60% hover:cursor-default"
  >
    <CardHeader>
      <CardTitle class="flex justify-between text-lg text-gray-500"
        >{{ title }}<component :is="icon" v-if="icon" color="rgb(75 85 99)"
      /></CardTitle>
      <CardDescription class="text-gray-500">{{ desc }}</CardDescription>
    </CardHeader>
  </Card>
  <Dialog v-else v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Card
        class="h-32 w-full bg-gradient-to-tl from-[#6c888e] to-30% transition-all duration-200 hover:to-60% hover:border-[#abd9e2] hover:cursor-pointer"
      >
        <CardHeader>
          <CardTitle class="flex justify-between text-lg"
            >{{ title }}<component :is="icon" v-if="icon" color="#bdeffa"
          /></CardTitle>
          <CardDescription>{{ desc }}</CardDescription>
        </CardHeader>
      </Card>
    </DialogTrigger>
    <MFAVerificationDialog
      :data-request="dataRequest"
      :is-visible="isDialogOpen"
      :edit-page="dialogPage"
      :user-data="userData"
      :title="title"
      :icon="icon"
      @update:isVisible="isDialogOpen = $event"
    />
  </Dialog>
</template>
