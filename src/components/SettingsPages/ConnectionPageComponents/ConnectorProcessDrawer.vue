<script setup>
import { ref } from 'vue';
import {
  Drawer,
  DrawerClose, DrawerContent,
  DrawerDescription, DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer/index.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {Button} from "@/components/ui/button";
import {Link} from "lucide-vue-next";
const progress = ref(13);

defineProps({
  service: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <Drawer>
    <DrawerTrigger>
      <Button>
        <Link color="black" class="mr-1"/>
        <strong class="text-black">Begin Link Process</strong>
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="flex justify-between items-center align-middle">
        <Progress :model-value="33" class="w-full" />
        <DrawerClose>
          <Button variant="outline" class="rounded-xl h-6">
            Cancel
          </Button>
        </DrawerClose>
      </DrawerHeader>
      <div class="min-h-80 w-full flex gap-x-4 mb-12">
        <Card class="w-[33%] ml-4">
          <CardHeader class="flex items-center">
            <CardTitle>Step 1:</CardTitle>
            <CardTitle>Review your privacy settings</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            Card Content
          </CardContent>
          <CardFooter>
            Card Footer
          </CardFooter>
        </Card>
        <Card class="w-[33%]">
          <CardHeader class="flex items-center">
            <CardTitle>Step 2:</CardTitle>
            <CardTitle>Head over to {{ service }} to authorise the link</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            Card Content
          </CardContent>
          <CardFooter>
            Card Footer
          </CardFooter>
        </Card>
        <Card class="w-[33%] mr-4">
          <CardHeader class="flex items-center">
            <CardTitle>Step 3:</CardTitle>
            <CardTitle>Finalise the connection details</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            Card Content
          </CardContent>
          <CardFooter>
            Card Footer
          </CardFooter>
        </Card>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<style scoped>

</style>