import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [  tailwindcss(),
    react()],
    base: process.env.VITE_BASE_PATH || '/react-vite-tcms-deploy', 
    server:{
      host:'0.0.0.0',
      port:5173
    }
})
