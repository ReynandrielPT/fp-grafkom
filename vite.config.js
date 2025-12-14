import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }

  base: command === 'build' ? '/fp-grafkom/' : '/',

  server: {
    host: true,
    allowedHosts: ['indomap.kevin-andreas.com'],
    port: 5173
  }
}))
