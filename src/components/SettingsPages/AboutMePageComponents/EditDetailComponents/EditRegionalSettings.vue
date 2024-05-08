<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import countries from '@/lib/countries.json.js';
import timezones from '@/lib/timezones.json.js';
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import {inject, ref} from 'vue'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {Button} from "@/components/ui/button/index.js";
import {DialogClose, DialogFooter} from "@/components/ui/dialog/index.js";
import Label from "@/components/ui/label/Label.vue";
import {useLogto} from "@logto/vue";
import axios from "axios";
import {toast} from "vue-sonner";
import {eventBus} from "@/lib/eventBus.js";

const { getAccessToken } = useLogto();
const userData = inject('userData')

const open = ref(false)
const selectedCountry = ref({})
const selectedTimezone = ref("")
const footer = import.meta.env.VITE_EDIT_DIALOG_FOOTER_LINK;


async function updateData() {
  let failed = false;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
  try {
    const payload = {
      "timezone": selectedTimezone.value
    }
    if (selectedCountry.value) {
      payload.country = selectedCountry.value
    }
    const response = await axios.post(
        `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/user-data-entry/update-user-information/profile/regional-settings`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        });
    if (response.status === 204) {
      toast.success('Success!',{description: 'Your changes were saved successfully.'})
    }
  } catch (error) {
    toast.error('Error saving changes:',{description: 'Service Unavailable. Try again later'})
    failed = true;
  }
  if (!failed) {
    eventBus.emit('closeEditDetailDialog', false);
    eventBus.emit('refreshUserData', true);
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 py-4 items-center align-middle">
        <div class="grid w-3/4 max-w-sm items-center gap-1.5">
          <Label class="font-bold">
            Country/Region <span class="text-xs text-grey-200">(Optional)</span>
          </Label>
            <Popover v-model:open="open">
              <PopoverTrigger as-child>
                <Button
                    variant="outline"
                    role="combobox"
                    class="justify-between"
                >
                  <p><span v-if="userData.data.profile.address.locality && !Object.keys(selectedCountry).length > 0">(Currently)</span> <span>{{
                      Object.keys(selectedCountry).length > 0 ? `(${countries.find((name) => name.name === selectedCountry)?.code}) ${countries.find((name) => name.name === selectedCountry)?.name}` : (userData.data.profile.address.country ? userData.data.profile.address.country : 'Select a Country')
                    }}</span></p>
                  <ChevronsUpDown class="ml-1 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="p-0">
                <Command v-model="selectedCountry">
                  <CommandInput placeholder="Select a Country" />
                  <CommandEmpty>No Country Found</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                          v-for="(name, code) in countries"
                          :key="code"
                          :value="name.name"
                          @select="open = false"
                          class="hover:text-black"
                      >
                        <Check
                            :class="cn(
                  'mr-2 h-4 w-4',
                  selectedCountry === name.name ? 'opacity-100' : 'opacity-0',
                )"
                        />
                        ({{ name.code }}) {{ name.name }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
        </div>
        <div class="grid w-3/4 max-w-sm items-center gap-1.5 relative">
          <Label class="font-bold">
            Timezone
          </Label>
            <Select v-model="selectedTimezone">
              <SelectTrigger class="w-[280px]">
                <SelectValue :placeholder="userData.data.profile.address.locality ? `(Currently) ${userData.data.profile.address.locality.toUpperCase()}` : 'Select a Timezone'"/>
              </SelectTrigger>
              <SelectContent>
                  <SelectGroup v-for="group in timezones" :key="group">
                    <SelectLabel>{{ group.name }}</SelectLabel>
                    <SelectItem v-for="timezone in group.timezones" :key="timezone.code" :value="timezone.code">{{ timezone.label }}</SelectItem>
                  </SelectGroup>
              </SelectContent>
            </Select>
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
          <Button type="submit" class="h-[30px]" :onclick="updateData" :disabled="!selectedTimezone || !selectedCountry">
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