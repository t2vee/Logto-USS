<script setup>
import { ref } from 'vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Card } from "@/components/ui/card/index.js";
import { Link2, Link2Off, ChevronDown } from 'lucide-vue-next';
import ConnectorProcessDrawer from "@/components/SettingsPages/ConnectionPageComponents/ConnectorProcessDrawer.vue";

const isOpen = ref(false)

defineProps({
  image: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  linked: Boolean
})
</script>

<template>
  <Card class="w-full bg-gradient-to-tl from-[#6c888e] to-30% transition-all duration-200 hover:to-60% hover:border-[#abd9e2] mb-4 p-4">
    <Collapsible v-model:open="isOpen">
      <CollapsibleTrigger class="flex items-center align-middle justify-between w-full">
        <img class="max-w-24" :src="image" :alt="service" >
        <ChevronDown :class="{ 'rotate-180': isOpen }" />
        <div class="flex gap-x-2 items-center align-middle">
          <p class="text-gray-500">{{ linked ? '' : 'Not' }} Linked</p>
          <Link2Off v-if="!linked" color="#718096" />
          <Link2 v-else color="" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="flex">
        <div class="w-1/2 p-2">
          <p class="text-gray-400 text-sm">Click "Link" to visit {{ service }} and link your {{ service }} and MXS accounts. Please note that as part of linking these accounts, Google will share some of your data with MXS.</p>
        </div>
        <div class="w-1/2 flex flex-col items-center align-middle justify-center gap-y-2">
          <ConnectorProcessDrawer :service="service" />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </Card>
</template>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease-in-out;
}
</style>