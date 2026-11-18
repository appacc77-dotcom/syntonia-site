#!/usr/bin/env node
/**
 * SSG-шаг сборки: рендерит entry-server в готовые HTML-оболочки dist.
 * Все маршруты data/routes.json, включая library/*.html.
 * Meta (title/description/OG) уже лежит в оболочках — её пишет generate.
 *
 * Exit: 0 PASS, 1 FAIL (нет оболочки/пустой рендер), 2 ERROR (нет SSR-сборки/маршрутов).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(SITE, 'dist')
const ENTRY = join(SITE, '.ssr/entry-server.js')
const ROUTES_FILE = join(SITE, 'data/routes.json')
const ROOT_MARK = '<div id="root"></div>'
const MIN_HTML = 2_000

if (!existsSync(ENTRY)) {
  console.error('ssg: ERROR — нет .ssr/entry-server.js (vite build --config vite.ssr.config.js)')
  process.exit(2)
}
if (!existsSync(ROUTES_FILE)) {
  console.error(`ssg: ERROR — нет data/routes.json`)
  process.exit(2)
}

const routes = JSON.parse(readFileSync(ROUTES_FILE, 'utf8')).routes.map((route) => route.route)
if (!routes.length) {
  console.error('ssg: ERROR — data/routes.json пуст')
  process.exit(2)
}

const { render } = await import(pathToFileURL(ENTRY).href)

let rendered = 0
let bytes = 0
for (const route of routes) {
  const file = join(DIST, route === '/' ? 'index.html' : route.slice(1))
  if (!existsSync(file)) {
    console.error(`ssg: FAIL — нет оболочки ${file}`)
    process.exit(1)
  }
  const html = readFileSync(file, 'utf8')
  if (!html.includes(ROOT_MARK)) {
    console.error(`ssg: FAIL — в ${file} нет ${ROOT_MARK}`)
    process.exit(1)
  }
  if (!/<title>[^<]+<\/title>/.test(html) || !/<meta name="description" content="[^"]+"/.test(html)) {
    console.error(`ssg: FAIL — в ${file} нет title/description`)
    process.exit(1)
  }
  const markup = render(route)
  if (!markup || markup.length < MIN_HTML) {
    console.error(`ssg: FAIL — пустой рендер ${route} (${markup?.length ?? 0} B)`)
    process.exit(1)
  }
  // data-route фиксирует маршрут: гидратация не зависит от pathname и base path.
  const out = html.replace(ROOT_MARK, `<div id="root" data-prerendered="true" data-route="${route}">${markup}</div>`)
  writeFileSync(file, out)
  rendered += 1
  bytes += out.length
  console.log(`ssg: ${route} → ${(out.length / 1024).toFixed(0)} KB HTML`)
}
console.log(`ssg: PASS — ${rendered}/${routes.length} маршрутов, ${(bytes / 1024 / 1024).toFixed(1)} МБ HTML`)
