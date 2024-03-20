<script setup>

import {Card} from "@/components/ui/card/index.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Separator from "@/components/ui/separator/Separator.vue";
import Label from "@/components/ui/label/Label.vue";
</script>

<template>
  <Card class="p-9 w-full flex align-middle items-center justify-evenly" style="border-bottom-right-radius:0;border-bottom-left-radius:0;">
    <div class="grid grid-cols-2 space-x-5">
      <nav class="text-sm">
        <Label for="linklist" class="font-bold">MXS Services</Label>
        <ol id="linklist" class="space-y-2 text-xs">
          <li>
            <a class="red" href="/">
              Legal
            </a>
          </li>
          <li>User Agreement</li>
          <li>
            <a class="red" href="/">
              Privacy Policy
            </a>
          </li>
          <li>Terms of Service</li>
        </ol>
      </nav>
      <div>
        <p class="font-bold">Language</p>
        <Select>
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="English" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Language</SelectLabel>
              <SelectItem value="en-AU">
                EN-AU
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
    <Separator orientation="vertical" class="h-[100px] text-white" />
    <img width="200px" src="https://content-delivery.maxmess.services/content/gZdtNe654p1N7WSEwBC2/maxmess.services/Images/MXSOS.webp" alt="msx-logo">
  </Card>
</template>

<style scoped>

</style>