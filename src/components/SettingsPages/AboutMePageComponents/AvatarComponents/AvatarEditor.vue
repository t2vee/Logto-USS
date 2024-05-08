<script setup>
import {defineAsyncComponent} from "vue";

defineProps({
  avatarUrl: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  }
});


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SquarePen } from 'lucide-vue-next';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
const AvatarDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/AvatarDialog.vue"));
</script>

<template>
  <Dialog>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <DialogTrigger as-child>
            <div class="relative">
              <Avatar class="w-[130px] h-[130px]">
                <AvatarImage :src="avatarUrl" alt="avatar" />
                <AvatarFallback>{{ userName }}</AvatarFallback>
              </Avatar>
              <div class="absolute bottom-[-10px] right-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1">
                <SquarePen class="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change Profile Picture</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <AvatarDialog />
  </Dialog>
</template>

<style scoped>

</style>