// SSR-сборка entry-server для SSG (site/scripts/ssg.mjs).
// CSS сюда не входит: стили уже собраны клиентской сборкой, серверу нужна разметка.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: '.ssr',
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: 'entry-server.js' } },
  },
})
