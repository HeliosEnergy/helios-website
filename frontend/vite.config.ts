// /Users/amoldericksoans/Documents/Helios/data_analysis/frontend/vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss' // <-- IMPORT @tailwindcss/postcss instead
import autoprefixer from 'autoprefixer' // <-- IMPORT autoprefixer

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // --- THIS IS THE CRITICAL CHANGE ---
    // We are now defining the PostCSS plugins directly here
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 9725,
    host: true,
    proxy: {
      '/itu-proxy': {
        target: 'https://bbmaps.itu.int',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/itu-proxy/, ''),
        secure: false
      }
    }
  },
})