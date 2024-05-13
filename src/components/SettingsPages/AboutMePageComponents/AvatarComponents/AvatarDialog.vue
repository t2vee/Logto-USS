<script setup>
import {defineAsyncComponent, ref} from "vue";
import {
  DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog/index.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-vue-next';

const AvatarGallery = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/AvatarGallery.vue"));
const ImageUploader = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/ImageUploader.vue"));

const isLoading = ref(false)
const imageUploaderRef = ref(null);
const selectedTab = ref('upload');

const saveImage = () => {

  imageUploaderRef.value.uploadFileWrapper();
};
</script>

<template>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Avatar</DialogTitle>
      <DialogDescription class="text-xs">
        Respect the rights of others. Only upload images that you own or that you have written permission to freely distribute. Like most other online services, your avatar will be visible to other users of the service and associated with your MXS ID, even if your profile is set to "no one can see." Please read our User Agreement for more information.

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
        <TabsContent value="upload" v-if="selectedTab === 'upload'" force-mount>
          <Card>
            <CardHeader>
              <CardTitle>Upload Custom Avatar Image</CardTitle>
              <CardDescription>
                Supports SVG, PNG, GIF, JPG, ICO, WEBP, BMP File Types.
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <ImageUploader ref="imageUploaderRef" v-model="isLoading" />
            </CardContent>
            <CardFooter>
              <p class="text-xs font-bold">Maximum 1000KB (1MB) Upload Size</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </transition>
      <transition name="fade" mode="out-in">
        <TabsContent value="gallery" force-mount>
          <AvatarGallery v-model="isLoading" />
        </TabsContent>
      </transition>
    </Tabs>
    <DialogFooter>
      <Button @click="saveImage" class="h-[30px]" :disabled="isLoading">
        <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" color="black" />
        {{ isLoading ? 'Processing...' : 'Save' }}
      </Button>
      <DialogClose as-child>
        <Button type="button" variant="outline" class="h-[30px]">
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</template>