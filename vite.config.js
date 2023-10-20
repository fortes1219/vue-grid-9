import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path"

export default defineConfig({
  base: process.env.NODE_ENV === 'production'
  ? '/vue-grid-9/' : './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
      "/assets": path.resolve(__dirname, "src/assets/"),
      "/img": path.resolve(__dirname, "src/assets/img"),
      "/styles": path.resolve(__dirname, "src/styles/"),
      "/pages": path.resolve(__dirname, "src/pages/"),
    },
  },
  plugins: [vue()],
  server: {
    port: 3000,
  },
  css: {
    devSourcemap: true
  }
})
