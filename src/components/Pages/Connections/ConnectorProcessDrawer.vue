<script setup>
import {defineAsyncComponent, onMounted, onUnmounted, ref} from 'vue'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer/index.js'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card/index.js'
import { Progress } from '@/components/ui/progress/index.js'
import { Switch } from '@/components/ui/switch/index.js'
import { Button } from '@/components/ui/button/index.js'
import {Link, BarChart3, TextSearch, ChevronsRight, LogIn, LoaderCircle, BadgeCheck} from 'lucide-vue-next'
import {eventBus} from "@/lib/eventBus.js";
const EditDetailDialog = defineAsyncComponent(() => import('@/components/Global/EditDetailDialog.vue'));
const EditRegionalSettings = defineAsyncComponent(() => import('@/components/Pages/PersonalInfo/EditRegionalSettings.vue'));

const props = defineProps({
  service: {
    type: String,
    required: true
  },
  serviceImg: String,
  serviceIcon: Object,
  disabled: Boolean,
})

const progress = ref(33);
const stepOneActive = ref(true);
const stepTwoActive = ref(false);
const stepThreeActive = ref(false);

const policiesAgreed = ref(false);
const disableLinkButton = ref(false);
const linkCallbackSuccessful = ref(false);
const callbackWaitingText = ref('Waiting For Response...');

let windowChecker = null;
let authWindow = null;

function completeStepOne() {
  if (stepTwoActive.value && !stepOneActive.value) {
    stepOneActive.value = true;
    stepTwoActive.value = false;
    progress.value = 33;
  } else {
    stepOneActive.value = false;
    stepTwoActive.value = true;
    progress.value = 66;
  }
}

function completeStepTwo() {
  if (stepThreeActive.value && !stepTwoActive.value) {
    stepTwoActive.value = true;
    stepThreeActive.value = false;
    progress.value = 66;
  } else {
    stepTwoActive.value = false;
    stepThreeActive.value = true;
    progress.value = 99;
  }
}

const beginAuthorizationFlow = () => {
  disableLinkButton.value = true;
  const url = `/oauth/connectors/new/${props.service.toLowerCase()}`;
  const width = 400;
  const height = 700;
  const left = (screen.width / 2) - (width / 2);
  const top = (screen.height / 2) - (height / 2);
  authWindow = window.open(
      url,
      'AuthorizationWindow',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
  );
  windowChecker = setInterval(() => {
    if (authWindow && authWindow.closed) {
      linkCallbackSuccessful.value = true;
      callbackWaitingText.value = `${props.service} Successfully Linked!`
      clearInterval(authWindow);
    }
  }, 500);
};

const handlePrematureClose = () => {
  if (linkCallbackSuccessful.value) {
    eventBus.emit('refreshUserData', true)
  }
}

onUnmounted( () => {
  if (windowChecker) {
    clearInterval(windowChecker);
  }
})
</script>

<template>
  <Drawer class="transition-all duration-500" @update:open="handlePrematureClose">
    <DrawerTrigger as-child>
      <Button :disabled="disabled">
        <Link color="black" class="mr-1" />
        <strong class="text-black">
          {{ disabled ? 'Unavailable' : 'Begin Link Process' }}
        </strong>
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="flex justify-between items-center align-middle">
        <Progress v-model="progress" class="w-full" />
        <DrawerClose>
          <Button variant="outline" class="rounded-xl h-6"> Cancel </Button>
        </DrawerClose>
      </DrawerHeader>
      <div class="min-h-80 w-full flex gap-x-4 mb-12">
        <div class="flex flex-col w-[33%] ml-4">
          <Card class="mb-1">
            <CardHeader class="flex items-center">
              <CardTitle>Step 1:</CardTitle>
              <CardTitle>Review your privacy settings</CardTitle>
              <CardDescription>
                Before adding a new social connector to your account, review and agree to the
                privacy policy and terms of service before continuing. Also you may review some
                privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex gap-x-5">
              <p>
                I agree to the
                <span
                  ><a target="_blank" class="text-cyan-300" href="/legal/privacypolicy"
                    >MXS Privacy Policy</a
                  ></span
                >
                &
                <span
                  ><a target="_blank" class="text-cyan-300" href="/legal/termsofservice"
                    >MXS Terms of Service Agreement</a
                  ></span
                >.
              </p>
              <Switch v-model:checked="policiesAgreed" :disabled="!stepOneActive" />
            </CardContent>
            <CardFooter class="w-full gap-x-2">
              <EditDetailDialog
                title="Analytics"
                :dialog-page="EditRegionalSettings"
                :icon="BarChart3"
                desc="Opted Out"
                :disabled="!stepOneActive"
              />
              <EditDetailDialog
                title="Third Party Data Access"
                :dialog-page="EditRegionalSettings"
                :icon="TextSearch"
                desc="Restricted Access"
                :disabled="!stepOneActive"
              />
            </CardFooter>
          </Card>
          <Button
            :disabled="!policiesAgreed || stepThreeActive"
            @click="completeStepOne"
            :variant="stepOneActive ? '' : 'outline'"
          >
            <ChevronsRight
              class="mr-2"
              :color="stepOneActive ? 'black' : 'white'"
              :class="{ 'rotate-180': !stepOneActive }"
            />
            {{ stepOneActive ? 'Continue' : 'Back' }}
          </Button>
        </div>
        <div class="flex flex-col w-[33%] ">
          <Card class="flex flex-col h-full mb-1 items-center" :class="{ 'hover:cursor-not-allowed py-28': !stepTwoActive }">
            <CardHeader class="flex items-center">
              <CardTitle :class="!stepTwoActive ? 'text-gray-500' : ''">Step 2:</CardTitle>
              <CardTitle :class="!stepTwoActive ? 'text-gray-500' : ''">
                Head over to {{ service }} to authorise the link
              </CardTitle>
              <CardDescription v-if="stepTwoActive">
                You will be redirected to {{ service }} to authenticate yourself, then authorise
                the connection with your MXS Account. No need to leave this page, we will open up a
                new window.
              </CardDescription>
            </CardHeader>
            <CardContent v-if="stepTwoActive">
              <Card
                  v-if="!disableLinkButton"
                  @click="beginAuthorizationFlow"
                  class="flex items-center align-middle justify-center bg-[#162831] gap-x-6 p-2 border-b-muted border-b-4 px-12 hover:cursor-pointer hover:bg-[#0E1D25FF] hover:border-t-4 hover:border-t-primary-foreground hover:border-b-0"
              >
                <!--<LogIn :size="36" />-->
                <p class="font-bold text-2xl">Click to Authorise with</p>
                <img v-if="serviceImg" class="max-w-32" :src="serviceImg" :alt="service" />
              </Card>
            </CardContent>
            <CardFooter v-if="stepTwoActive && disableLinkButton" class="flex items-center align-middle">
              <div class="flex items-center align-middle gap-x-2">
                <LoaderCircle v-if="callbackWaitingText !== `${service} Successfully Linked!`" :size="28" class="animate-spin" />
                <BadgeCheck :color="'rgb(34 197 94)'" v-else-if="stepTwoActive" />
                <p class="text-lg" :class="callbackWaitingText !== `${service} Successfully Linked!` ? '' : 'text-green-500'">{{ callbackWaitingText }}</p>
              </div>
            </CardFooter>
          </Card>
          <Button
            v-if="!stepOneActive && (stepTwoActive || stepThreeActive)"
            :disabled="!linkCallbackSuccessful"
            @click="completeStepTwo"
            :variant="stepTwoActive ? '' : 'outline'"
          >
            <ChevronsRight
              class="mr-2"
              :color="stepTwoActive ? 'black' : 'white'"
              :class="{ 'rotate-180': !stepTwoActive }"
            />
            {{ stepTwoActive ? 'Continue' : 'Back' }}
          </Button>
        </div>
        <div class="flex flex-col w-[33%] mr-4">
          <Card class="h-full mb-1" :class="!stepThreeActive ? 'hover:cursor-not-allowed py-28' : ''">
            <CardHeader class="flex items-center">
              <CardTitle :class="!stepThreeActive ? 'text-gray-500' : ''">Step 3:</CardTitle>
              <CardTitle :class="!stepThreeActive ? 'text-gray-500' : ''">
                Finalise the connection details
              </CardTitle>
              <CardDescription v-if="stepThreeActive">
                Check the details of the connected account to verify if they are correct.
              </CardDescription>
            </CardHeader>
            <CardContent v-if="stepThreeActive"> Card Content </CardContent>
            <CardFooter v-if="stepThreeActive"> Card Footer </CardFooter>
          </Card>
          <Button
              v-if="!stepTwoActive && stepThreeActive"
              :disabled="!linkCallbackSuccessful"
              @click="completeStepTwo"
              :variant="stepThreeActive ? '' : 'outline'"
          >
            <ChevronsRight
                class="mr-2"
                color="black"
            />
            Complete Setup
          </Button>
        </div>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<style scoped></style>
