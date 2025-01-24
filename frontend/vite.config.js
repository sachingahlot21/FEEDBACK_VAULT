import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/signin': 'https://feedback-vault-api.vercel.app',  // Proxy API requests
    },
  },
})

