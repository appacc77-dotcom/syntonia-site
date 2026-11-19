// Vite: React + Tailwind CSS v4. `base: './'` keeps the built pages usable under any
// hosting prefix (GitHub Pages project URL) and openable from disk (file://).
// Мультистраничная сборка: каждый маршрут из data/routes.json — отдельный HTML-вход.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const { routes } = JSON.parse(readFileSync(resolve(root, 'data/routes.json'), 'utf8'))
const pages = [...routes.map((route) => (route.route === '/' ? 'index.html' : route.route.replace(/^\//, ''))), 'fixtures.html']

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page.replace(/\.html$/, '').replace(/\//g, '-'), resolve(root, page)])),
    },
  },
})
