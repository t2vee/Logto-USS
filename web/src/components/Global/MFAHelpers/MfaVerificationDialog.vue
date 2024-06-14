<script setup>
import {inject, onUnmounted, ref, watch} from 'vue'
import {createReusableTemplate, useDark, useMediaQuery} from '@vueuse/core'
import {Label} from '@/components/ui/label/index.js'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group/index.js'
import {useLogto} from '@logto/vue'
import {ArrowRight, Loader, Shield, Undo2} from 'lucide-vue-next'
import axios from 'redaxios'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog/index.js'
import {Drawer, DrawerContent, DrawerFooter, DrawerTrigger,} from '@/components/ui/drawer'
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip/index.js'
import {Button} from '@/components/ui/button/index.js'
import MfaCodeInput from '@/components/Global/MFAHelpers/MfaCodeInput.vue'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card/index.js";

const userData = inject('userData')
const mfaOptions = inject('mfaMethods')

defineProps({
  title: { type: String, required: true },
  icon: { required: true },
  desc: { type: String, required: false },
  disabled: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
})

const { getAccessToken } = useLogto()
const isMfaRequired = ref(false)
const codeSent = ref(false)
const isLoading = ref(true)
const accessTokenRef = ref('')
const selectedMfaMethod = ref('email')
const resendCodeTimer = ref(60)
const readyToSend = ref(true)
const isOpen = defineModel({default: false})

const countdown = () => {
  const interval = setInterval(() => {
    if (resendCodeTimer.value > 0) {
      resendCodeTimer.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

async function sendVerificationCode() {
  isLoading.value = true
  let failed = false
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/mfa-flow/push-${selectedMfaMethod.value}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessTokenRef.value}`,
          'Content-Type': 'application/json'
        }
      }
    )
    codeSent.value = response.status === 204
  } catch (error) {
    toast.error('Error sending verification code:', { description: error })
    codeSent.value = false
    failed = true
  } finally {
    isLoading.value = false
    resendCodeTimer.value = 60
    countdown()
    if (selectedMfaMethod.value === 'email' && !failed) {
      toast.info('Sent Email to ' + userData.email, {
        description: 'Code will last for 10 minutes.'
      })
    } else if (selectedMfaMethod.value === 'phone' && !failed) {
      toast.info('Sent Text to ' + userData.phone_number, {
        description: 'Code will last for 10 minutes.'
      })
    }
  }
}

async function handleCodeResend() {
  await sendVerificationCode()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
async function handleChangeInput() {
  readyToSend.value = false
  codeSent.value = false
  sleep(resendCodeTimer.value * 1000).then(() => {
    readyToSend.value = true
  })
}

const handleCodeComplete = async (code) => {
  isLoading.value = true
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/mfa-flow/verify-${selectedMfaMethod.value}-code?verification-code=${code}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessTokenRef.value}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 204) {
      codeSent.value = false
      isMfaRequired.value = false
      toast.success('Successfully Verified', {
        description: 'You will stay verified for the next 15 minutes.'
      })
    }
  } catch (error) {
    toast.warning('Provided Code is Incorrect', {
      description: 'Please try again'
    })
  } finally {
    isLoading.value = false
  }
}

const checkMFA = async () => {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  accessTokenRef.value = accessToken
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/is-mfa-required`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    isMfaRequired.value = response.data.status === true
  } catch (error) {
    toast.error('Error checking MFA:', { description: 'Service Unavailable. Try again later' })
    eventBus.emit('closeEditDetailDialog', false)
    eventBus.emit('refreshUserData', true)
  } finally {
    isLoading.value = false
  }
}

function updateSelectedMethod(value) {
  selectedMfaMethod.value = value
}
watch(isOpen, () => {
  if (isOpen.value) {
    checkMFA()
  }
})
const isDark = useDark({
  selector: 'html',
  disableTransition: false,
})
const handleEvent = (data) => {
  isOpen.value = data
}
const cleanup = eventBus.on('closeEditDetailDialog', handleEvent)

onUnmounted(cleanup)

const [UseTriggerTemplate, TriggerTemplate] = createReusableTemplate()
const [UseContentTemplate, ContentTemplate] = createReusableTemplate()

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <UseTriggerTemplate>
    <Card
        class="h-32 w-full bg-gradient-to-tl from-[#6c888e] to-30% transition-all duration-400 hover:to-60% hover:border-[#abd9e2] hover:cursor-pointer shadow-md shadow-gray-900 hover:shadow-black"
    >
      <CardHeader>
        <CardTitle class="flex justify-between text-lg">
          {{ title }}
          <component :is="icon" v-if="icon" :color="isDark ? '#bdeffa' : 'black'"/>
        </CardTitle>
        <CardDescription>{{ desc }}</CardDescription>
      </CardHeader>
    </Card>
  </UseTriggerTemplate>

  <UseContentTemplate>
    <transition name="fade">
      <DialogHeader class="mb-3 flex flex-col items-center justify-center align-middle tablet:mt-5">
        <component
            class="mr-1"
            height="42"
            width="42"
            :is="isMfaRequired ? Shield : icon"
        />
        <DialogTitle class="flex items-center align-middle">{{
            isMfaRequired
                ? 'Verify Your Identity'
                : !edit
                    ? 'Edit Your ' + title
                    : title
          }}</DialogTitle>
        <DialogDescription>
          <div class="flex flex-col items-center align-middle text-xs">
            {{
              isMfaRequired
                  ? "In order to verify your identity, we'll send you a code to your preferred method below."
                  : ''
            }}
            <Popover>
              <PopoverTrigger>
                <Button v-if="isMfaRequired" variant="link" size="xs" class="text-xs">
                  What is this?
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <p class="text-sm text-center">
                  Currently you have
                  <strong>
                    Login Verification
                  </strong>
                  enabled on your account. This means that when logging in and changing details in your account, you will need to verify via a added MFA method. You can disable this feature
                  <span>
                      <RouterLink to="/account/security?module=loginVerification">
                        here
                      </RouterLink>
                    </span>
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </DialogDescription>
      </DialogHeader>
    </transition>
    <div class="w-full desktop:h-full phone:px-8 tablet:px-22" :class="{ 'h-[200px]': isLoading }">
      <transition name="fade" mode="out-in">
        <div key="mfa-settings" v-if="!isLoading && isMfaRequired && !codeSent" class="w-full h-full flex flex-col items-center justify-center align-middle">
          <div>
            <RadioGroup
                default-value="email"
                class="space-y-3"
                @update:modelValue="updateSelectedMethod"
            >
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="r1" value="email" />
                <Label for="r1">
                  Email
                  <strong>{{ userData.email }}
                  </strong>
                </Label>
              </div>
              <div v-if="userData.phone_number" class="flex items-center space-x-2">
                <RadioGroupItem id="r2" value="sms" />
                <Label for="r2">
                  Text
                  <strong>
                    {{ userData.phone_number }}
                  </strong>
                </Label>
              </div>
              <div v-if="mfaOptions[0] !== 'none'">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger class="flex items-center space-x-2">
                      <RadioGroupItem id="r3" value="authenticator" disabled /> <!-- Cant be implemented yet. see: https://openapi.logto.io/operation/operation-post-api-verification-codes and https://logto.productlane.com/roadmap?id=f1b1eda0-ddad-4538-bca4-15c834e7acd0 -->
                      <Label for="r3" class="text-gray-600">
                        Authenticator App {{ isDesktop ? '(Google/Microsoft Authenticator)' : '' }}
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Currently Not Available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div v-if="mfaOptions[1]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger class="flex items-center space-x-2">
                      <RadioGroupItem id="r4" value="codes" disabled /> <!-- Cant be implemented yet. see: https://openapi.logto.io/operation/operation-post-api-verification-codes and https://logto.productlane.com/roadmap?id=f1b1eda0-ddad-4538-bca4-15c834e7acd0 -->
                      <Label for="r3" class="text-gray-600">
                        Backup Code
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Currently Not Available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </RadioGroup>

          </div>
          <DialogFooter>
            <div v-if="!isDesktop" class="w-full space-y-3">
              <div class="space-x-2 w-full flex justify-center">
                <p class="text-xs" v-if="resendCodeTimer > 0 && !readyToSend">
                  Please wait {{ resendCodeTimer }} seconds before sending another code
                </p>
              </div>
              <DialogClose as-child>
                <Button class="w-full" type="button" variant="outline">
                  Cancel
                  <Undo2 class="pl-1" />
                </Button>
              </DialogClose>
              <Button
                  :disabled="resendCodeTimer > 0 && !readyToSend"
                  class="w-full"
                  @click="sendVerificationCode"
              >
                Next
                <ArrowRight class="pl-1" />
              </Button>
            </div>
            <DialogClose as-child v-else>
              <Button class="h-[30px]" type="button" variant="outline">
                Cancel
                <Undo2 class="pl-1" />
              </Button>
            </DialogClose>
            <Button
                v-if="isDesktop"
                :disabled="resendCodeTimer > 0 && !readyToSend"
                class="h-[30px]"
                @click="sendVerificationCode"
            >
              Next
              <ArrowRight class="pl-1" />
            </Button>
          </DialogFooter>
        </div>
        <div v-else-if="!isLoading && isMfaRequired && codeSent">
          <MfaCodeInput
              :resend-code-timer="resendCodeTimer"
              @codeComplete="handleCodeComplete"
              @resendCode="handleCodeResend"
              @changeInput="handleChangeInput"
          />
        </div>
        <div v-else-if="!isLoading && !isMfaRequired" class="w-full h-full pt-5">
          <div class="w-full h-full flex flex-col items-center justify-center align-middle">
            <slot name="body">
              Oh Snap!<br/>
              There was a issue loading this component.<br/>
              Reload the page to try again
            </slot>
            <DialogFooter v-if="isDesktop">
              <slot name="footer" />
            </DialogFooter>
            <DrawerFooter v-else class="w-full px-0">
              <slot name="drawerFooter" />
            </DrawerFooter>
          </div>
        </div>
        <div v-else-if="isLoading" class="flex items-center align-middle justify-center">
          <Loader class="animate-spin" :size="32" />
        </div>
      </transition>
    </div>
  </UseContentTemplate>

  <Card
      v-if="disabled"
      class="h-32 w-full bg-gradient-to-tl from-gray-800 to-60% hover:cursor-default"
  >
    <CardHeader>
      <CardTitle class="flex justify-between text-lg text-gray-500">
        {{ title }}
        <component :is="icon" v-if="icon" color="rgb(75 85 99)"/>
      </CardTitle>
      <CardDescription class="text-gray-500">
        {{ desc }}
      </CardDescription>
    </CardHeader>
  </Card>

  <Dialog v-if="!disabled && isDesktop" v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot>
        <TriggerTemplate />
      </slot>
    </DialogTrigger>
    <DialogContent
        class="sm:max-w-[525px] sm:min-h-[400px] flex flex-col items-center align-middle"
        @interact-outside="event => {
        const target = event.target;
        if (target?.closest('[data-sonner-toaster]')) return event.preventDefault()
      }"
    >
      <ContentTemplate />
    </DialogContent>
  </Dialog>
  <Drawer v-else-if="!disabled" v-model:open="isOpen">
    <DrawerTrigger as-child>
      <slot>
        <TriggerTemplate />
      </slot>
    </DrawerTrigger>
    <DrawerContent class="w-full">
      <ContentTemplate />
    </DrawerContent>
  </Drawer>
</template>
