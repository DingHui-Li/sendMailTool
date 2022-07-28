import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
// base: path.resolve(__dirname, './dist/'),
export default defineConfig({
  base: "./",
  plugins: [vue()],
  server: {
    port: 2333
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
