<script setup>
import { ref } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog/index.js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs/index.js'

import AvatarGallery from '@/components/Base/Avatar/AvatarGallery.vue'
import ImageUploader from '@/components/Base/Avatar/ImageUploader.vue'
import {Button} from "@/components/ui/button/index.js";
import {Loader2} from "lucide-vue-next";


const isLoading = ref(false)
</script>

<template>
  <DialogContent class="pb-16">
    <DialogHeader>
      <DialogTitle>Edit Avatar</DialogTitle>
      <DialogDescription class="text-xs">
        Respect the rights of others. Only upload images that you own or that you have written
        permission to freely distribute. Like most other online services, your avatar will be
        visible to other users of the service and associated with your Account, even if your profile
        is set to "no one can see".
      </DialogDescription>
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
  </DialogContent>
</template>
