<script setup>
import { Label } from '@/components/ui/label'
import { Mails, Phone, TabletSmartphone, ArchiveRestore, Check } from 'lucide-vue-next';
import {inject, ref} from "vue";

const userData = inject('userData')
const mfaMethods = inject('mfaMethods')

const emailMouseOver = ref(false)
const phoneMouseOver = ref(false)
const appMouseOver = ref(false)
const backupMouseOver = ref(false)
</script>

<template>
  <div class="flex flex-col items-center max-w-[350px] mt-[-30px] gap-y-3">
    <p class="text-sm text-center">Add or remove Multi-Factor Authentication methods from your account. Select one below to continue</p>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label
            for="email"
            class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-[#030607] hover:text-secondary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary hover:cursor-pointer"
            @mouseenter="() => emailMouseOver = true"
            @mouseleave="() => emailMouseOver = false"
        >
          <Mails :size="32" :color="emailMouseOver ? 'rgba(161 85% 86%)' : (userData.email_verified ? 'rgb(34 197 94)' : '')" class="m-2" />
          <div class="flex items-center justify-between" :class="emailMouseOver ? 'text-secondary' : (userData.email_verified ? 'text-green-500' : '')">
            <Check v-if="userData.email_verified" :size="16" :color="emailMouseOver ? 'rgba(161 85% 86%)' : (userData.email_verified ? 'rgb(34 197 94)' : '')" />
            Email Address
          </div>
        </Label>
      </div>
      <div>
        <Label
            for="phone"
            class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-[#030607] hover:text-secondary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary hover:cursor-pointer"
            @mouseenter="() => phoneMouseOver = true"
            @mouseleave="() => phoneMouseOver = false"
        >
          <Phone :size="32" :color="phoneMouseOver ? 'rgba(161 85% 86%)' : (userData.phone_number_verified ? 'rgb(34 197 94)' : '')" class="m-2" />
          <div class="flex items-center justify-between" :class="phoneMouseOver ? 'text-secondary' : (userData.phone_number_verified ? 'text-green-500' : '')">
            <Check v-if="userData.phone_number_verified" :size="16" :color="phoneMouseOver ? 'rgba(161 85% 86%)' : (userData.phone_number_verified ? 'rgb(34 197 94)' : '')" />
            Phone Number
          </div>
        </Label>
      </div>
      <div>
        <Label
            for="app"
            class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-[#030607] hover:text-secondary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary hover:cursor-pointer"
            @mouseenter="() => appMouseOver = true"
            @mouseleave="() => appMouseOver = false"
        >
          <TabletSmartphone :size="32" :color="appMouseOver ? 'rgba(161 85% 86%)' : (mfaMethods[0].type === 'Totp' ? 'rgb(34 197 94)' : '')" class="m-2" />
          <div class="flex items-center justify-between" :class="appMouseOver ? 'text-secondary' : (mfaMethods[0].type === 'Totp' ? 'text-green-500' : '')">
            <Check v-if="mfaMethods[0].type === 'Totp'" :size="16" :color="appMouseOver ? 'rgba(161 85% 86%)' : (mfaMethods[0].type === 'Totp' ? 'rgb(34 197 94)' : '')" />
            App Authenticator
          </div>
        </Label>
      </div>
      <div>
        <Label
            for="backup"
            class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-[#030607] hover:text-secondary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary hover:cursor-pointer"
            @mouseenter="() => backupMouseOver = true"
            @mouseleave="() => backupMouseOver = false"
        >
          <ArchiveRestore :size="32" :color="backupMouseOver ? 'rgba(161 85% 86%)' : (mfaMethods[1].type === 'BackupCode' ? 'rgb(34 197 94)' : '')" class="m-2" />
          <div class="flex items-center justify-between" :class="backupMouseOver ? 'text-secondary' : (mfaMethods[1].type === 'BackupCode' ? 'text-green-500' : '')">
            <Check v-if="mfaMethods[1].type === 'BackupCode'" :size="16" :color="backupMouseOver ? 'rgba(161 85% 86%)' : (mfaMethods[1].type === 'BackupCode' ? 'rgb(34 197 94)' : '')" />
            Backup Codes
          </div>
        </Label>
      </div>
    </div>
  </div>
</template>