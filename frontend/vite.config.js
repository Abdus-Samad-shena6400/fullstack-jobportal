import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // during development, forward `/api` requests to the backend
    // running on localhost:5000 so we can avoid CORS and use the
    // same relative paths as in production.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
