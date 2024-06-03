<script setup>
import { Label } from '@/components/ui/label/index.js'
import {
  Mails,
  Phone,
  TabletSmartphone,
  Check,
  MailCheck,
  MailX
} from 'lucide-vue-next'
import { inject, ref, defineAsyncComponent } from 'vue'
import { DialogFooter } from '@/components/ui/dialog/index.js'
import { Button } from '@/components/ui/button/index.js'
import { PhoneMissed, DoorOpen } from 'lucide-vue-next'

import ConnectorAlert from '@/components/Global/ConnectorAlert.vue'
import EditAppAuthenticator from '@/components/Pages/SignInAndSecurity/EditAppAuthenticator.vue'
import AddPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/AddPhoneNumberDialog.vue'
import EditPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/RemovePhoneNumberDialog.vue'
import EditDetailDialog from '@/components/Global/EditDetailDialog.vue'
import EditEmailAddress from '@/components/Pages/SignInAndSecurity/EditEmailAddress.vue'

const userData = inject('userData')
const mfaMethods = inject('mfaMethods')

// i hate this but im also lazy so...
const emailMouseOver = ref(false)
const phoneMouseOver = ref(false)
const appMouseOver = ref(false)

const emailActive = ref(false)
const phoneActive = ref(false)
const appActive = ref(false)

const removeFooter = ref(false)

const resetDefault = () => {
  emailActive.value = false
  phoneActive.value = false
  appActive.value = false
  emailMouseOver.value = false
  phoneMouseOver.value = false
  appMouseOver.value = false
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="emailActive" class="space-y-3">
      <ConnectorAlert
        custom-title="You Cannot Disable Email as a MFA Method"
        custom-message="Every account must have a valid email address connected and as such must always be available as a MFA method. You may edit your email address below:"
      />
      <EditDetailDialog
        title="Email Address"
        :desc="
          userData.email.length > 30
            ? userData.email.substring(0, 30) + '...'
            : userData.email
        "
        :icon="userData.email_verified ? MailCheck : MailX"
        :dialog-page="EditEmailAddress"
      />
    </div>
    <div v-else-if="phoneActive" class="space-y-3 flex flex-col items-center">
      <p class="text-sm w-2/3 text-center">
        When a phone number is added to your account it is used <strong>only</strong> for MFA. To
        {{ userData.phone_number ? 'disable' : 'enable' }} MFA via SMS,
        {{ userData.phone_number ? 'remove' : 'add' }} your number below:
      </p>
      <div class="w-2/3">
        <EditDetailDialog
          title="Phone Number"
          :desc="userData.phone_number ? userData.phone_number : 'Number Not Added'"
          :icon="userData.phone_number_verified ? Phone : PhoneMissed"
          :dialog-page="userData.phone_number ? EditPhoneNumberDialog : AddPhoneNumberDialog"
        />
      </div>
    </div>
    <div v-else-if="appActive">
      <EditAppAuthenticator v-model="removeFooter" :mfa-methods="mfaMethods" />
    </div>
    <div v-else class="flex flex-col items-center max-w-[350px] mt-[-30px] gap-y-3">
      <p class="text-sm text-center">
        Add or remove Multi-Factor Authentication methods from your account. Select one below to
        continue
      </p>
      <div class="grid grid-cols-2 gap-4 w-full">
        <div>
          <Label
            for="email"
            class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-[#030607] hover:text-secondary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary hover:cursor-pointer"
            @mouseenter="() => (emailMouseOver = true)"
            @mouseleave="() => (emailMouseOver = false)"
            @click="() => (emailActive = true)"
          >
            <Mails
              :size="32"
              :color="emailMouseOver? 'rgba(161 85% 86%)': userData.email_verified? 'rgb(34 197 94)': ''"
              class="m-2"
            />
            <div class="flex items-center justify-between" :class="emailMouseOver ? 'text-secondary' : userData.email_verified ? 'text-green-500' : ''">
              <Check
                v-if="userData.email_verified"
                :size="16"
                :color="emailMouseOver? 'rgba(161 85% 86%)': userData.email_verified? 'rgb(34 197 94)': ''"
              />
              Email Address
            </div>
          </Label>
        </div>
        <div>
          <Label
            for="phone"
            class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-[#030607] hover:text-secondary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary hover:cursor-pointer"
            @mouseenter="() => (phoneMouseOver = true)"
            @mouseleave="() => (phoneMouseOver = false)"
            @click="() => (phoneActive = true)"
          >
            <Phone
              :size="32"
              :color="phoneMouseOver? 'rgba(161 85% 86%)': userData.phone_number_verified? 'rgb(34 197 94)': ''"
              class="m-2"
            />
            <div
              class="flex items-center justify-between"
              :class="phoneMouseOver? 'text-secondary': userData.phone_number_verified? 'text-green-500': ''"
            >
              <Check
                v-if="userData.phone_number_verified"
                :size="16"
                :color="phoneMouseOver? 'rgba(161 85% 86%)': userData.phone_number_verified? 'rgb(34 197 94)': ''"
              />
              Phone Number
            </div>
          </Label>
        </div>
      </div>
      <div class="w-full">
        <div>
          <Label
              for="app"
              class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-[#030607] hover:text-secondary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary hover:cursor-pointer"
              @mouseenter="() => (appMouseOver = true)"
              @mouseleave="() => (appMouseOver = false)"
              @click="() => (appActive = true)"
          >
            <TabletSmartphone
                :size="32"
                :color="appMouseOver? 'rgba(161 85% 86%)': mfaMethods.totp? 'rgb(34 197 94)': ''"
                class="m-2"
            />
            <div
                class="flex items-center justify-between"
                :class="appMouseOver? 'text-secondary': mfaMethods.totp? 'text-green-500': ''"
            >
              <Check
                  v-if="mfaMethods.totp"
                  :size="16"
                  :color="appMouseOver? 'rgba(161 85% 86%)': mfaMethods.totp? 'rgb(34 197 94)': ''"
              />
              App Authenticator
            </div>
          </Label>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="fade" mode="out-in">
    <DialogFooter>
      <div v-if="!removeFooter && (emailActive || phoneActive || appActive)" class="mt-6 w-full">
          <div class="flex justify-center items-center align-middle <!--gap-x-20-->">
            <Button variant="secondary" class="h-[30px]" @click="resetDefault">
              <DoorOpen :stroke-wdth="1.5" color="black" class="pr-1" />
              Go Back
            </Button>
          </div>
      </div>
      <div v-else-if="!emailActive || !phoneActive || !appActive"></div>
    </DialogFooter>
  </Transition>
</template>
