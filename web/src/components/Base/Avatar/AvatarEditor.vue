<script setup>
import { ref, onUnmounted, defineAsyncComponent } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar/index.js'
import { Loader2, Pencil, Trash2, ImagePlus } from 'lucide-vue-next'
import { Dialog, DialogTrigger } from '@/components/ui/dialog/index.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip/index.js'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover/index.js'
import { Button } from '@/components/ui/button/index.js'
import { eventBus } from '@/lib/eventBus.js'
import axios from 'redaxios'
import { toast } from 'vue-sonner'
import { useLogto } from '@logto/vue'

defineProps({
  avatarUrl: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  }
})
const { getAccessToken } = useLogto()
const AvatarDialog = defineAsyncComponent(() => import('@/components/Base/Avatar/AvatarDialog.vue'));

const isLoading = ref(false)

const removeCurrentAvatar = async () => {
  let failed
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/avatar/remove`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
    )
    if (response.status === 204) {
      toast.success('Avatar Successfully Removed', {
        description: 'Click create to add a new one to your account.'
      })
    }
  } catch (error) {
    toast.error('Error Removing Avatar:', {description: 'Service Unavailable. Try again later'})
    failed = true
  } finally {
    isLoading.value = false
    if (!failed) {
      eventBus.emit('refreshUserData', true)
    }
  }
}

const handleEvent = (data) => {
  isDialogOpen.value = data
}
const isDialogOpen = ref(false)
const removeHover = ref(false)
const cleanup = eventBus.on('closeEditDetailDialog', handleEvent)
onUnmounted(cleanup)
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <Dialog>
        <TooltipTrigger>
          <Popover>
            <PopoverTrigger>
              <div class="relative">
                <Avatar class="w-[130px] h-[130px]">
                  <AvatarImage :src="avatarUrl" alt="avatar"/>
                  <AvatarFallback>{{ userName }}</AvatarFallback>
                </Avatar>
                <div
                    class="absolute bottom-[-10px] right-4 transform translate-x-1/2 -translate-y-1/2 bg-muted rounded-full p-1 border-primary-foreground border-1"
                >
                  <Pencil class="w-5 h-5" :color="'rgb(191 85% 86%)'"/>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent class="flex w-auto gap-x-3">
              <DialogTrigger as-child>
                <Button
                    variant="secondary"
                    class="h-[30px]"
                    :disabled="isLoading"
                >
                  <ImagePlus class="pr-1" color="black"/>
                  Create
                </Button>
              </DialogTrigger>
              <Button
                  variant="outline"
                  class="h-[30px]"
                  @click="removeCurrentAvatar"
                  @mouseenter="() => removeHover = true"
                  @mouseleave="() => removeHover = false"
                  :disabled="isLoading"
              >
                <component :is="isLoading ? Loader2 : Trash2" :color="removeHover ? 'black' : 'white'"
                           class="w-4 h-4 mr-2" :class="isLoading ? 'animate-spin' : ''"/>
                {{ isLoading ? 'Removing...' : 'Remove' }}
              </Button>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change Profile Picture</p>
        </TooltipContent>
        <AvatarDialog/>
      </Dialog>
    </Tooltip>
  </TooltipProvider>
</template>