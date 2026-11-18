#!/usr/bin/env node
/**
 * Проверка собранного site/dist перед публикацией.
 *
 *  1. есть HTML-оболочка на каждый маршрут data/routes.json (и она не пустая);
 *  2. один main-*.js и один main-*.css в dist/assets;
 *  3. переносимость: в href/src/style и CSS url() нет корневых URL (`/assets/...`) —
 *     иначе сайт не откроется под /syntonia-site/. В class-литералах Tailwind
 *     `url(/assets/...)` — инертный текст имени класса, его не проверяем;
 *  4. бюджет бандла: main-*.js gzip ≤ 300 КБ.
 *
 * Exit: 0 PASS, 1 FAIL, 2 ERROR.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(SITE, 'dist')
const ASSETS = join(DIST, 'assets')
const JS_BUDGET_GZIP = 300 * 1024

if (!existsSync(DIST) || !existsSync(ASSETS)) {
  console.error('dist: ERROR — нет site/dist (сначала vite build)')
  process.exit(2)
}

const routes = JSON.parse(readFileSync(join(SITE, 'data/routes.json'), 'utf8')).routes.map((r) => r.route)
const problems = []

for (const route of routes) {
  const file = route === '/' ? 'index.html' : route.replace(/^\//, '')
  const abs = join(DIST, file)
  if (!existsSync(abs)) { problems.push(`${file}: нет файла`); continue }
  const html = readFileSync(abs, 'utf8')
  if (html.length < 2000) problems.push(`${file}: подозрительно пустая страница (${html.length} B)`)
  if (!html.includes('id="root" data-prerendered="true"')) problems.push(`${file}: нет SSG-разметки в #root`)
}

for (const route of routes) {
  const file = route === '/' ? 'index.html' : route.replace(/^\//, '')
  const abs = join(DIST, file)
  if (!existsSync(abs)) continue
  const html = readFileSync(abs, 'utf8')
  for (const m of html.matchAll(/\b(href|src|action|poster)="([^"]*)"/g)) {
    const value = m[2]
    if (value.startsWith('/') && !value.startsWith('//')) problems.push(`${file}: ${m[1]}="${value}"`)
  }
}

const assets = readdirSync(ASSETS)
const mains = assets.filter((name) => /^main-.*\.js$/.test(name))
const styles = assets.filter((name) => /^main-.*\.css$/.test(name))
if (mains.length !== 1) problems.push(`ожидался один main-*.js, найдено ${mains.length}: ${mains.join(', ')}`)
if (styles.length !== 1) problems.push(`ожидался один main-*.css, найдено ${styles.length}: ${styles.join(', ')}`)

let gzipKb = 0
for (const name of mains) {
  const buf = readFileSync(join(ASSETS, name))
  const gzip = gzipSync(buf).length
  gzipKb = Math.round(gzip / 1024)
  if (gzip > JS_BUDGET_GZIP) problems.push(`${name}: gzip ${gzipKb} КБ > бюджета ${JS_BUDGET_GZIP / 1024} КБ`)
  // строки url(/assets/...) в JS — это className-литералы React, а не URL (как в HTML class=);
  // их переименовывает публикационный шаг scripts/publish.mjs.
}
if (problems.length) {
  console.error(`dist: FAIL — ${problems.length} проблем`)
  for (const p of problems.slice(0, 20)) console.error('  - ' + p)
  process.exit(1)
}
const bytes = routes.reduce((sum, route) => {
  const file = route === '/' ? 'index.html' : route.replace(/^\//, '')
  return sum + statSync(join(DIST, file)).size
}, 0)
console.log(`dist: PASS — ${routes.length} маршрутов, ${(bytes / 1024).toFixed(0)} КБ HTML, main js gzip ${gzipKb} КБ`)
