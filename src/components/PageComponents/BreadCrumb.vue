<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Button from "@/components/ui/button/Button.vue";

const route = useRoute();

const currentRouteName = computed(() => {
  const nameMappings = {
    'aboutme': 'About Me',
    'security': 'Security',
    'privacy': 'Privacy',
    'notifications': 'Notifications',
    'yourdata': 'Your Data',
  };

  return nameMappings[route.name];
});
</script>

<template>
  <nav aria-label="breadcrumb" class="text-sm font-semibold">
    <ol class="flex space-x-2">
      <li>
        <a class="red" href="">
          Home
        </a>
      </li>
      <li>/</li>
      <li>
        <a class="red" href="/">
          My Account
        </a>
      </li>
      <li v-if="currentRouteName" >/</li>
      <li v-if="currentRouteName" class="capitalize">{{ currentRouteName }}</li>
    </ol>
  </nav>
</template>