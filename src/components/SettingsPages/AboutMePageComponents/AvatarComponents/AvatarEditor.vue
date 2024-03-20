<script setup>
import { ref } from 'vue';
import ImageUploader from "@/components/SettingsPages/AboutMePageComponents/AvatarComponents/ImageUploader.vue";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SquarePen } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AvatarGallery from "@/components/SettingsPages/AboutMePageComponents/AvatarComponents/AvatarGallery.vue";

const imageUploaderRef = ref(null);

const saveImage = () => {
  imageUploaderRef.value.uploadFileWrapper();
};
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
  </Dialog>
</template>

<style scoped>

</style>