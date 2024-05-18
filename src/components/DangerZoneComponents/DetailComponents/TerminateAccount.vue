<script setup>
import {ref, onMounted} from 'vue'
import { useLogto } from '@logto/vue'
import { DialogClose, DialogFooter } from '@/components/ui/dialog/index.js'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index.js'
import axios from 'axios'
import { toast } from 'vue-sonner'
import {CardDescription, CardTitle} from "@/components/ui/card/index.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const { getAccessToken, signOut } = useLogto()

const isLoading = ref(false)
const terminationComplete = ref(false)
const s = ref(20)

async function terminateAccount() {
  isLoading.value = true
  let fail;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/dangerzone/terminate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
    )
    if (response.status === 204) {
      terminationComplete.value = true;
      toast.success('Action Completed Successfully', {
        description: 'Sorry to see you go :('
      })
    }
  } catch (error) {
    toast.error('Error Completing Action:', { description: 'Service Unavailable. Try again later' })
    fail = true
  } finally {
    isLoading.value = false
    if (!fail) {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      await signOut(import.meta.env.VITE_ROOT)
    }
  }
}

const countdown = () => {
  const interval = setInterval(() => {
    if (s.value > 0) {
      s.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

onMounted(countdown)
</script>

<template>
  <div v-if="terminationComplete" class="flex flex-col items-center align-middle justify-center">
    <CardTitle>Account Termination Complete</CardTitle>
    <CardDescription>You will soon be logged out of all devices and sessions</CardDescription>
  </div>
  <div v-else class="flex flex-col items-center align-middle justify-center">
    <div class="mb-8 w-full">
      <p class="text-md text-center text-red-500">
        <span class="font-bold text-red-600">THIS IS A DESTRUCTIVE ACTION!</span> You will not be able to log back into your account once done. All data from your account will be permanently deleted. Support will NOT be able to restore your account once gone.
      </p>
      <br />
    </div>
    <DialogFooter>
      <div class="flex space-x-7 items-center align-middle">
        <div class="flex space-x-2">

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button
                  class="h-[30px] bg-red-600 hover:bg-red-800"
                  :disabled="s > 0 || isLoading"
              >
                <Loader2 v-if="s > 0 || isLoading" class="w-4 h-4 mr-2 animate-spin" />
                {{ s > 0 ? s : 'Confirm' }}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This is your last chance. This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel class="h-[30px]">Cancel</AlertDialogCancel>
                <AlertDialogAction class="h-[30px] bg-red-600 hover:bg-red-800" @click="terminateAccount">Terminate</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DialogClose as-child>
            <Button type="button" variant="outline" class="h-[30px]"> Cancel </Button>
          </DialogClose>
        </div>
      </div>
    </DialogFooter>
  </div>
</template>