<script setup>
import {defineAsyncComponent, ref} from "vue";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog/index.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const AvatarGallery = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/AvatarGallery.vue"));
const ImageUploader = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/ImageUploader.vue"));

const isLoading = ref(false)
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Avatar</DialogTitle>
      <DialogDescription class="text-xs">
        Respect the rights of others. Only upload images that you own or that you have written permission to freely distribute. Like most other online services, your avatar will be visible to other users of the service and associated with your MXS ID, even if your profile is set to "no one can see". Inappropriate avatars will result in a Permanent Suspension.

      </DialogDescription>
    </DialogHeader>
    <Tabs default-value="upload" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="upload" :disabled="isLoading">
          Upload Image
        </TabsTrigger>
        <TabsTrigger value="gallery" :disabled="isLoading">
          Avatar Gallery
        </TabsTrigger>
      </TabsList>
      <transition name="fade" mode="out-in">
        <TabsContent value="upload" force-mount>
          <ImageUploader v-model="isLoading" />

        </TabsContent>
      </transition>
      <transition name="fade" mode="out-in">
        <TabsContent value="gallery" force-mount>
          <AvatarGallery v-model="isLoading" />
        </TabsContent>
      </transition>
    </Tabs>

  </DialogContent>
</template>