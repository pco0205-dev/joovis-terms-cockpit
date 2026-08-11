import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the full offline glossary in one cacheable bundle; it remains about 230 kB gzip.
    chunkSizeWarningLimit: 800,
  },
})
