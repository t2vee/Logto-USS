<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ImageUp, Trash2 } from 'lucide-vue-next';
import { useLogto } from '@logto/vue';

const { isAuthenticated, getAccessToken } = useLogto();
const fileInput = ref(null);
const preview = ref(null);
let selectedFile = ref(null);

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
    const accessToken = await getAccessToken();
    await uploadFile(selectedFile.value, accessToken);
  } else {
    console.log('User is not authenticated');
  }
};

const uploadFile = async (file, accessToken) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axios.post(import.meta.env.VITE_LOGTO_ENDPOINT + '/api/user-assets', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File uploaded successfully:', response.data);
    preview.value = null;
    selectedFile.value = null;
  } catch (error) {
    console.error('Error uploading file:', error);
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
    <label v-else class="flex justify-center items-center">
      <ImageUp class="text-gray-400" />
      <span class="ml-1 text-base leading-normal text-gray-400">Upload File</span>
    </label>
    <input type="file" class="hidden" ref="fileInput" @change="prepareFile" accept=".svg, .png, .jpeg, .jpg, .ico" />
  </div>
</template>

<style scoped>
</style>
