<script setup>
import { ref, inject } from 'vue'
import { useLogto } from '@logto/vue'
import { DialogClose, DialogFooter } from '@/components/ui/dialog/index.js'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index.js'
import axios from 'axios'
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js'

const { getAccessToken } = useLogto()
const isLoading = ref(false)
const userData = inject('userData')

async function removeNumber() {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/edit/remove-sms`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 204) {
      toast.success('Number Successfully Removed', {
        description: 'You can now add a new number to your account.'
      })
    }
  } catch (error) {
    toast.error('Error Removing Number:', { description: 'Service Unavailable. Try again later' })
  } finally {
    isLoading.value = false
    eventBus.emit('closeEditDetailDialog', false)
    eventBus.emit('refreshUserData', true)
  }
}
</script>

<template>
  <div class="flex flex-col items-center align-middle justify-center">
    <div class="mb-8 w-full">
      <p class="font-bold text-sm">
        You can only have one number per account. To change your connected number, remove it first
        then add a number as normal.
      </p>
      <br />
      <div class="flex justify-evenly">
        <p>Currently Connected Number:</p>
        <strong>{{ userData.phone_number }}</strong>
      </div>
    </div>
    <DialogFooter>
      <div class="flex space-x-7 items-center align-middle">
        <div class="flex space-x-2">
          <Button
            @click="removeNumber"
            variant="destructive"
            class="h-[30px]"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            Remove
          </Button>
          <DialogClose as-child>
            <Button type="button" variant="outline" class="h-[30px]"> Cancel </Button>
          </DialogClose>
        </div>
      </div>
    </DialogFooter>
  </div>
</template>

<style scoped></style>
