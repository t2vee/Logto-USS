<script setup>
import { CardDescription, CardTitle } from '@/components/ui/card/index.js'
import EditDeveloperStatus from "@/components/Pages/DeveloperOptions/EditDeveloperStatus.vue";
import {Code} from "lucide-vue-next";
</script>

<template>
  <div class="w-screen desktop:w-[600px] phone:px-12 tablet:px-32 ">
    <CardTitle class="my-4 flex">
      <Code class="mr-1" />
      Developer Options
    </CardTitle>
    <CardDescription class="mb-6">
      Enabling a developer account will give you access to your developer dashboard where you can create and manage applications.
    </CardDescription>
    <EditDeveloperStatus />
  </div>
</template>
