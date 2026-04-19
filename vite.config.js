import { defineConfig } from 'vite'

export default defineConfig({
  base: '/life-simulator/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
