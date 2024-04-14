<script setup>
import {ref, computed, inject} from 'vue';
import { useLogto } from "@logto/vue";
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {Loader, MailCheck, MailX, CornerDownRight, ArrowBigRightDash} from 'lucide-vue-next';
import {Button} from "@/components/ui/button/index.js";
import {DialogClose, DialogFooter} from "@/components/ui/dialog/index.js";
import MfaCodeInput from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/MfaCodeInput.vue";
import axios from "axios";
import {toast} from "vue-sonner";
import {eventBus} from "@/lib/eventBus.js";
import ConnectorAlert from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/ConnectorAlert.vue";


const userData = inject('userData')
const userConnectorPresent = inject('userConnectorPresent')

const { getAccessToken } = useLogto();
const accessTokenRef = ref('');
const emailSent = ref(false);
const isLoading = ref(false);
const emailVerified = ref(false);
const resendCodeTimer = ref(60)
const readyToSend = ref(true)
const footer = import.meta.env.VITE_EDIT_DIALOG_FOOTER_LINK;


const countdown = () => {
  const interval = setInterval(() => {
    if (resendCodeTimer.value > 0) {
      resendCodeTimer.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const email = ref('');

const emailRegex = new RegExp(/^[\w-\.]+(?:\+[\w]+)?@([\w-]+\.)+[\w-]{2,7}$/);

const isEmailValid = computed(() => {
  return emailRegex.test(email.value);
});

const isEditing = computed(() => {
  return email.value.length > 0;
});


async function sendVerificationCode() {
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
  accessTokenRef.value = accessToken;
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/user-data-entry/new-verify-method/push-email`, {
      email: email.value,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    emailSent.value = response.status === 204;
  } catch (error) {
    toast.error('Error Sending Verification Code:',{description: 'Service Unavailable. Try again later'})
    emailSent.value = error.response && error.response.status === 404;
  } finally {
    isLoading.value = false;
    resendCodeTimer.value = 60;
    countdown()
    toast.info('Sent Email to ' + email.value, {description: 'Code will last for 10 minutes.'})
  }
}

async function handleCodeResend() {
  await sendVerificationCode()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function handleChangeInput() {
  readyToSend.value = false;
  emailSent.value = false;
  sleep(resendCodeTimer.value * 1000).then(() => { readyToSend.value = true });
}

const handleCodeComplete = async (code) => {
  isLoading.value = true;
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/user-data-entry/new-verify-method/verify-email?verification-code=${code}&user-id=${userData.value.sub}`,
        {email: email.value},
        {
          headers: {
            'Authorization': `Bearer ${accessTokenRef.value}`,
            'Content-Type': 'application/json'
          }
        }
    );
    emailSent.value = response.status === 204;
    if (response.status === 204) {
      toast.success('Successfully Verified', {description: `${email.value} has been successfully added to your account.`})
    }
    emailVerified.value = !(response.status === 204);
  } catch (error) {
    toast.error('Error sending verification code:',{description: error})
    emailSent.value = false;
  } finally {
    isLoading.value = false;
    eventBus.emit('closeEditDetailDialog', false);
    eventBus.emit('refreshUserData', true);
  }
};
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="!isLoading && !emailSent" class="flex flex-col gap-4 items-center align-middle">
      <ConnectorAlert v-if="userConnectorPresent" />
      <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
        <Label for="email" class="flex font-bold w-full justify-between">
          Email
          <span v-if="isEmailValid && isEditing" class="text-xs text-green-500">Valid Email</span>
          <span v-else-if="!isEmailValid && isEditing" class="text-xs text-red-500">Invalid Email Format</span>
        </Label>
        <Input
            :disabled="userConnectorPresent"
            id="email"
            v-model="email"
            :class="{
              'border-red-500': !isEmailValid && isEditing,
               'border-green-500': isEmailValid && isEditing
              }"
            :placeholder="userConnectorPresent ? userData.email : 'Enter your email'"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pt-5 pr-3">
          <MailCheck  v-if="isEmailValid && isEditing" class="text-green-500" />
          <MailX  v-else-if="!isEmailValid && isEditing" class="text-red-500" />
        </div>
      </div>
      <p class="text-xs" v-if="resendCodeTimer>0 && !readyToSend">Please wait {{ resendCodeTimer }} seconds before sending another code</p>
      <DialogFooter>
        <div class="flex space-x-8 items-center align-middle">
          <Button variant="link" as-child>
            <a target="_blank" :href="footer">
              Privacy and Cookies Policy
            </a>
          </Button>
          <div class="space-x-2">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button class="h-[30px]" :disabled="!isEmailValid || userConnectorPresent || resendCodeTimer>0 && !readyToSend">
                  Verify
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription class="space-y-4">
                    Changing your email means that you will <strong>no longer</strong> be able to:
                    <ul class="space-y-1">
                      <li class="flex items-center align-middle"><ArrowBigRightDash /> Login with {{ userData.email }}</li>
                      <li class="flex items-center align-middle"><ArrowBigRightDash /> Contact us with {{ userData.email }}</li>
                      <li class="flex items-center align-middle"><ArrowBigRightDash /> Receive any mail with {{ userData.email }}</li>
                      <li class="flex items-center align-middle"><ArrowBigRightDash /> Verify your identity with {{ userData.email }}</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="sendVerificationCode">I'm Sure</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DialogClose as-child>
              <Button type="button" variant="outline" class="h-[30px]">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogFooter>
    </div>
    <div v-else-if="isLoading" class="flex items-center align-middle">
      <Loader class="animate-spin" :size="32" />
      <p class="text-xl font-bold">Loading...</p>
    </div>
    <div v-else-if="!isLoading && emailSent">
      <MfaCodeInput :resend-code-timer="resendCodeTimer" @codeComplete="handleCodeComplete" @resendCode="handleCodeResend" @changeInput="handleChangeInput" />
    </div>
  </transition>
</template>


<style scoped>

</style>