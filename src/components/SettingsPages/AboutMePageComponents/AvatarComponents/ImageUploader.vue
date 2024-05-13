<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useLogto } from '@logto/vue';
import { ImageUp, Trash2 } from 'lucide-vue-next';
import { eventBus } from "@/lib/eventBus.js";
import {toast} from "vue-sonner";

const { isAuthenticated, getAccessToken } = useLogto();
const fileInput = ref(null);
const preview = ref(null);
let selectedFile = ref(null);

const isLoading = defineModel(false);

const openFileDialog = () => {
  fileInput.value.click();
};

const prepareFile = () => {
  const files = fileInput.value.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
    preview.value = URL.createObjectURL(files[0]);
  }
};

const uploadFileWrapper = async () => {
  if (!selectedFile.value) return;
  if (isAuthenticated.value) {
    isLoading.value = true;
    await uploadFile(selectedFile.value);
  } else {
    console.log('User is not authenticated');
  }
};

const uploadFile = async (file) => {
  let failed = false;
  const accessToken = await getAccessToken(import.meta.env.VITE_LOGTO_CORE_RESOURCE);
  const formData = new FormData();
  formData.append('file', file);
  formData.set("file", fileInput.value.files[0], `image.${file.name.split('.').pop()}`);
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_WORKER_ENDPOINT}/api/v1/user-data-entry/update-user-information/avatar-service/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 204) {
      toast.success('Success!',{description: 'Your changes were saved successfully.'})
      preview.value = null;
      selectedFile.value = null;
    }
  } catch (error) {
    failed = true;
    console.log('Error uploading file:', error);
    if (error.response.status === 500) {
      toast.error('Error saving changes:',{description: 'Service Unavailable. Try again later'})
    } else if (error.response.status === 406) {
      toast.warning('Please Upload a Different Image:',{description: 'The image you have selected is not suitable as a avatar'})
      preview.value = null;
      selectedFile.value = null;
    }
  } finally {
    isLoading.value = false;
  }
  if (!failed) {
    eventBus.emit('closeEditDetailDialog', false);
    eventBus.emit('refreshUserData', true);
  }
};

const clearPreview = () => {
  preview.value = null;
  selectedFile.value = null;
  fileInput.value.value = '';
};

defineExpose({
  prepareFile,
  uploadFileWrapper
});
</script>

<template>
  <div
      @click="openFileDialog"
      @dragover.prevent="dragOver"
      @drop.prevent="handleDrop"
      @dragleave.prevent="dragLeave"
      class="flex flex-col justify-center items-center w-full h-64 rounded-lg border-2 border-dashed border-gray-400 cursor-pointer hover:border-gray-600 space-y-4 relative"
  >
    <div v-if="preview" class="w-full h-64 flex justify-center items-center overflow-hidden rounded-lg py-4">
      <img :src="preview" class="max-w-[150px]" alt="Image preview" />
      <button
          class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
          @click.stop="clearPreview"
      >
        <Trash2 />
      </button>
    </div>
    <label v-else class="flex justify-center items-center" :class="isLoading ? 'cursor-not-allowed' : 'cursor-pointer'">
      <ImageUp class="text-gray-400" />
      <span class="ml-1 text-base leading-normal text-gray-400">Upload File</span>
    </label>
    <input type="file" class="hidden" ref="fileInput" name="file" @change="prepareFile" accept=".svg, .png, .jpeg, .jpg, .ico, .gif, .webp, .bmp" />
  </div>
</template>