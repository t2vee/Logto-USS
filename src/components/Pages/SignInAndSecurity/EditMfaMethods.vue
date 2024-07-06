<script setup>
import {Label} from '@/components/ui/label/index.js'
import {Check, Undo2, Fingerprint, Mails, Phone, TabletSmartphone} from 'lucide-vue-next'
import {inject, onMounted, ref} from 'vue'
import {Button} from '@/components/ui/button/index.js'

import ConnectorAlert from '@/components/Global/ConnectorAlert.vue'
import EditAppAuthenticator from '@/components/Pages/SignInAndSecurity/EditAppAuthenticator.vue'
import AddPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/AddPhoneNumberDialog.vue'
import EditPhoneNumberDialog from '@/components/Pages/SignInAndSecurity/RemovePhoneNumberDialog.vue'
import EditEmailAddress from '@/components/Pages/SignInAndSecurity/EditEmailAddress.vue'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";
import {createReusableTemplate, useMediaQuery} from "@vueuse/core";

const userData = inject('userData')
const mfaOptions = inject('mfaMethods')

// i hate this but im also lazy so and also lucide makes it impossible to dynamically color icons. like bruh let me use tailwind
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

const mfaOptionsNum = ref([])

async function parseMfaOptions() {
  mfaOptionsNum.value.push(userData.value.email)
  if (userData.value.phone_number) {mfaOptionsNum.value.push(userData.value.phone_number)}
  if (mfaOptions.value[0] !== 'none') {mfaOptionsNum.value.push(mfaOptions.value[0])}
}

onMounted(parseMfaOptions)
const isDesktop = useMediaQuery('(min-width: 1023px)')
const [UseFooterTemplate, FooterTemplate] = createReusableTemplate()
</script>

<template>
  <UseFooterTemplate>
    <div></div>
    <Transition name="fade" mode="out-in" duration="100">
      <div v-if="!removeFooter && (emailActive || phoneActive || appActive)" class="tablet:w-full">
        <Button variant="secondary" class="desktop:h-[30px] tablet:w-full" @click="resetDefault">
          <Undo2 :stroke-wdth="1.5" color="black" class="pr-1" />
          Go Back
        </Button>
      </div>
      <div v-else-if="!emailActive || !phoneActive || !appActive"></div>
    </Transition>
  </UseFooterTemplate>

  <MfaVerificationDialog title="Account Security" :icon="Fingerprint" :desc="`${mfaOptionsNum.length} MFA Method${mfaOptionsNum.length === 1 ? '' : 's'} Set Up`">
    <template #body>
      <Transition name="fade" mode="out-in" duration="100">
        <div v-if="emailActive" class="space-y-3 mb-10">
          <ConnectorAlert
              custom-title="You Cannot Disable Email as a MFA Method"
              custom-message="Every account must have a valid email address connected and as such must always be available as a MFA method. You may edit your email address below:"
          />
          <EditEmailAddress />
        </div>
        <div v-else-if="phoneActive" class="space-y-3 flex flex-col items-center mb-10">
          <p class="text-sm desktop:w-2/3 tablet:w-full text-center">
            When a phone number is added to your account it is used <strong>only</strong> for MFA. To
            {{ userData.phone_number ? 'disable' : 'enable' }} MFA via SMS,
            {{ userData.phone_number ? 'remove' : 'add' }} your number below:
          </p>
          <div class="desktop:w-2/3 tablet:w-full">
            <component :is="userData.phone_number ? EditPhoneNumberDialog : AddPhoneNumberDialog" />
          </div>
        </div>
        <div v-else-if="appActive" class="desktop:mb-10">
          <EditAppAuthenticator v-model="removeFooter" :mfa-methods="mfaOptions" />
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
                  Email {{ isDesktop ? 'Address': '' }}
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
                    :color="appMouseOver? 'rgba(161 85% 86%)': mfaOptions.totp? 'rgb(34 197 94)': ''"
                    class="m-2"
                />
                <div
                    class="flex items-center justify-between"
                    :class="appMouseOver? 'text-secondary': mfaOptions.totp? 'text-green-500': ''"
                >
                  <Check
                      v-if="mfaOptions.totp"
                      :size="16"
                      :color="appMouseOver? 'rgba(161 85% 86%)': mfaOptions.totp? 'rgb(34 197 94)': ''"
                  />
                  App Authenticator
                </div>
              </Label>
            </div>
          </div>
        </div>
      </Transition>
    </template>
    <template #footer v-if="isDesktop">
      <FooterTemplate />
    </template>
    <template #drawerFooter v-else>
      <FooterTemplate />
    </template>
  </MfaVerificationDialog>
</template>
