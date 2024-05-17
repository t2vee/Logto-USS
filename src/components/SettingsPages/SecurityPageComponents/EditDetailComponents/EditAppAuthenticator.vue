<script setup>
import {Button} from "@/components/ui/button/index.js";
import {onMounted} from "vue";

defineProps({
  mfaMethods: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="space-y-3 flex flex-col items-center mt-[-30px] mb-10">
    <p class="text-sm w-2/3 text-center">
      Use a app authenticator to greatly increase the security of your account. Some popular 2FA solutions are Google/Microsoft Authenticator.
    </p>
    <div v-if="mfaMethods[0] === 'Totp'">
      content
    </div>
    <div v-else>
      <Button class="h-[30px]">
        Setup App Authenticator
      </Button>
    </div>
  </div>
</template>