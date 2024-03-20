<script setup>
import { useHandleSignInCallback } from '@logto/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const { isLoading } = useHandleSignInCallback(() => {
  router.push({ path: 'account/aboutme' })
});
</script>

<template>
  <h1>Success!</h1>
  <p v-if="isLoading">Redirecting...</p>
</template>

<style scoped>

</style>