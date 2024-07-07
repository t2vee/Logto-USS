<script setup>
import {Input} from '@/components/ui/input/index.js'
import {Label} from '@/components/ui/label/index.js'
import {inject} from 'vue'
import {Button} from '@/components/ui/button/index.js'
import {DialogClose, DialogFooter} from '@/components/ui/dialog/index.js'
import {Ban, MoreHorizontal, SquareArrowOutUpRight, UserRoundCheck} from 'lucide-vue-next'

const userData = inject('userData')
</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-col gap-4 pb-4 items-center align-middle">
      <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
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
    <DialogFooter>
      <div class="flex space-x-10 items-center align-middle">
        <Button variant="link" as-child>
          <a target="_blank" href="/legal"> Privacy and Cookies Policy </a>
        </Button>
        <div class="space-x-2">
          <Button
              type="submit"
              class="h-[30px]"
              :disabled="userConnectorPresent || !isOk"
              :onclick="updateData"
          >
            Save
          </Button>
          <DialogClose as-child>
            <Button type="button" variant="outline" class="h-[30px]"> Cancel </Button>
          </DialogClose>
        </div>
      </div>
    </DialogFooter>
  </div>
</template>
