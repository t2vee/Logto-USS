<script setup>
import { ref, onUnmounted, defineAsyncComponent } from 'vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Card } from '@/components/ui/card/index.js'
import { Link2, Link2Off, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ConnectorProcessDrawer from '@/components/SettingsPages/ConnectionPageComponents/ConnectorProcessDrawer.vue';
import { eventBus } from '@/lib/eventBus.js'

const props = defineProps({
  image: String,
  icon: Object,
  service: {
    type: String,
    required: true
  },
  linked: Boolean
})

const isOpen = ref(false)
function closeOther() {
  eventBus.emit('flipCollapsibleValues', props.service)
}
const handleStateChange = (data) => {
  if (data !== props.service) {
    isOpen.value ? (isOpen.value = false) : (isOpen.value = false)
  }
}
const cleanup = eventBus.on('flipCollapsibleValues', handleStateChange)

onUnmounted(cleanup)
</script>

<template>
  <Card
    class="w-full bg-gradient-to-tl from-[#6c888e] to-30% transition-all duration-200 hover:to-60% hover:border-[#abd9e2] mb-4 p-4"
  >
    <Collapsible v-model:open="isOpen" @update:open="closeOther">
      <CollapsibleTrigger class="flex items-center align-middle justify-between w-full">
        <div class="flex gap-x-4">
          <component :is="icon" color="white" />
          <p>{{ service }}</p>
        </div>
        <div class="flex gap-x-3">
          <div class="flex gap-x-2 items-center align-middle">
            <p :class="linked ? 'text-green-500' : 'text-gray-500'">
              {{ linked ? '' : 'Not' }} Linked
            </p>
            <Link2Off v-if="!linked" color="#718096" />
            <Link2 v-else color="#48bb78" />
          </div>
          <ChevronDown :class="{ 'rotate-180': isOpen }" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="flex" v-if="!linked">
        <div class="w-1/2 p-2">
          <p class="text-gray-400 text-sm">
            Click "Link" to visit {{ service }} and link your {{ service }} and MXS accounts. Please
            note that as part of linking these accounts, {{ service }} will share some of your data
            with MXS.
          </p>
        </div>
        <div class="w-1/2 flex flex-col items-center align-middle justify-center gap-y-2">
          <ConnectorProcessDrawer :service-img="image" :service-icon="icon" :service="service" />
        </div>
      </CollapsibleContent>
      <CollapsibleContent v-else class="flex">
        <div class="w-1/2 p-2">
          <p class="text-gray-400 text-sm">
            Click to immediately remove the connector from your account.
          </p>
        </div>
        <div class="w-1/2 flex flex-col items-center align-middle justify-center gap-y-2">
          <Button variant="destructive"> Remove Connector </Button>
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
