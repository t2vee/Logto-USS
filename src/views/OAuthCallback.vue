<script setup>
import {useHandleSignInCallback} from '@logto/vue'
import {useRouter} from 'vue-router'
import {UserCheck} from 'lucide-vue-next'

const router = useRouter()

const { isLoading } = useHandleSignInCallback(() => {
  router.push({ path: '/account/aboutme' })
})
</script>

<template>
  <div class="flex flex-col items-center mt-24">
    <UserCheck :size="48" color="#80ff80" />
    <p class="font-bold text-2xl">Success!</p>
    <p v-if="isLoading">Redirecting...</p>
  </div>
</template>

<style scoped></style>
