<script setup>
import {onMounted, ref} from 'vue'
import {useLogto} from '@logto/vue'
import {DialogClose} from '@/components/ui/dialog/index.js'
import {AlertTriangle, Loader2, Undo2} from 'lucide-vue-next'
import {Button} from '@/components/ui/button/index.js'
import axios from 'redaxios'
import {toast} from 'vue-sonner'
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
} from '@/components/ui/alert-dialog/index.js'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert/index.js";
import {createReusableTemplate, useMediaQuery} from "@vueuse/core";
import {API} from "@/lib/apiRouteMap.js";

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
        API.DANGERZONE.TERMINATE,
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

const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <UseFooterTemplate>
    <DialogClose as-child>
      <Button type="button" variant="outline" class="desktop:h-[30px] tablet:w-full">
        <Undo2 class="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </DialogClose>
    <AlertDialog>
      <AlertDialogTrigger as-child>
        <Button
            class="desktop:h-[30px] tablet:w-full bg-red-600 hover:bg-red-800"
            :disabled="s > 0 || isLoading"
        >
          <Loader2 v-if="s > 0 || isLoading" class="w-4 h-4 mr-2 animate-spin" />
          <AlertTriangle v-else class="w-4 h-4 mr-2" />
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
          <AlertDialogCancel class="desktop:h-[30px]">Cancel</AlertDialogCancel>
          <AlertDialogAction class="desktop:h-[30px] bg-red-600 hover:bg-red-800" @click="terminateAccount">Terminate</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </UseFooterTemplate>

  <MfaVerificationDialog title="Terminate Your Account" edit :icon="AlertTriangle">
    <template #default>
      <Alert :class="`h-32 w-full bg-gradient-to-tl from-[#7a1414] to-30% transition-all duration-200 hover:to-60% hover:border-[#dc2626] hover:cursor-pointer`">
        <div class="flex items-center align-middle space-x-3">
          <AlertTriangle :color="'rgb(220 38 38)'"/>
          <AlertTitle class="flex justify-between text-lg text-red-600">
            Terminate Your Account
          </AlertTitle>
        </div>
        <AlertDescription class="text-red-600">
          Completely terminate your account and remove all data connected to it. This action is irreversible!
        </AlertDescription>
      </Alert>
    </template>
    <template #body>
      <div v-if="terminationComplete" class="flex flex-col items-center align-middle justify-center">
        <CardTitle>Account Termination Complete</CardTitle>
        <CardDescription>You will soon be logged out of all devices and sessions</CardDescription>
      </div>
      <div v-else class="flex flex-col items-center align-middle justify-center space-y-2">
        <div class="mb-8 w-full">
          <p class="text-md text-center text-red-500">
            <span class="font-bold text-red-600">THIS IS A DESTRUCTIVE ACTION!</span> You will not be able to log back into your account once done. All data from your account will be permanently deleted. Support will NOT be able to restore your account once gone.
          </p>
          <br />
        </div>
      </div>
    </template>
    <template #footer v-if="isDesktop">
      <FooterTemplate />
    </template>
    <template #drawerFooter v-else>
      <FooterTemplate />
    </template>
  </MfaVerificationDialog>
</template>