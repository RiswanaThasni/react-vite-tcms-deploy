import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': '/src'  // Optional: Helps with cleaner imports
    }
  },
  preview: {
    port: 4173,
    strictPort: true
  }
})
