<script setup>
import {ref} from 'vue'
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog/index.js'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs/index.js'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import AvatarGallery from '@/components/Base/Avatar/AvatarGallery.vue'
import ImageUploader from '@/components/Base/Avatar/ImageUploader.vue'
import {createReusableTemplate, useMediaQuery} from "@vueuse/core";
import {ImagePlus} from "lucide-vue-next";


const isLoading = ref(false)
const isDesktop = useMediaQuery('(min-width: 1023px)')
const [UseDisclaimerText, DisclaimerText] = createReusableTemplate()
</script>

<template>
  <UseDisclaimerText>
    Respect the rights of others. Only upload images that you own or that you have written
    permission to freely distribute. Like most other online services, your avatar will be
    visible to other users of the service and associated with your Account, even if your profile
    is set to "no one can see".
  </UseDisclaimerText>
  <DialogHeader class="tablet:my-5">
    <DialogTitle class="text-2xl flex tablet:flex-col items-center align-middle">
      <ImagePlus class="desktop:pr-1" :size="32" />
      Edit Avatar
    </DialogTitle>
    <DialogDescription class="text-xs" v-if="isDesktop">
      <DisclaimerText />
    </DialogDescription>
    <Popover v-else>
      <PopoverTrigger as-child>
        <Button variant="link" size="xs" class="text-sm dark:text-primary">
          Disclaimer
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <DisclaimerText />
      </PopoverContent>
    </Popover>
  </DialogHeader>
  <Tabs default-value="upload" class="w-full h-full">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="upload" :disabled="isLoading"> Upload Image </TabsTrigger>
      <TabsTrigger value="gallery" :disabled="isLoading"> Avatar Gallery </TabsTrigger>
    </TabsList>
    <TabsContent value="upload" force-mount>
      <ImageUploader v-model="isLoading" />
    </TabsContent>
    <TabsContent value="gallery">
      <AvatarGallery v-model="isLoading" />
    </TabsContent>
  </Tabs>
</template>
