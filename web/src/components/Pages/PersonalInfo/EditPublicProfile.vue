<script setup>
import { Input } from '@/components/ui/input/index.js'
import { Label } from '@/components/ui/label/index.js'
import axios from 'redaxios'
import { inject, ref } from 'vue'
import { Button } from '@/components/ui/button/index.js'
import { DialogClose } from '@/components/ui/dialog/index.js'
import { Ban, MoreHorizontal, UserRoundCheck, SquareArrowOutUpRight, DoorOpen } from 'lucide-vue-next'
import MfaVerificationDialog from "@/components/Global/MFAHelpers/MfaVerificationDialog.vue";

const userData = inject('userData')

</script>

<template>
  <MfaVerificationDialog disabled title="Public Profile" :icon="DoorOpen" desc="Open For More Details">
    <template #body>
      <div class="w-full h-full flex flex-col gap-4 pb-4 items-center align-middle">
        <div class="grid w-3/5 max-w-sm items-center gap-1.5 relative">
          <Label for="username" class="flex font-bold w-full justify-between">
            Display Username
            <span v-if="badWords" class="text-xs text-red-500">Contains Bad Words</span>
            <span v-else-if="!isOk && nameChecked" class="text-xs text-red-500">Invalid Name</span>
          </Label>
          <div>
            <Input
                id="username"
                :disabled="userConnectorPresent"
                v-model="fullName"
                @input="debouncedCheckName"
                :class="{
              'border-red-500': !isOk && nameChecked
            }"
                :placeholder="userData.name"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pt-7 pr-1">
              <MoreHorizontal v-if="isChecking" />
              <UserRoundCheck v-else-if="isOk && nameChecked" class="text-white" />
              <Ban v-else-if="!isOk && nameChecked" class="text-red-500" />
            </div>
          </div>
        </div>
        <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
          <Label for="website" class="flex font-bold w-full justify-between">
            Website
            <span v-if="badWords" class="text-xs text-red-500">Contains Bad Words</span>
            <span v-else-if="!isOk && nameChecked" class="text-xs text-red-500">Invalid Name</span>
          </Label>
          <div>
            <Input
                id="website"
                :disabled="userConnectorPresent"
                v-model="fullName"
                @input="debouncedCheckName"
                :class="{
              'border-red-500': !isOk && nameChecked
            }"
                :placeholder="userData.name"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pt-7 pr-1">
              <MoreHorizontal v-if="isChecking" />
              <UserRoundCheck v-else-if="isOk && nameChecked" class="text-white" />
              <Ban v-else-if="!isOk && nameChecked" class="text-red-500" />
            </div>
          </div>
        </div>
        <div class="grid ">
          <Button>
            <SquareArrowOutUpRight color="black" class="w-5 h-5 mr-2" />
            <p class="font-bold text-black">Preview Profile</p>
          </Button>
        </div>
      </div>
    </template>
    <template #footer>
      <DialogClose as-child>
        <Button type="button" variant="outline" class="h-[30px]"> Cancel </Button>
      </DialogClose>
      <Button variant="link" as-child size="xs">
        <a target="_blank" href="/legal" class="text-sm"> Privacy and Cookies Policy </a>
      </Button>
      <Button
          type="submit"
          class="h-[30px]"
          :disabled="!isOk"
          :onclick="updateData"
      >
        Save
      </Button>
    </template>
  </MfaVerificationDialog>
</template>
