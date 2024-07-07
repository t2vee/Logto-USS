<script setup>
import {computed} from 'vue'
import {DiscordIcon, GitHubIcon, GoogleIcon} from 'vue3-simple-icons'
import {Card} from '@/components/ui/card/index.js'

const props = defineProps({
  userConnector: {
    type: Object,
    required: true
  }
})

const socialConnectorData = {
  discord: {
    name: 'Discord',
    primaryColour: '#5865F2',
    bgColour: '#051295',
    iconComponent: DiscordIcon,
    classes: 'bg-[#051295] border-t-[#5865F2]'
  },
  github: {
    name: 'Github',
    primaryColour: '#fff',
    bgColour: '#24292f',
    iconComponent: GitHubIcon,
    classes: 'bg-[#24292f] border-t-[#fff]'
  },
  google: {
    name: 'Google',
    primaryColour: '#d05f16',
    bgColour: '#881300',
    iconComponent: GoogleIcon,
    classes: 'bg-[#881300] border-t-[#d05f16]'
  }
}

const connector = computed(() => {
  if (props.userConnector.discord) {
    return socialConnectorData.discord
  } else if (props.userConnector.github) {
    return socialConnectorData.github
  }
  return socialConnectorData.google
})
</script>

<template>
  <Card
    class="w-full h-[30px] rounded-t-lg rounded-b-none flex items-center align-middle justify-evenly"
    :class="connector.classes"
  >
    <component :is="connector.iconComponent" :fill="connector.primaryColour" />
    <p class="text-xs">
      You are connected using {{ connector.name }}. Some user details are omitted and cannot be
      changed.
    </p>
  </Card>
</template>
