<script setup>
defineProps({
  imageUrl: String,
  selected: Boolean
});

import { CheckCircle } from "lucide-vue-next";
</script>

<template>
  <div class="relative cursor-pointer" :class="{ 'ring-4 ring-white rounded-lg': selected }">
    <img :src="imageUrl" alt="Avatar" class=" rounded-lg object-cover" />
    <div v-if="selected" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg">
      <CheckCircle fill="rgb(34 197 94)" class=" text-2xl" />
    </div>
  </div>
</template>

<style scoped>
</style>
