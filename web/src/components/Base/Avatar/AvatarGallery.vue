<script setup>
import { inject, onMounted, ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/index.js'
import SingleGalleryAvatar from '@/components/Base/Avatar/SingleGalleryAvatar.vue'
import { Button } from '@/components/ui/button/index.js'
import axios from 'redaxios'
import { toast } from 'vue-sonner'
import { eventBus } from '@/lib/eventBus.js'
import { useLogto } from '@logto/vue'
import { DialogClose, DialogFooter } from '@/components/ui/dialog/index.js'
import * as jdenticon from 'jdenticon'
import Hashicon from 'hashicon';
import { getAvatar as generateMonsterID } from '@/lib/identicons/monsterid.js'
import Blockies from '@/lib/identicons/blockies.js'

const avatars = ref([])
const { getAccessToken } = useLogto()
const selectedAvatarId = ref(null)
const selectedAvatarUrl = ref('')
const isLoading = ref(false)

// god i hate jdenticon so much. they make it so difficult to do the most basic shit. fuck this library
const createJdenticon = (hash) => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const avatar = canvas.getContext('2d');
  jdenticon.drawIcon(avatar, hash, 128);
  return canvas.toDataURL();
}

function dec2hex (dec) {
  return dec.toString(16).padStart(2, "0")
}

function generateId (len) {
  const arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}

const generateAvatars = async (loadMore = false) => {
  let identiconUrls = [];
  let ii = 0
  for (let i = 0; i < 32; i++) {
    if (ii === 3) { ii = 0 } else { ii++ }
    switch (ii) {
      case 0:
        identiconUrls.push({
          id: i,
          imageUrl: createJdenticon(generateId(32))
        });
        break;
      case 1:
        identiconUrls.push({
          id: i,
          imageUrl:
            Hashicon(generateId(32), {
            size: 128
          }).toDataURL(),
        });
        break;
      case 2:
        identiconUrls.push({
          id: i,
          imageUrl: generateMonsterID(generateId(32), 128, 128),
        });
        break;
      case 3:
        // eslint-disable-next-line no-case-declarations
        const options = {
          seed: generateId(32),
          size: 8,
          scale: 16,
        };
        identiconUrls.push({
          id: i,
          imageUrl: Blockies.create(options).toDataURL()
        });
        break;
    }
  }
  if (loadMore) {
    avatars.value = [...avatars.value, ...identiconUrls]
  } else {
    avatars.value = identiconUrls
  }
}

const selectAvatar = (id, url) => {
  selectedAvatarId.value = id
  selectedAvatarUrl.value = url
}
const loadMoreAvatars = () => generateAvatars(true)

onMounted(() => generateAvatars())

const fetchGalleryAvatar = async () => {
  try {
    const blob = await fetch(selectedAvatarUrl.value).then(it => it.blob())
    const formData = new FormData()
    formData.append('file', blob, 'image.png')
    return formData
  } catch (error) {
    console.log('Error during image fetching or uploading:', error)
  }
}

const uploadFile = async () => {
  isLoading.value = true
  let failed = false
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
  const formData = await fetchGalleryAvatar()
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v2/me/avatar/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'}})
    if (response.status === 204) {
      toast.success('Success!', { description: 'Your changes were saved successfully.' })
    }
  } catch (error) {
    failed = true
    console.log('Error uploading file:', error)
    if (error.response.status === 500) {
      toast.error('Error saving changes:', { description: 'Service Unavailable. Try again later' })
    } else if (error.response.status === 406) {
      toast.warning('Please Upload a Different Image:', {
        description: 'The image you have selected is not suitable as a avatar'
      })
    }
  } finally {
    isLoading.value = false
  }
  if (!failed) {
    eventBus.emit('closeEditDetailDialog', false)
    eventBus.emit('refreshUserData', true)
  }
}
</script>

<template>
  <div class="space-y-4">
    <Card class="h-[420px]">
      <CardHeader>
        <CardTitle>Choose a Generated Avatar</CardTitle>
        <CardDescription>
          Avatars based on different generation algorithms.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-2 overflow-y-auto max-h-[300px]">
        <div class="p-4 flex flex-col items-center align-middle">
          <div class="grid grid-cols-8 gap-4">
            <SingleGalleryAvatar
              v-for="(avatar, index) in avatars"
              :key="`${avatar.id}-${index}`"
              :imageUrl="avatar.imageUrl"
              @click="selectAvatar(`${avatar.id}-${index}`, avatar.imageUrl)"
              :selected="selectedAvatarId === `${avatar.id}-${index}`"
            />
          </div>
          <Button variant="link" @click="loadMoreAvatars">Load More</Button>
        </div>
      </CardContent>
    </Card>
    <DialogFooter class="right-0">
      <DialogClose as-child>
        <Button type="button" variant="outline" class="h-[30px]"> Close </Button>
      </DialogClose>
      <Button @click="uploadFile" class="h-[30px]" :disabled="!selectedAvatarId || isLoading">
        <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" color="black" />
        {{ isLoading ? 'Processing...' : 'Save' }}
      </Button>
    </DialogFooter>
  </div>
</template>
