import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/did-api': {
        target: 'https://api.d-id.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/did-api/, ''),
      },
    }
  }
})
