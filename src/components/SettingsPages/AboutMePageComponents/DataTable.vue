<script setup>
import VerifiedDetails from "@/components/SettingsPages/AboutMePageComponents/VerifiedDetails.vue";

defineProps({
  userData: {
    type: Object,
    required: true,
  },
  verified: {
    type: Boolean,
  },
  detailVerified: {
    type: Boolean,
  },
  detailType: {
    type: String,
    validator: value => ['email', 'phone'].includes(value)
  }
});
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full table-auto">
      <tbody>
        <tr v-for="(value, type) in userData" :key="type">
          <td class="px-4 pl-0 py-2 whitespace-normal text-sm font-semibold min-w-[75px] break-words">
            {{ type }}
          </td>
          <td class="px-4 py-2 whitespace-normal text-sm text-gray-500 min-w-[175px] break-words">
            {{ value }}
          </td>
          <td v-if="verified" class="px-4 pl-9 whitespace-normal text-sm text-gray-500 break-words">
            <VerifiedDetails :user-data="userData" :detail-verified="detailVerified" :detail-type="detailType" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>