<script setup>

import {
  DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog/index.js";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs/index.js";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card/index.js";
import {Button} from "@/components/ui/button/index.js";
const AvatarGallery = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/AvatarGallery.vue"));
const ImageUploader = defineAsyncComponent(() => import("@/components/SettingsPages/AboutMePageComponents/AvatarComponents/ImageUploader.vue"));
import {defineAsyncComponent, ref} from "vue";


const imageUploaderRef = ref(null);

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
        <TabsTrigger value="upload">
          Upload Image
        </TabsTrigger>
        <TabsTrigger value="gallery">
          Avatar Gallery
        </TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload Custom Avatar Image</CardTitle>
            <CardDescription>
              Supports SVG, PNG, JPEG, JPG, ICO File Types.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <ImageUploader ref="imageUploaderRef" />

          </CardContent>
          <CardFooter>
            <p class="text-xs font-bold">Maximum 500kb Upload Size</p>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="gallery">
        <AvatarGallery />
      </TabsContent>
    </Tabs>
    <DialogFooter>
      <Button @click="saveImage">Save</Button>
      <DialogClose as-child>
        <Button type="button" variant="outline">
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</template>

<style scoped>

</style>