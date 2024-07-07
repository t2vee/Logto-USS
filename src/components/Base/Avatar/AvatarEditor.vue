<script setup>
import {defineAsyncComponent, onUnmounted, ref} from 'vue'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar/index.js'
import {ImagePlus, Loader2, Pencil, Trash2} from 'lucide-vue-next'
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog/index.js'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover/index.js'
import {Button} from '@/components/ui/button/index.js'
import {eventBus} from '@/lib/eventBus.js'
import axios from 'redaxios'
import {toast} from 'vue-sonner'
import {useLogto} from '@logto/vue'
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer/index.js";
import {createReusableTemplate, useMediaQuery} from "@vueuse/core";
import {API} from "@/lib/apiRouteMap.js";

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
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
        API.AVATAR.REMOVE,
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
      eventBus.emit('refreshUserData', true)
    }
  } catch (error) {
    toast.error('Error Removing Avatar:', {description: 'Service Unavailable. Try again later'})
  } finally {
    isLoading.value = false
  }
}

const handleEvent = (data) => {
  isOpen.value = data
}
const isOpen = ref(false)
const removeHover = ref(false)
const cleanup = eventBus.on('closeEditDetailDialog', handleEvent)
onUnmounted(cleanup)

const [UseSideBarAvatarTemplate, SideBarAvatarTemplate] = createReusableTemplate()
const [UseTriggerTemplate, TriggerTemplate] = createReusableTemplate()
const [UseContentTemplate, ContentTemplate] = createReusableTemplate()

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <UseTriggerTemplate>
    <Button
        variant="secondary"
        class="h-[30px]"
        :disabled="isLoading"
    >
      <ImagePlus class="pr-1" color="black"/>
      Create
    </Button>
  </UseTriggerTemplate>
  <UseSideBarAvatarTemplate>
    <div class="relative">
      <Avatar class="w-[130px] h-[130px]">
        <AvatarImage :src="avatarUrl" alt="avatar"/>
        <AvatarFallback>{{ userName }}</AvatarFallback>
      </Avatar>
      <Button
          variant="outline"
          size="xs"
          class="absolute bottom-[-5px] right-4 transform translate-x-1/2 -translate-y-1/2"
      >
        <Pencil class="pr-2"/>
        Edit
      </Button>
    </div>
  </UseSideBarAvatarTemplate>
  <UseContentTemplate>
    <Popover>
      <PopoverTrigger>
        <SideBarAvatarTemplate />
      </PopoverTrigger>
      <PopoverContent class="flex w-auto gap-x-1 p-2">
        <DialogTrigger as-child>
          <TriggerTemplate />
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
  </UseContentTemplate>

  <Dialog v-if="isDesktop" v-model:open="isOpen">
    <ContentTemplate />
    <DialogContent class="pb-16">
      <AvatarDialog/>
    </DialogContent>
  </Dialog>
  <Drawer v-else v-model:open="isOpen">
    <DrawerTrigger>
      <SideBarAvatarTemplate />
    </DrawerTrigger>
    <DrawerContent class="px-5">
      <AvatarDialog />
    </DrawerContent>
  </Drawer>
</template>