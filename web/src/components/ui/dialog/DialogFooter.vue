<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <!-- flex flex-col-reverse sm:flex-row sm:justify-end  -->
  <div
    :class="
      cn(
        'flex absolute w-full justify-between bottom-4 sm:gap-x-2 px-5 align-middle items-center',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
