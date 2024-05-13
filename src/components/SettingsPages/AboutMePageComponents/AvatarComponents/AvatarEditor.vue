<script setup>
import {defineAsyncComponent, ref, onUnmounted} from "vue";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {Button} from "@/components/ui/button/index.js";
import {eventBus} from "@/lib/eventBus.js";

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

const AvatarDialog = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/AvatarDialog.vue"));

const popoverState = ref(false)

const handleEvent = (data) => {
  isDialogOpen.value = data;
};
const isDialogOpen = ref(false);
const cleanup = eventBus.on('closeEditDetailDialog', handleEvent);
onUnmounted(cleanup);
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <Dialog v-model:open="isDialogOpen">
        <TooltipTrigger>
          <Popover :open="popoverState">
            <PopoverTrigger>
              <div class="relative" @click="() => popoverState = !popoverState">
                <Avatar class="w-[130px] h-[130px]">
                  <AvatarImage :src="avatarUrl" alt="avatar" />
                  <AvatarFallback>{{ userName }}</AvatarFallback>
                </Avatar>
                <div class="absolute bottom-[-10px] right-4 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1">
                  <SquarePen class="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent class="flex w-auto">
              <DialogTrigger as-child>
                <Button variant="secondary" class="h-[30px]" @click="() => popoverState = false">
                  Create
                </Button>
              </DialogTrigger>
              <Button variant="outline" class="h-[30px]">
                Remove
              </Button>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change Profile Picture</p>
        </TooltipContent>
        <AvatarDialog />
      </Dialog>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped>

</style>