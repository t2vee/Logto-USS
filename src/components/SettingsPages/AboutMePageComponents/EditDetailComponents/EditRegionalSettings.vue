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

const userData = inject('userData')

const open = ref(false)
const value = ref({})
const footer = import.meta.env.VITE_EDIT_DIALOG_FOOTER_LINK;
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
                  {{ value ? countries.find((name) => name.name === value)?.name : 'Select Country...' }}

                  <ChevronsUpDown class="ml-1 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="p-0">
                <Command v-model="value">
                  <CommandInput placeholder="Select a Country" />
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                          v-for="(name, code) in countries"
                          :key="code"
                          :value="name.name"
                          @select="open = false"
                      >
                        <Check
                            :class="cn(
                  'mr-2 h-4 w-4',
                  value === name.name ? 'opacity-100' : 'opacity-0',
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
            Timezone <span class="text-xs text-grey-200">(Optional)</span>
          </Label>
            <Select>
              <SelectTrigger class="w-[280px]">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>North America</SelectLabel>
                  <SelectItem value="est">
                    (EST) Eastern Standard Time
                  </SelectItem>
                  <SelectItem value="cst">
                    (CST) Central Standard Time
                  </SelectItem>
                  <SelectItem value="mst">
                    (MST) Mountain Standard Time
                  </SelectItem>
                  <SelectItem value="pst">
                    (PST) Pacific Standard Time
                  </SelectItem>
                  <SelectItem value="akst">
                    (AKST) Alaska Standard Time
                  </SelectItem>
                  <SelectItem value="hst">
                    (HST) Hawaii Standard Time
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Europe & Africa</SelectLabel>
                  <SelectItem value="gmt">
                    (GMT) Greenwich Mean Time
                  </SelectItem>
                  <SelectItem value="cet">
                    (CET) Central European Time
                  </SelectItem>
                  <SelectItem value="eet">
                    (EET) Eastern European Time
                  </SelectItem>
                  <SelectItem value="west">
                    (WEST) Western European Summer Time
                  </SelectItem>
                  <SelectItem value="cat">
                    (CAT) Central Africa Time
                  </SelectItem>
                  <SelectItem value="eat">
                    (EAT) East Africa Time (EAT)
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Asia</SelectLabel>
                  <SelectItem value="msk">
                    (MSK) Moscow Time
                  </SelectItem>
                  <SelectItem value="ist">
                    (IST) India Standard Time
                  </SelectItem>
                  <SelectItem value="cst_china">
                    (CST) China Standard Time
                  </SelectItem>
                  <SelectItem value="jst">
                    (JST) Japan Standard Time
                  </SelectItem>
                  <SelectItem value="kst">
                    (KST) Korea Standard Time
                  </SelectItem>
                  <SelectItem value="ist_indonesia">
                    (WITA) Indonesia Central Standard Time
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Australia & Pacific</SelectLabel>
                  <SelectItem value="awst">
                    (AWST) Australian Western Standard Time
                  </SelectItem>
                  <SelectItem value="acst">
                    (ACST) Australian Central Standard Time
                  </SelectItem>
                  <SelectItem value="aest">
                    (AEST) Australian Eastern Standard Time
                  </SelectItem>
                  <SelectItem value="nzst">
                    (NZST) New Zealand Standard Time
                  </SelectItem>
                  <SelectItem value="fjt">
                    (FJT) Fiji Time
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>South America</SelectLabel>
                  <SelectItem value="art">
                    (ART) Argentina Time
                  </SelectItem>
                  <SelectItem value="bot">
                    (BOT) Bolivia Time
                  </SelectItem>
                  <SelectItem value="brt">
                    (BRT) Brasilia Time
                  </SelectItem>
                  <SelectItem value="clt">
                    (CLT) Chile Standard Time
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>
        <div class="grid w-3/4 max-w-sm items-center gap-1.5">
          <Label class="font-bold">
            Language
          </Label>
            <Select>
              <SelectTrigger class="w-[280px]">
                <SelectValue placeholder="Select a Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en-au" >
                    (EN-AU) English AU
                  </SelectItem>
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
          <Button type="submit" class="h-[30px]">
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