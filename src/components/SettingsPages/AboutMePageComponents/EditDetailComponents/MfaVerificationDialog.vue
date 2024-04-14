<script setup>
import { watch, ref } from 'vue';
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useLogto } from "@logto/vue";
import { Loader, Loader2, Shield } from 'lucide-vue-next';
import axios from "axios";
import {
  DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog/index.js";
import {Button} from "@/components/ui/button/index.js";
import MfaCodeInput from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/MfaCodeInput.vue";
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js';


const props = defineProps({
  isVisible: Boolean,
  title: {
    type: String,
    required: true,
  },
  editPage: {
    type: Object,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
  icon: {
    required: true,
  }
});

const { getAccessToken } = useLogto();
const isMfaRequired = ref(false);
const codeSent = ref(false);
const isLoading = ref(true);
const mfaOptions = ref({});
const accessTokenRef = ref('');
const selectedMfaMethod = ref('email');
const resendCodeTimer = ref(60)
const readyToSend = ref(true)

const countdown = () => {
  const interval = setInterval(() => {
    if (resendCodeTimer.value > 0) {
      resendCodeTimer.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

async function grabMfaOptions(accessToken) {
  try {
    return await axios.get(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/get-user-info/${props.userData.sub}/mfa-methods`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    toast.error('Error checking username availability:', {description: error})
    isMfaRequired.value = error.response && error.response.status === 404;
  }
}

async function sendVerificationCode() {
  isLoading.value = true;
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/mfa-flow/${props.userData.sub}/push-${selectedMfaMethod.value}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessTokenRef.value}`,
            'Content-Type': 'application/json'
          }
        }
    );
    codeSent.value = response.status === 204;
  } catch (error) {
    toast.error('Error sending verification code:', {description: error})
    codeSent.value = false;
  } finally {
    isLoading.value = false;
    resendCodeTimer.value = 60;
    countdown()
    if (selectedMfaMethod.value === 'email') {
      toast.info('Sent Email to ' + props.userData.email, {description: 'Code will last for 10 minutes.'})
    } else if (selectedMfaMethod.value === 'phone') {
      toast.info('Sent Text to ' + props.userData.phone_number, {description: 'Code will last for 10 minutes.'})
    }
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
  codeSent.value = false;
  sleep(resendCodeTimer.value * 1000).then(() => { readyToSend.value = true });
}

const handleCodeComplete = async (code) => {
  isLoading.value = true;
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/mfa-flow/${props.userData.sub}/verify-${selectedMfaMethod.value}-code?verification-code=${code}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessTokenRef.value}`,
            'Content-Type': 'application/json'
          }
        }
    );
    if (response.status === 204) {
      codeSent.value = true;
      isMfaRequired.value = false;
      toast.success('Successfully Verified', {description: 'You will stay verified for the next 15 minutes.'})
    }
  } catch (error) {
    toast.warning('Provided Code is Incorrect', 'Please try again')
  } finally {
    isLoading.value = false;
  }
};

const checkMFA = async () => {
  isLoading.value = true;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
  accessTokenRef.value = accessToken;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/${props.userData.sub}/is-mfa-required`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.data.status === true) {
      const mfaResponse = await grabMfaOptions(accessToken)
      mfaOptions.value = mfaResponse.data
    }
    isMfaRequired.value = response.data.status === true;
  } catch (error) {
    toast.error('Error checking MFA:',{description: 'Service Unavailable. Try again later'})
    eventBus.emit('closeEditDetailDialog', false);
    eventBus.emit('refreshUserData', true);
  } finally {
    isLoading.value = false;
  }
}

function updateSelectedMethod(value) {
  selectedMfaMethod.value = value;
}

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    checkMFA().catch(error => console.error("MFA check failed:", error));
  }
});

</script>

<template>
  <DialogContent class="sm:max-w-[425px]">
    <DialogHeader class="mb-3">
      <DialogTitle class="flex items-center align-middle"><component class="mr-1" :is="!isLoading && isMfaRequired ? Shield : icon" />{{ !isLoading && isMfaRequired ? 'Verify Your Identity' : 'Edit Your ' + title }}</DialogTitle>
      <DialogDescription class="text-xs">
        {{ !isLoading && isMfaRequired ? "In order to verify your identity, we'll send you a code to your preferred method below." : '' }}
      </DialogDescription>
    </DialogHeader>
    <transition name="fade" mode="out-in">
      <div key="mfa-settings" v-if="!isLoading && isMfaRequired && !codeSent" class="space-y-8">
        <RadioGroup default-value="email" class="space-y-3" @update:modelValue="updateSelectedMethod">
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="r1" value="email" />
            <Label for="r1">Email <strong>{{ userData.email }}</strong></Label>
          </div>
          <div v-if="userData.phone_number" class="flex items-center space-x-2">
            <RadioGroupItem id="r2" value="sms" />
            <Label for="r2">Text <strong>{{ userData.phone_number }}</strong></Label>
          </div>
          <div v-if="mfaOptions[0].type === 'Totp'" class="flex items-center space-x-2">
            <RadioGroupItem id="r3" value="authenticator" />
            <Label for="r3">Authenticator App (Google/Microsoft Authenticator)</Label>
          </div>
        </RadioGroup>
        <div class="space-x-2 w-full flex justify-end">
          <p class="text-xs" v-if="resendCodeTimer>0 && !readyToSend">Please wait {{ resendCodeTimer }} seconds before sending another code</p>
          <Button :disabled="resendCodeTimer>0 && !readyToSend" class="h-[30px]" @click="sendVerificationCode">Next</Button>
          <DialogClose as-child>
            <Button class="h-[30px]" type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </div>
      <div v-else-if="!isLoading && isMfaRequired && codeSent">
        <MfaCodeInput :resend-code-timer="resendCodeTimer" @codeComplete="handleCodeComplete" @resendCode="handleCodeResend" @changeInput="handleChangeInput" />
      </div>
      <div v-else-if="!isLoading && !isMfaRequired">
        <component :is="editPage" :user-data="userData" />
      </div>
      <div v-else-if="isLoading" class="flex items-center align-middle">
        <Loader class="animate-spin" :size="32" />
        <p class="text-xl font-bold">Loading...</p>
      </div>
    </transition>
  </DialogContent>
</template>

<style scoped>

</style>