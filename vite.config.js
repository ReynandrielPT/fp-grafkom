import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],

  publicDir: false,
  server: {
    allowedHosts: ['petanesia.kevin-andreas.com'],
    host: '0.0.0.0', // Allow external connections
    port: 5173,
    watch: {
      usePolling: true // For Docker file watching
    }
  },
  
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
  },

  base: command === 'build' ? '/fp-grafkom/' : '/',
}))
