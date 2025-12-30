import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
    }),
  ],
  server: {
    host: true, // Allow external connections
    port: 5173,
  },
  optimizeDeps: {
    include: ['html2canvas', 'qrcode'], // Include for pre-bundling
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    commonjsOptions: {
      include: [/qrcode/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'html2canvas': ['html2canvas'],
        },
      },
    },
  },
})

