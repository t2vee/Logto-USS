<script setup>
import {defineAsyncComponent, onMounted, ref} from 'vue'
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
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Link, BarChart3, TextSearch, ChevronsRight, LogIn } from 'lucide-vue-next'
const EditDetailDialog = defineAsyncComponent(() => import('@/components/SettingsPages/Global/EditDetailDialog.vue'));
const EditRegionalSettings = defineAsyncComponent(() => import('@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/EditRegionalSettings.vue'));

const props = defineProps({
  service: {
    type: String,
    required: true
  },
  serviceImg: String,
  serviceIcon: Object,
})

const progress = ref(33)
const stepOneActive = ref(true)
const stepTwoActive = ref(false)
const stepThreeActive = ref(false)
const policiesAgreed = ref(false)

function completeStepOne() {
  if (stepTwoActive.value && !stepOneActive.value) {
    stepOneActive.value = true
    stepTwoActive.value = false
    progress.value = 33
  } else {
    stepOneActive.value = false
    stepTwoActive.value = true
    progress.value = 66
  }
}

const beginAuthorizationFlow = () => {
  const url = `/connectors/link/${props.service.toLowerCase()}?action=create`;
  const width = 400;
  const height = 600;
  const left = (screen.width / 2) - (width / 2);
  const top = (screen.height / 2) - (height / 2);

  window.open(
      url,
      'AuthorizationWindow',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
  );
};
</script>

<template>
  <Drawer class="transition-all duration-500">
    <DrawerTrigger>
      <Button>
        <Link color="black" class="mr-1" />
        <strong class="text-black">Begin Link Process</strong>
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
            :disabled="!policiesAgreed"
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
        <div class="flex flex-col w-[33%] ml-4">
          <Card class="h-full mb-1" :class="{ 'hover:cursor-not-allowed py-28': !stepTwoActive }">
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
              <Card @click="beginAuthorizationFlow" class="flex items-center align-middle justify-center bg-[#162831] gap-x-6 p-2 border-b-muted border-b-4 hover:cursor-pointer hover:bg-[#0E1D25FF] hover:border-t-4 hover:border-t-primary-foreground hover:border-b-0">
                <CardTitle class="flex mt-2 gap-x-2">
                  <LogIn :size="28" />
                  Click to Authorise with
                </CardTitle>
                <img v-if="serviceImg" class="max-w-32" :src="serviceImg" :alt="service" />
              </Card>
            </CardContent>
          </Card>
          <Button
            v-if="!stepOneActive && stepTwoActive"
            :disabled="policiesAgreed"
            @click="completeStepOne"
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
        <Card
          class="w-[33%] mr-4"
          :class="!stepThreeActive ? 'hover:cursor-not-allowed py-28' : ''"
        >
          <CardHeader class="flex items-center">
            <CardTitle :class="!stepThreeActive ? 'text-gray-500' : ''">Step 3:</CardTitle>
            <CardTitle :class="!stepThreeActive ? 'text-gray-500' : ''"
              >Finalise the connection details</CardTitle
            >
            <CardDescription v-if="stepThreeActive">Card Description</CardDescription>
          </CardHeader>
          <CardContent v-if="stepThreeActive"> Card Content </CardContent>
          <CardFooter v-if="stepThreeActive"> Card Footer </CardFooter>
        </Card>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<style scoped></style>
