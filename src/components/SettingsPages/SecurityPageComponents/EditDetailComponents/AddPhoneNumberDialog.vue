<script setup>
import {inject, ref} from 'vue';
import axios from 'axios';
import { useLogto } from "@logto/vue";
import { VueTelInput } from 'vue-tel-input';
import '@/assets/phone.css';
import {Button} from "@/components/ui/button/index.js";
import {DialogClose, DialogFooter} from "@/components/ui/dialog/index.js";
import {Label} from "@/components/ui/label/index.js";
import {PhoneMissed, Phone, Loader} from "lucide-vue-next";
import key from '@/lib/encryptNumber.pem.js';
import { toast } from 'vue-sonner'
import MfaCodeInput from "@/components/SettingsPages/Global/MfaCodeInput.vue";
import { eventBus } from '@/lib/eventBus.js';

const userData = inject('userData')

const { getAccessToken } = useLogto();
const phone = ref(0);
const isNumberValid = ref(false);
const isEditing = ref(true);
const accessTokenRef = ref('');
const smsSent = ref(false);
const isLoading = ref(false);
const smsVerified = ref(false);
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

const dropdownOptions = {
  showDialCodeInList: true,
  showDialCodeInSelection: true,
  showSearchBox: true,
  showFlags: true,
};

function checkNumber() {
  const phonePattern = /^\d+$/;
  if (phone.value !== "" && phonePattern.test(phone.value) && phone.value.length >= 5 && phone.value.length <= 15) {
    isNumberValid.value = true;
    isEditing.value = false;
  } else {
    isNumberValid.value = false;
    isEditing.value = true;
  }
}

async function importPublicKey() {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = key.substring(pemHeader.length, key.length - pemFooter.length);
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  return await crypto.subtle.importKey(
      "spki",
      binaryDer.buffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
  );
}

async function encryptData(publicKey, data) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  return await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encodedData
  );
}

async function sendEncryptedData(encryptedData) {
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
  accessTokenRef.value = accessToken;
  const base64EncryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  console.log(base64EncryptedData)
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/verify/push-sms`, {
      encryptedPhoneNumber: base64EncryptedData,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });
    smsSent.value = response.status === 204;
    if (response.status === 204) {
      toast.info('Sent Text to ' + phone.value, {description: 'Code will last for 10 minutes.'})
    }
  } catch (error) {
    toast.error('Error Sending Verification Code:',{description: 'Service Unavailable. Try again later'})
    isEditing.value = true;
    smsSent.value = false;
    isLoading.value = false;
    readyToSend.value = true;
    eventBus.emit('closeEditDetailDialog', false);
    eventBus.emit('refreshUserData', true);
  } finally {
    isLoading.value = false;
    resendCodeTimer.value = 60;
    countdown()
  }
}

async function handleCodeResend() {
  await verifyNumber()
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function handleChangeInput() {
  readyToSend.value = false;
  smsSent.value = false;
  sleep(resendCodeTimer.value * 1000).then(() => { readyToSend.value = true });
}

const handleCodeComplete = async (code) => {
  isLoading.value = true;
  const publicKey = await importPublicKey();
  const encryptedData = await encryptData(publicKey, phone.value);
  const base64EncryptedData = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  try {
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/verify/verify-sms?verification-code=${code}`,
        {encryptedPhoneNumber: base64EncryptedData,},
        {
          headers: {
            'Authorization': `Bearer ${accessTokenRef.value}`,
            'Content-Type': 'application/json'
          }
        }
    );
    smsSent.value = response.status === 204;
    if (response.status === 204) {
      toast.success('Successfully Verified', {description: `${phone.value} has been successfully added to your account.`})
    }
    smsVerified.value = !(response.status === 204);
  } catch (error) {
    toast.error('Error sending verification code:',{description: error})
    smsSent.value = false;
  } finally {
    isLoading.value = false;
    eventBus.emit('closeEditDetailDialog', false);
    eventBus.emit('refreshUserData', true);
  }
};

async function verifyNumber() {
  if (!isNumberValid.value || !phone.value) return;
  isLoading.value = true;
  try {
    const publicKey = await importPublicKey();
    const encryptedData = await encryptData(publicKey, phone.value);
    await sendEncryptedData(encryptedData);
  } catch (error) {
    console.log('failed:', error);
    isLoading.value = false;
  }
}
</script>

<template>
  <transition name="fade" mode="out-in">
    <div v-if="!isLoading && !smsSent" class="flex flex-col gap-4 py-4 items-center align-middle space-y-10">
      <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
        <Label for="email" class="flex font-bold w-full justify-between">
          Enter Number
          <span v-if="isNumberValid && !isEditing" class="text-xs text-green-500">Valid Number</span>
          <span v-else-if="!isNumberValid && !isEditing" class="text-xs text-red-500">Invalid Number</span>
        </Label>
        <vue-tel-input
            v-model="phone"
            mode="international"
            default-country="au"
            :dropdown-options="dropdownOptions"
            :valid-characters-only="true"
            :preferred-countries="['au', 'nz', 'us', 'gb', 'ca']"
            class="w-72"
            @validate="checkNumber"
        >
        </vue-tel-input>
        <div class="absolute inset-y-0 right-0 flex items-center pt-5 pr-1">
          <Phone  v-if="isNumberValid && !isEditing" class="text-green-500" />
          <PhoneMissed  v-else-if="!isNumberValid && !isEditing" class="text-red-500" />
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
            <Button @click="verifyNumber" class="h-[30px]" :disabled="!isNumberValid || !phone || resendCodeTimer>0 && !readyToSend">
              Verify
            </Button>
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
    <div v-else-if="!isLoading && !isEditing && smsSent">
      <MfaCodeInput :resend-code-timer="resendCodeTimer" @codeComplete="handleCodeComplete" @resendCode="handleCodeResend" @changeInput="handleChangeInput" />
    </div>
  </transition>
</template>

<style scoped>
</style>