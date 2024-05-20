<script setup>
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col h-screen max-w-[1000px] items-center">
      <img class="logo" src="https://cdn.vstatic.net/content/KQgCslvqJtiMCkBKQmZp/t2v.ch/img/404_minified.webp" alt="logo" />
      <p>you seem lost</p>
      <Button variant="link" @click="() => $router.push('/account/aboutme')">
        return home?
      </Button>
    </div>
  </div>
</template>