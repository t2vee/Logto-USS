<script setup>
import { computed } from 'vue'
import { MailCheck, MailWarning, PhoneMissed, Phone } from 'lucide-vue-next'

const props = defineProps({
  detailVerified: {
    type: Boolean,
    required: true
  },
  detailType: {
    type: String,
    required: true,
    validator: (value) => ['email', 'phone'].includes(value)
  }
})

const icon = computed(() => {
  if (props.detailType === 'email') {
    return props.detailVerified ? MailCheck : MailWarning
  } else {
    return props.detailVerified ? Phone : PhoneMissed
  }
})

const message = computed(() => {
  let typeMessage = props.detailType === 'email' ? 'Email' : 'Phone'
  return props.detailVerified ? `${typeMessage} Verified` : `${typeMessage} Not Verified`
})

const verifiedClass = computed(() => [
  'font-bold',
  props.detailVerified ? 'text-green-500' : 'text-red-500'
])
</script>

<template>
  <div>
    <h4 :class="verifiedClass" class="flex text-xs justify-center items-center">
      <component :is="icon" class="px-1" />
      {{ message }}
    </h4>
  </div>
</template>
