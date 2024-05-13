<script setup>
import {ref, onMounted, inject} from 'vue';
import {ExternalLink, Loader2} from "lucide-vue-next";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card/index.js";
import SingleGalleryAvatar from "@/components/SettingsPages/AboutMePageComponents/AvatarComponents/SingleGalleryAvatar.vue";
import { Button } from '@/components/ui/button/index.js';
import axios from "axios";
import {toast} from "vue-sonner";
import {eventBus} from "@/lib/eventBus.js";
import {useLogto} from "@logto/vue";
import {DialogClose, DialogFooter} from "@/components/ui/dialog/index.js";

const avatars = ref([]);
const { getAccessToken } = useLogto();
const userData = inject('userData')
const selectedAvatarId = ref(null);
const selectedAvatarUrl = ref('');
const isLoading = ref(false);
const avatarEndpoint = import.meta.env.VITE_AVATAR_SERVICE_ENDPOINT;

const fetchAvatars = async (loadMore = false) => {
  try {
    const currentOffset = avatars.value.length;
    const loadAmount = loadMore ? 16 : 32;
    const response = await fetch(`${avatarEndpoint}/avatar-service/v1/gen/uris/r/${userData.value.sub}?limit=${loadAmount}&offset=${currentOffset}`);
    const data = await response.json();
    if (loadMore) {
      avatars.value = [...avatars.value, ...data.identiconUrls];
    } else {
      avatars.value = data.identiconUrls;
    }
  } catch (error) {
    console.log("Error fetching avatars:", error);
  }
};

const getFullImageUrl = (imageUrl) => `${avatarEndpoint}${imageUrl}`;
const selectAvatar = (id, url) => {
  selectedAvatarId.value = id;
  selectedAvatarUrl.value = url;
};
const loadMoreAvatars = () => fetchAvatars(true);

onMounted(() => fetchAvatars());

const fetchGalleryAvatar = async () => {
  try {
    const response = await axios({
      url: selectedAvatarUrl.value,
      method: 'GET',
      responseType: 'blob'
    });
    console.log(response)
    const formData = new FormData();
    console.log(formData);
    formData.append('file', response.data, 'image.png');
    return formData;
  } catch (error) {
    console.log('Error during image fetching or uploading:', error);
  }
}

const uploadFile = async () => {
  isLoading.value = true;
  let failed = false;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
  const formData = await fetchGalleryAvatar()
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/user-data-entry/update-user-information/avatar-service/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 204) {
      toast.success('Success!',{description: 'Your changes were saved successfully.'})
    }
  } catch (error) {
    failed = true;
    console.log('Error uploading file:', error);
    if (error.response.status === 500) {
      toast.error('Error saving changes:',{description: 'Service Unavailable. Try again later'})
    } else if (error.response.status === 406) {
      toast.warning('Please Upload a Different Image:',{description: 'The image you have selected is not suitable as a avatar'})
    }
  } finally {
    isLoading.value = false;
  }
  if (!failed) {
    eventBus.emit('closeEditDetailDialog', false);
    eventBus.emit('refreshUserData', true);
  }
};
</script>

<template>
  <div class="space-y-4">
    <Card class="h-[420px]">
      <CardHeader>
        <CardTitle>Choose a Generated Avatar</CardTitle>
        <CardDescription>
          Avatars based on different generation algorithm methods.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-2 overflow-y-auto max-h-[278px]">
        <div class="p-4 flex flex-col items-center align-middle">
          <div class="grid grid-cols-8 gap-4">
            <SingleGalleryAvatar
                v-for="(avatar, index) in avatars"
                :key="`${avatar.id}-${index}`"
                :imageUrl="getFullImageUrl(avatar.imageUrl)"
                @click="selectAvatar(`${avatar.id}-${index}`, getFullImageUrl(avatar.imageUrl))"
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
    <DialogFooter>
      <Button @click="uploadFile" class="h-[30px]" :disabled="!selectedAvatarId || isLoading">
        <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" color="black" />
        {{ isLoading ? 'Processing...' : 'Save' }}
      </Button>
      <DialogClose as-child>
        <Button type="button" variant="outline" class="h-[30px]">
          Close
        </Button>
      </DialogClose>
    </DialogFooter>
  </div>
</template>