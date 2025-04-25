import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '${import.meta.env.VITE_API_BASE_URL}': 'http://localhost:8000'
    }
  },
  plugins: [react()],
})
