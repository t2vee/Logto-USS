<script setup>
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios';
import {inject, ref } from 'vue';
import { useLogto } from '@logto/vue';
import {Button} from "@/components/ui/button/index.js";
import {DialogClose, DialogFooter} from "@/components/ui/dialog/index.js";
import ConnectorAlert from "@/components/SettingsPages/AboutMePageComponents/EditDetailComponents/ConnectorAlert.vue";


const userData = inject('userData')
const userConnectorPresent = inject('userConnectorPresent')

const { getAccessToken } = useLogto();
const username = ref('');
const isChecking = ref(false);
const isAvailable = ref(false);
const usernameChecked = ref(false);
const footer = import.meta.env.VITE_EDIT_DIALOG_FOOTER_LINK;
</script>

<template>
  <div>
    <ConnectorAlert v-if="userConnectorPresent" />
    <div class="flex flex-col gap-4 py-4 items-center align-middle">
      <div class="grid w-3/4 max-w-sm items-center gap-1.5">
        <Label for="userid" class="font-bold">
          User ID <span v-if="!userConnectorPresent" class="text-xs text-grey-200">(Cannot Change)</span>
        </Label>
        <Input id="userid" disabled :default-value="userData.sub" :placeholder="userData.sub" />
      </div>
      <div class="grid w-3/4 max-w-sm items-center gap-1.5">
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
      <div class="flex space-x-10 items-center align-middle">
        <Button variant="link" as-child>
          <a target="_blank" :href="footer">
            Privacy and Cookies Policy
          </a>
        </Button>
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