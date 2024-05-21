import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        dir: 'dist',
        entryFileNames: 'core.js',
        assetFileNames: '[hash:7].css',
        chunkFileNames: "[hash:7].js",
        manualChunks: undefined,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})