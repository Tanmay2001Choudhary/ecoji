import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5180,
    strictPort: false,
  },
  optimizeDeps: {
    include: ['react-pageflip', 'page-flip', 'react-pdf', 'pdfjs-dist'],
  }
})
