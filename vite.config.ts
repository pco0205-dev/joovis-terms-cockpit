import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The static glossary stays in one offline-ready bundle and transfers at roughly 160 kB gzip.
    chunkSizeWarningLimit: 600,
  },
})
