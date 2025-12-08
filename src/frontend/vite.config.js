import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core - loaded on every page
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Redux - for state management
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],

          // Axios for API calls
          'vendor-axios': ['axios'],

          // Stripe - loaded only on payment pages
          'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],

          // Sentry - error tracking
          'vendor-sentry': ['@sentry/react'],
        }
      }
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: 'esbuild'
  }
})
