<script setup>
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion/index.js'
import {CardDescription, CardTitle} from '@/components/ui/card/index.js'
import TerminateAccount from "@/components/Pages/DangerZone/TerminateAccount.vue"
import SuspendAccount from "@/components/Pages/DangerZone/SuspendAccount.vue"
import {AlertTriangle} from "lucide-vue-next";
import {useMediaQuery} from "@vueuse/core";

const isDesktop = useMediaQuery('(min-width: 1023px)')
</script>

<template>
  <div class="w-screen desktop:w-[600px] phone:px-4 tablet:px-32 desktop:space-y-5">
    <CardTitle class="my-4 flex">
      <AlertTriangle :size="isDesktop ? 22 : 54" class="mr-5 desktop:mr-1" />
      You are entering the Danger Zone
    </CardTitle>
    <CardDescription>Here you can access destructive actions for managing your account. Most settings here can have potentially unwanted affects on your account. So be careful!</CardDescription>
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger class="text-red-600">I Understand. Show me Account Actions...</AccordionTrigger>
        <AccordionContent class="space-y-3">
          <SuspendAccount />
          <TerminateAccount />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<style scoped></style>
