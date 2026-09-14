import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://   mss-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})