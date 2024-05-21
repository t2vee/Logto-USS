<script setup>
import { ref } from 'vue'
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
  PinInputSeparator
} from '@/components/ui/pin-input/index.js'
import Button from '../ui/button/Button.vue'

defineProps({
  resendCodeTimer: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['codeComplete', 'resendCode', 'changeInput'])
const value = ref([])

const handleComplete = (e) => emit('codeComplete', e.join(''))
</script>

<template>
  <div class="flex flex-col items-center align-middle gap-3">
    <h3 class="font-bold">Input the 6 digit code sent to you</h3>
    <div>
      <PinInput id="pin-input" v-model="value" placeholder="" @complete="handleComplete" otp type="number">
        <PinInputGroup class="">
          <template v-for="(id, index) in 6" :key="id">
            <PinInputInput
              class="rounded-xl border bg-popover-foreground text-black"
              :index="index"
            />
            <template v-if="index !== 5">
              <PinInputSeparator />
            </template>
          </template>
        </PinInputGroup>
      </PinInput>
      <div class="flex align-middle items-center justify-around">
        <Button
          :disabled="resendCodeTimer > 0"
          variant="link"
          class="text-xs"
          @click="emit('resendCode')"
        >
          {{ resendCodeTimer <= 0 ? 'Resend Code' : `Resend Code in ${resendCodeTimer}s` }}
        </Button>
        <Button variant="link" class="text-xs" @click="emit('changeInput')"> Change Method </Button>
      </div>
    </div>
  </div>
</template>
