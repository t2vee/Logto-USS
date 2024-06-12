<script setup>
import {ref, inject, onMounted} from 'vue'
import { useLogto } from '@logto/vue'
import { DialogClose } from '@/components/ui/dialog/index.js'
import {Loader2, OctagonPause} from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index.js'
import axios from 'redaxios'
import { toast } from 'vue-sonner'
import {CardDescription, CardTitle} from "@/components/ui/card/index.js";
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert/index.js";

const { getAccessToken, signOut } = useLogto()
const userData = inject('userData')

const isLoading = ref(false)
const suspendComplete = ref(false)
const s = ref(20)
const support = import.meta.env.VITE_SUPPORT_EMAIL

async function deactivateAccount() {
  isLoading.value = true
  let fail;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/dangerzone/suspendme`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
    )
    if (response.status === 204) {
      suspendComplete.value = true;
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
  <MfaVerificationDialog title="Suspend Your Account" edit :icon="OctagonPause">
    <template #default>
      <Alert :class="`h-32 w-full bg-gradient-to-tl from-[#c2480c] to-30% transition-all duration-200 hover:to-60% hover:border-destructive hover:cursor-pointer`">
        <div class="flex items-center align-middle space-x-3">
          <OctagonPause color="#f67a3c"/>
          <AlertTitle class="flex justify-between text-lg text-destructive">Suspend Your Account</AlertTitle>
        </div>
        <AlertDescription class="text-destructive">Here you can suspend/disable your account and access to it. To renable your account you will have to contact support.</AlertDescription>
      </Alert>
    </template>
    <template #body>
      <div v-if="suspendComplete" class="flex flex-col items-center align-middle justify-center">
        <CardTitle>Account Suspension Complete</CardTitle>
        <CardDescription>You will soon be logged out of all devices and sessions</CardDescription>
      </div>
      <div v-else class="flex flex-col items-center align-middle justify-center">
        <div class="mb-8 w-full">
          <p class="text-md text-center text-destructive">
        <span class="font-bold text-destructive">
          THIS IS A DESTRUCTIVE ACTION!
        </span>
            You will not be able to log back into your account once done. In the the future, if you do wish to reactivate your account, send a reactivation request to
            <span class="font-bold text-destructive">
          {{ support }}
        </span>
            from your current account email.
          </p>
          <br />
          <div class="flex flex-col items-center justify-evenly">
            <p>Currently Connected Email:</p>
            <strong>{{ userData.email }}</strong>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <DialogClose as-child>
        <Button type="button" variant="outline" class="h-[30px]"> Cancel </Button>
      </DialogClose>
      <Button
          @click="deactivateAccount"
          variant="destructive"
          class="h-[30px]"
          :disabled="s > 0 || isLoading"
      >
        <Loader2 v-if="s > 0 || isLoading" class="w-4 h-4 mr-2 animate-spin" />
        {{ s > 0 ? s : 'Deactivate' }}
      </Button>
    </template>
  </MfaVerificationDialog>
</template>