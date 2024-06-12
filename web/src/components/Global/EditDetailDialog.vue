<script setup>
import { ref, onUnmounted } from 'vue'
import { useDark } from "@vueuse/core";
import { Dialog, DialogTrigger } from '@/components/ui/dialog/index.js'
import MFAVerificationDialog from '@/components/Global/MfaVerificationDialog.vue'
import { eventBus } from '@/lib/eventBus.js'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/index.js'

defineProps({
  title: { type: String, required: true },
  icon: { type: Function, required: true },
  dialogPage: { type: Object, required: true },
  desc: { type: String, required: false },
  disabled: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
})

const isDark = useDark({
  selector: 'html',
})

const handleEvent = (data) => {
  isDialogOpen.value = data
}
const isDialogOpen = ref(false)
const cleanup = eventBus.on('closeEditDetailDialog', handleEvent)

onUnmounted(cleanup)
</script>

<template>
  <Card
    v-if="disabled"
    class="h-32 w-full bg-gradient-to-tl from-gray-800 to-60% hover:cursor-default"
  >
    <CardHeader>
      <CardTitle class="flex justify-between text-lg text-gray-500">
        {{ title }}
        <component :is="icon" v-if="icon" color="rgb(75 85 99)"/>
      </CardTitle>
      <CardDescription class="text-gray-500">
        {{ desc }}
      </CardDescription>
    </CardHeader>
  </Card>
  <Dialog v-else v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Card
        class="h-32 w-full bg-gradient-to-tl from-[#6c888e] to-30% transition-all duration-400 hover:to-60% hover:border-[#abd9e2] hover:cursor-pointer shadow-md shadow-gray-900 hover:shadow-black"
      >
        <CardHeader>
          <CardTitle class="flex justify-between text-lg"
            >{{ title }}<component :is="icon" v-if="icon" :color="isDark ? '#bdeffa' : 'black'"
          /></CardTitle>
          <CardDescription>{{ desc }}</CardDescription>
        </CardHeader>
      </Card>
    </DialogTrigger>
    <MFAVerificationDialog
      :edit="edit"
      :is-visible="isDialogOpen"
      :edit-page="dialogPage"
      :title="title"
      :icon="icon"
      @update:isVisible="isDialogOpen = $event"
    />
  </Dialog>
</template>
