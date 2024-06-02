<script setup>
import {onMounted} from "vue";
import { useLogto } from '@logto/vue';

const { signIn } = useLogto();

onMounted(() => signIn(`${import.meta.env.VITE_ROOT}/oauth/callback`));
</script>

<template>
  <p>redirecting...</p>
</template>