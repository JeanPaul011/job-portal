import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'; // ✅ Fixes the error


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js'
  }
})
