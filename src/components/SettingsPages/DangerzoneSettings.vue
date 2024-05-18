<script setup>
import {AlertTriangle, OctagonPause} from "lucide-vue-next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DangerZoneAlertDialog from "@/components/SettingsPages/Global/DangerZoneAlertDialog.vue";
import TerminateAccount from "@/components/DangerZoneComponents/DetailComponents/TerminateAccount.vue";
import SuspendAccount from "@/components/DangerZoneComponents/DetailComponents/SuspendAccount.vue";

</script>

<template>
  <div class="w-[600px] space-y-5">
    <CardTitle class="my-4 ">You are entering the Danger Zone</CardTitle>
    <CardDescription class="">Here you can access destructive actions for managing your account. Most settings here can have potentially unwanted affects on your account. So be careful!</CardDescription>
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger class="text-red-600">I Understand. Show me Account Actions...</AccordionTrigger>
        <AccordionContent class="space-y-3">
          <DangerZoneAlertDialog title="Suspend Your Account" desc='Here you can suspend/disable your account and access to it. To renable your account you will have to contact support.' :dialog-page="SuspendAccount" :icon="OctagonPause" />
          <DangerZoneAlertDialog destructive title="Terminate Your Account" desc='Completely terminate your account and remove all data connected to it. This action is irreversible!' :dialog-page="TerminateAccount" :icon="AlertTriangle" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style scoped></style>
