import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [  tailwindcss(),
    react()],
    // base: process.env.VITE_BASE_PATH || '/react-vite-tcms-deploy', 
    base: '/',
    server:{
      host:'0.0.0.0',
      port:5173
    },
    build: {
      outDir: 'dist'
    }
})
