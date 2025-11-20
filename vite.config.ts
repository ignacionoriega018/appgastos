import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/appgastos/', // Critical for GitHub Pages subpath
  build: {
    outDir: 'dist',
  },
  publicDir: 'public' // Explicitly state public directory
})