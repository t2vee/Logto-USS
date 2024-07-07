<script setup>
import axios from 'redaxios'
import debounce from 'lodash/debounce'
import {Input} from '@/components/ui/input/index.js'
import {Label} from '@/components/ui/label/index.js'
import {inject, ref} from 'vue'
import {useLogto} from '@logto/vue'
import {AlertCircle, Ban, Check, ChevronsRight, CircleEllipsis, Loader2, Save, Undo2} from 'lucide-vue-next'
import {Button} from '@/components/ui/button/index.js'
import {DialogClose} from '@/components/ui/dialog/index.js'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover/index.js'
import {toast} from 'vue-sonner'
import {eventBus} from '@/lib/eventBus.js'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {createReusableTemplate, useMediaQuery} from "@vueuse/core";
import {API} from "@/lib/apiRouteMap.js";

const { getAccessToken } = useLogto()

const userData = inject('userData')

const password = ref('')
const confirmPassword = ref('')
const passwordInvalid = ref(false)
const passwordCheckPass = ref(false)
const passwordMatches = ref(false)
const oldPassword = ref('')

const characterLengthCheckPassed = ref(false)
const uppercaseCharactersCheckPassed = ref(false)
const lowercaseCharactersCheckPassed = ref(false)
const containsNumbersCheckPassed = ref(false)
const specialCharactersCheckPassed = ref(false)

const signOutOfAllDevices = ref(false) // logto does not yet support this feature
const isLoading = ref(false)

function checkPassword() {
  if (password.value === '') {
    passwordInvalid.value = false
    passwordCheckPass.value = false
    return
  }
  characterLengthCheckPassed.value = password.value.length >= 10
  uppercaseCharactersCheckPassed.value = /[A-Z]/.test(password.value)
  lowercaseCharactersCheckPassed.value = /[a-z]/.test(password.value)
  containsNumbersCheckPassed.value = /\d/.test(password.value)
  specialCharactersCheckPassed.value = /[\W_]/.test(password.value)
  if (
    !characterLengthCheckPassed.value ||
    !uppercaseCharactersCheckPassed.value ||
    !lowercaseCharactersCheckPassed.value ||
    !containsNumbersCheckPassed.value ||
    !specialCharactersCheckPassed.value
  ) {
    passwordInvalid.value = true
    passwordCheckPass.value = false
  } else {
    passwordInvalid.value = false
    passwordCheckPass.value = true
  }
}

function checkPasswordMatch() {
  passwordMatches.value = password.value === confirmPassword.value
}

const debouncedCheckPassword = debounce(() => checkPassword(), 200)
const debouncedCheckPasswordMatch = debounce(() => checkPasswordMatch(), 200)

async function updateData() {
  isLoading.value = true
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  try {
    const response = await axios.post(
      API.EDIT.PASSWORD,
      {
        oldPassword: oldPassword.value,
        password: password.value
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.status === 204) {
      toast.success('Success!', { description: 'Your changes were saved successfully.' })
      eventBus.emit('refreshUserData', true)
    }
  } catch (error) {
    console.log(error)
    if (error.response.status === 401) {
      toast.error('Error saving changes:', {
        description: 'Old password does not match. Please try again'
      })
    } else {
      toast.error('Error saving changes:', { description: 'Service Unavailable. Try again later' })
    }
  } finally {
    isLoading.value = false
  }
}
const [UsePopoverTemplate, PopoverTemplate] = createReusableTemplate()
const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <UsePopoverTemplate>
    <Popover>
      <PopoverTrigger as-child>
        <Button
            variant="link"
            :class="{ 'text-red-500': passwordInvalid && !passwordCheckPass }"
        >
          <AlertCircle
              v-if="passwordInvalid && !passwordCheckPass"
              class="pr-1"
              color="darkred"
          />
          Password Requirements
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-120">
        <div class="grid gap-4">
          <ul class="text-sm space-y-2">
            <li class="flex items-center">
              <component
                  :color="!password ? null : !characterLengthCheckPassed ? 'darkred' : 'green'"
                  :is="!password ? ChevronsRight : !characterLengthCheckPassed ? Ban : Check"
                  class="pr-1"
              />Should be a&nbsp;<strong>minimum of 10 Characters</strong>
            </li>
            <li class="flex items-center">
              <component
                  :color="
                      !password ? null : !uppercaseCharactersCheckPassed ? 'darkred' : 'green'
                    "
                  :is="!password ? ChevronsRight : !uppercaseCharactersCheckPassed ? Ban : Check"
                  class="pr-1"
              />Should contain&nbsp;<strong>a few Uppercase Characters</strong>
            </li>
            <li class="flex items-center">
              <component
                  :color="!password ? null : !containsNumbersCheckPassed ? 'darkred' : 'green'"
                  :is="!password ? ChevronsRight : !containsNumbersCheckPassed ? Ban : Check"
                  class="pr-1"
              />Should contain&nbsp;<strong>a few Numbers</strong>
            </li>
            <li class="flex items-center">
              <component
                  :color="!password ? null : !specialCharactersCheckPassed ? 'darkred' : 'green'"
                  :is="!password ? ChevronsRight : !specialCharactersCheckPassed ? Ban : Check"
                  class="pr-1"
              />Should contain&nbsp;<strong>non-alphanumeric characters</strong>
            </li>
            <li class="flex items-center">
              <component
                  :color="password ? 'green' : null"
                  :is="!password ? ChevronsRight : Check"
                  class="pr-1"
              />
              Should&nbsp;
              <strong>
                Not
              </strong>
              &nbsp;contain any&nbsp;
              <strong>
                Common Words
              </strong>
            </li>
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  </UsePopoverTemplate>

  <UseFooterTemplate>
    <PopoverTemplate v-if="!isDesktop" />
    <DialogClose as-child>
      <Button type="button" variant="outline" class="desktop:h-[30px] tablet:w-full">
        <Undo2 class="w-4 h-4 mr-2" />
        Cancel
      </Button>
    </DialogClose>
    <PopoverTemplate v-if="isDesktop" />
    <Button
        type="submit"
        class="desktop:h-[30px] tablet:w-full"
        @click="updateData"
        :disabled="isLoading || !passwordCheckPass || !passwordMatches || !oldPassword"
    >
      <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" color="black" />
      <Save v-else class="w-4 h-4 mr-2" />
      {{ isLoading ? 'Saving...' : 'Save' }}
    </Button>
  </UseFooterTemplate>

  <MfaVerificationDialog title="Password" :icon="CircleEllipsis" :desc="`Last Logged in at ${new Date(userData.lastSignInAt).toLocaleDateString()}`" >
    <template #body>
      <div class="w-full h-full flex flex-col gap-4 pb-4 items-center align-middle desktop:mb-16">
        <div class="grid tablet:w-full desktop:w-3/5 max-w-sm items-center gap-1.5 relative">
            <Label for="userid" class="font-bold"> Old Password </Label>
            <Input type="password" id="userid" placeholder="Required" v-model="oldPassword" />
          </div>
        <div class="grid tablet:w-full desktop:w-3/5 max-w-sm items-center gap-1.5 relative">
            <Label for="username" class="flex font-bold w-full justify-between"> New Password </Label>
            <div>
              <Input
                  type="password"
                  id="username"
                  v-model="password"
                  @input="debouncedCheckPassword"
                  :class="{ 'border-red-500': ( passwordInvalid && !passwordCheckPass ) || ( !passwordMatches && passwordCheckPass && confirmPassword ) }"
                  placeholder="Required"
              />
            </div>
          </div>
        <div class="grid tablet:w-full desktop:w-3/5 max-w-sm items-center gap-1.5 relative">
            <Label for="username" class="flex font-bold w-full justify-between">
              Confirm New Password
              <span v-if="passwordInvalid && passwordCheckPass" class="text-red-500">Doesnt Match</span>
            </Label>
            <div>
              <Input
                  type="password"
                  id="username"
                  :disabled="!passwordCheckPass"
                  v-model="confirmPassword"
                  @input="debouncedCheckPasswordMatch"
                  :class="{ 'border-red-500': !passwordMatches && passwordCheckPass && confirmPassword }"
                  placeholder="Required"
              />
              <p
                  class="text-xs text-red-500"
                  v-if="!passwordMatches && passwordCheckPass && confirmPassword"
              >
                Passwords Don't Match
              </p>
            </div>
          </div>
          <!--<div class="items-top flex gap-x-2"> // logto does not yet support this feature
            <Checkbox id="logout" :value="signOutOfAllDevices" />
            <div class="grid gap-1.5 leading-none">
              <label
                  for="logout"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sign out of all devices after change
              </label>
              <p class="text-sm text-muted-foreground">
                Warning! This will log you out of your current session
              </p>
            </div>
          </div>-->
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

<style scoped></style>
