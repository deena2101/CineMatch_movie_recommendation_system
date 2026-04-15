import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy API requests to Flask backend on port 5000
      '/recommend': 'http://localhost:5000',
      '/movies': 'http://localhost:5000',
    }
  }
})
