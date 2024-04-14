<script setup>
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios';
import {inject, ref } from 'vue';
import { useLogto } from '@logto/vue';
import debounce from 'lodash/debounce';
import {Ban, UserRoundCheck, MoreHorizontal} from 'lucide-vue-next';
import * as z from 'zod';
import {Button} from "@/components/ui/button/index.js";
import {DialogClose, DialogFooter} from "@/components/ui/dialog/index.js";
import ConnectorAlert from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/ConnectorAlert.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const userData = inject('userData')
const userConnectorPresent = inject('userConnectorPresent')

const { getAccessToken } = useLogto();
const username = ref('');
const isChecking = ref(false);
const isAvailable = ref(false);
const usernameChecked = ref(false);

const BasicInformationSchema = z.object({
  userid: z.string().length(12).trim().toLowerCase(),
  username: z.string().min(3).max(18).trim().toLowerCase(),
  realname: z.string(),
});

const checkUsernameAvailability = async (value) => {
  value = value.trim();
  if (!value) {
    isChecking.value = false;
    usernameChecked.value = false;
    isAvailable.value = false;
    return;
  }
  isChecking.value = true;
  usernameChecked.value = false;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/check-username-exists/${value}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    isAvailable.value = response.status === 204;
  } catch (error) {
    console.error('Error checking username availability:', error);
    isAvailable.value = error.response && error.response.status === 404;
  } finally {
    isChecking.value = false;
    usernameChecked.value = true;
  }
};

const debouncedCheckUsername = debounce(() => checkUsernameAvailability(username.value), 500);
</script>

<template>
  <div>
    <ConnectorAlert v-if="userConnectorPresent" custom-message="A password is not required for accounts that are authenticated externally. To change your password, head over to your account provider." />
    <div class="flex flex-col gap-4 py-4 items-center align-middle">
      <div class="grid w-3/4 max-w-sm items-center gap-1.5">
        <Label for="userid" class="font-bold">
          Old Password <span v-if="!userConnectorPresent" class="text-xs text-grey-200">(Cannot Change)</span>
        </Label>
        <Input id="userid" disabled placeholder="********" />
      </div>
      <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
        <Label for="username" class="flex font-bold w-full justify-between">
          New Password
          <span v-if="isAvailable && usernameChecked" class="text-xs text-green-500">Username Available!</span>
          <span v-else-if="!isAvailable && usernameChecked" class="text-red-500">Username Taken</span>
        </Label>
        <div>
          <Input
              id="username"
              :disabled="userConnectorPresent"
              v-model="username"
              @input="debouncedCheckUsername"
              :class="{
                     'border-red-500': !isAvailable && usernameChecked,
                     'border-green-500': isAvailable && usernameChecked
                    }"
              placeholder="********"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pt-7 pr-1">
            <MoreHorizontal v-if="isChecking" />
            <UserRoundCheck v-else-if="isAvailable && usernameChecked" class="text-green-500" />
            <Ban v-else-if="!isAvailable && usernameChecked" class="text-red-500" />
          </div>
        </div>
      </div>
      <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
        <Label for="username" class="flex font-bold w-full justify-between">
          Confirm New Password
          <span v-if="isAvailable && usernameChecked" class="text-xs text-green-500">Username Available!</span>
          <span v-else-if="!isAvailable && usernameChecked" class="text-red-500">Username Taken</span>
        </Label>
        <div>
          <Input
              id="username"
              :disabled="userConnectorPresent"
              v-model="username"
              @input="debouncedCheckUsername"
              :class="{
                     'border-red-500': !isAvailable && usernameChecked,
                     'border-green-500': isAvailable && usernameChecked
                    }"
              placeholder="********"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pt-7 pr-1">
            <MoreHorizontal v-if="isChecking" />
            <UserRoundCheck v-else-if="isAvailable && usernameChecked" class="text-green-500" />
            <Ban v-else-if="!isAvailable && usernameChecked" class="text-red-500" />
          </div>
        </div>
      </div>
      <div v-if="!userConnectorPresent" class="grid w-3/4 max-w-sm items-center gap-1.5">
        <Label for="realname" class="font-bold">
          Real Name (Optional)
        </Label>
        <Input
            id="realname"
            :placeholder="userData.name"
        />
      </div>
    </div>
    <DialogFooter>
      <div class="flex space-x-12 items-center align-middle">
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="link">
              Password Requirements
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-120">
            <div class="grid gap-4">

              <ul class="text-sm space-y-2">
                <li>
                  > Should be a <strong>minimum of 12 Characters</strong>
                </li>
                <li>
                  > Should contain <strong>a few Uppercase Characters</strong>
                </li>
                <li>
                  > Should contain <strong>non-alphanumeric characters</strong>
                </li>
                <li>
                  > Should <strong>Not</strong> contain any <strong>Common Words</strong>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
        <div class="space-x-2">
          <Button type="submit" class="h-[30px]" :disabled="userConnectorPresent">
            Save
          </Button>
          <DialogClose as-child>
            <Button type="button" variant="outline" class="h-[30px]">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogFooter>
  </div>
</template>

<style scoped>

</style>