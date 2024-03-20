<script setup>
import { ref, onMounted } from 'vue';
import { ExternalLink } from "lucide-vue-next";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card/index.js";
import SingleGalleryAvatar from "@/components/SettingsPages/AboutMePageComponents/AvatarComponents/SingleGalleryAvatar.vue";
import { Button } from '@/components/ui/button/index.js';

const avatars = ref([]);
const selectedAvatarId = ref(null);
const avatarEndpoint = import.meta.env.VITE_AVATAR_SERVICE_ENDPOINT;

const fetchAvatars = async (loadMore = false) => {
  try {
    const currentOffset = avatars.value.length;
    const loadAmount = loadMore ? 16 : 32; // Load 32 initially, or 16 more if loading more
    const response = await fetch(`${avatarEndpoint}/random-hash-return/gen/r/inputString?limit=${loadAmount}&offset=${currentOffset}`);
    const data = await response.json();
    if (loadMore) {
      avatars.value = [...avatars.value, ...data.identiconUrls];
    } else {
      avatars.value = data.identiconUrls;
    }
  } catch (error) {
    console.error("Error fetching avatars:", error);
  }
};

const getFullImageUrl = (imageUrl) => `${avatarEndpoint}${imageUrl}`;
const selectAvatar = (id) => {
  selectedAvatarId.value = id;
};
const loadMoreAvatars = () => fetchAvatars(true);

onMounted(() => fetchAvatars());
</script>

<template>
  <Card class="h-[420px]">
    <CardHeader>
      <CardTitle>Choose a Generated Avatar</CardTitle>
      <CardDescription>
        Avatars based on different generation algorithm methods.
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-2 card-content-scrollable">
      <div class="p-4 flex flex-col items-center align-middle">
        <div class="grid grid-cols-8 gap-4">
          <SingleGalleryAvatar
              v-for="(avatar, index) in avatars"
              :key="`${avatar.id}-${index}`"
              :imageUrl="getFullImageUrl(avatar.imageUrl)"
              @click="selectAvatar(`${avatar.id}-${index}`)"
              :selected="selectedAvatarId === `${avatar.id}-${index}`"
          />
        </div>
        <Button variant="link" @click="loadMoreAvatars">Load More</Button>
      </div>
    </CardContent>
    <CardFooter class="">
      <a :href="avatarEndpoint" class="flex align-middle items-center text-xs"><ExternalLink class="p-1" />Powered by the MXS Avatar Service.</a>
    </CardFooter>
  </Card>
</template>

<style scoped>
.card-content-scrollable {
  overflow-y: auto; /* Enables vertical scrolling */
  max-height: 278px; /* Sets the maximum height of the content area */
}
</style>