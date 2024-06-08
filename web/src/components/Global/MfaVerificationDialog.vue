<script setup>
import {ref, watch} from 'vue'
import {Label} from '@/components/ui/label/index.js'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group/index.js'
const { API, UIStateHandler, getAccessToken, coreResource } = useAPI()
import {Loader, Shield} from 'lucide-vue-next'
import {DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog/index.js'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip/index.js'
import {Button} from '@/components/ui/button/index.js'
import MfaCodeInput from '@/components/Global/MfaCodeInput.vue'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import {useAPI} from "@/lib/api/useAPI.js";

const props = defineProps({
  isVisible: Boolean,
  dataRequest: Boolean,
  title: {
    type: String,
    required: true
  },
  editPage: {
    type: Object,
    required: true
  },
  userData: {
    type: Object,
    required: true
  },
  icon: {
    required: true
  }
})

const isMfaRequired = ref(false)
const codeSent = ref(false)
const isLoading = ref(true)
const mfaOptions = ref({})
const selectedMfaMethod = ref('email')
const resendCodeTimer = ref(60)
const readyToSend = ref(true)

let accessToken = '';

const countdown = () => {
  const interval = setInterval(() => {
    if (resendCodeTimer.value > 0) {
      resendCodeTimer.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

async function grabMfaOptions() {
  return await API.MfaOptions(accessToken,
    new UIStateHandler({
      error: {
        events: {
          toast: () => toast.error('Error grabbing MFA Options:', { description: 'Some account actions will be unavailable' }),
        },
        setValue: {
          isMfaRequired: {
            target: isMfaRequired,
            value: true,
          }
        }
      }
    })
  )
}

async function sendVerificationCode() {
  isLoading.value = true
  await API.SendVerificationCode(accessToken,
      new UIStateHandler({
        success: {
          on204: {
            refs: {
              codeSent: codeSent,
            },
            events: {
              toast: () => {
                if (selectedMfaMethod.value === 'email') {
                  toast.info('Sent Email to ' + props.userData.email, {
                    description: 'Code will last for 10 minutes.'
                  })
                } else if (selectedMfaMethod.value === 'phone') {
                  toast.info('Sent Text to ' + props.userData.phone_number, {
                    description: 'Code will last for 10 minutes.'
                  })
                }
              }
            }
          },
        },
        always: {
          refs: {
            isLoading: isLoading,
          },
          setValue: {
            resendCodeTimer: {
              target: resendCodeTimer,
              value: 60
            },
          },
          events: {
            countdown: countdown
          }
        },
        error: {
          onDefault: {
            events: {
              toast: () => toast.error('Error sending verification code:', { description: 'Please try again later' }),
            },
          }
        }
      }),
      selectedMfaMethod.value
  )
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
  await API.VerifyCode(accessToken,
      new UIStateHandler({
        success: {
          on204: {
            setValue: {
              codeSent: {
                target: codeSent,
                value: false
              },
              isMfaRequired: {
                target: isMfaRequired,
                value: false
              }
            },
            events: {
              toast: () => toast.success('Successfully Verified', {
                description: 'You will stay verified for the next 15 minutes.'
              })
            }
          },
        },
        always: {
          refs: {
            isLoading: isLoading,
          }
        },
        error: {
          onDefault: {
            events: {
              toast: () => toast.warning('Provided Code is Incorrect', {
                description: 'Please try again'
              }),
            },
          }
        }
      }),
      selectedMfaMethod.value,
      code
  )
}

const checkMFA = async () => {
  isLoading.value = true
  accessToken = await getAccessToken(coreResource, undefined)
  await API.IsMfaRequired(accessToken,
    new UIStateHandler({
      success: {
        on204: {
          setValue: {
            mfaOptions: {
              target: mfaOptions,
              value: await grabMfaOptions()
            },
            isMfaRequired: {
              target: isMfaRequired,
              value: true
            }
          }
        },
        onDefault: {
          setValue: {
            isMfaRequired: {
              target: isMfaRequired,
              value: false
            }
          }
        }
      },
      always: {
        refs: {
          isLoading: isLoading,
        }
      },
      error: {
        onDefault: {
          events: {
            closeDialog: () => eventBus.emit('closeEditDetailDialog', false),
            refreshUserData: () => eventBus.emit('refreshUserData', true),
            toast: () => toast.error('Error checking MFA:', { description: 'Service Unavailable. Try again later' }),
          },
        }
      }
    }),
  )
}

function updateSelectedMethod(value) {
  selectedMfaMethod.value = value
}

watch(
    () => props.isVisible,
    (newValue) => {
      if (newValue) {
        checkMFA().catch((error) => console.log('MFA check failed:', error))
      }
    }
)
</script>

<template>
  <DialogContent
      class="sm:max-w-[525px] sm:min-h-[500px] flex flex-col items-center justify-center align-middle space-y-6"
  >
    <transition name="slide" mode="out-in">
      <DialogHeader class="mb-3 flex flex-col items-center justify-center align-middle">
        <component
            class="mr-1"
            height="42"
            width="42"
            :is="!isLoading && isMfaRequired ? Shield : icon"
        />
        <DialogTitle class="flex items-center align-middle">{{
            !isLoading && isMfaRequired
                ? 'Verify Your Identity'
                : !dataRequest
                    ? 'Edit Your ' + title
                    : title
          }}</DialogTitle>
        <DialogDescription class="text-xs">
          {{
            !isLoading && isMfaRequired
                ? "In order to verify your identity, we'll send you a code to your preferred method below."
                : ''
          }}
        </DialogDescription>
      </DialogHeader>
    </transition>
    <transition name="fade" mode="out-in">
      <div key="mfa-settings" v-if="!isLoading && isMfaRequired && !codeSent" class="space-y-8">
        <RadioGroup
            default-value="email"
            class="space-y-3"
            @update:modelValue="updateSelectedMethod"
        >
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="r1" value="email" />
            <Label for="r1"
            >Email <strong>{{ userData.email }}</strong></Label
            >
          </div>
          <div v-if="userData.phone_number" class="flex items-center space-x-2">
            <RadioGroupItem id="r2" value="sms" />
            <Label for="r2"
            >Text <strong>{{ userData.phone_number }}</strong></Label
            >
          </div>
          <div v-if="mfaOptions[0] !== 'none'">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger class="flex items-center space-x-2">
                  <RadioGroupItem id="r3" value="authenticator" disabled />
                  <Label for="r3" class="text-gray-600"
                  >Authenticator App (Google/Microsoft Authenticator)</Label
                  >
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
                  <RadioGroupItem id="r3" value="authenticator" disabled />
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
        <div class="space-x-2 w-full flex justify-center">
          <p class="text-xs" v-if="resendCodeTimer > 0 && !readyToSend">
            Please wait {{ resendCodeTimer }} seconds before sending another code
          </p>
          <Button
              :disabled="resendCodeTimer > 0 && !readyToSend"
              class="h-[30px]"
              @click="sendVerificationCode"
          >Next</Button
          >
          <DialogClose as-child>
            <Button class="h-[30px]" type="button" variant="outline"> Cancel </Button>
          </DialogClose>
        </div>
      </div>
      <div v-else-if="!isLoading && isMfaRequired && codeSent">
        <MfaCodeInput
            :resend-code-timer="resendCodeTimer"
            @codeComplete="handleCodeComplete"
            @resendCode="handleCodeResend"
            @changeInput="handleChangeInput"
        />
      </div>
      <div v-else-if="!isLoading && !isMfaRequired">
        <component :is="editPage" />
      </div>
      <div v-else-if="isLoading" class="flex items-center align-middle justify-center">
        <Loader class="animate-spin" :size="32" />
        <p class="text-xl font-bold">Loading...</p>
      </div>
    </transition>
  </DialogContent>
</template>