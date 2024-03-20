<script setup>
import { ref, onUnmounted } from 'vue';
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import MFAVerificationDialog
  from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/MfaVerificationDialog.vue";
import AddPhone from '@/components/SettingsPages/AboutMePageComponents/AddPhone.vue';
import { eventBus } from '@/lib/eventBus.js';


const handleEvent = (data) => {
  isDialogOpen.value = data;
};
const isDialogOpen = ref(false);
const cleanup = eventBus.on('closeEditDetailDialog', handleEvent);

defineProps({
  title: {
    type: String,
    required: true,
  },
  editPage: {
    type: Object,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
  phone: {
    type: Boolean,
  }
})

onUnmounted(cleanup);
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <AddPhone v-if="phone" />
      <Button v-else variant="link">Edit</Button>
    </DialogTrigger>
    <MFAVerificationDialog
        :is-visible="isDialogOpen"
        :edit-page="editPage"
        :user-data="userData"
        :title="title"
        @update:isVisible="isDialogOpen = $event"
    />
  </Dialog>
</template>