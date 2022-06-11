import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 添加别名
    alias: {
      '@': resolve(__dirname, '/src'),
    }
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      }
    }
  }
})
