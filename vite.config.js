import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-window'],
          'dashboard': ['src/pages/Dashboard.jsx', 'src/components/employee'],
          'analytics': ['src/hooks', 'src/services']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})

