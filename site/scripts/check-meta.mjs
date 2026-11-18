#!/usr/bin/env node
/**
 * Проверка meta всех маршрутов сборки: title/description/OG на каждой странице,
 * покрытие data/seo.json = data/routes.json, без шаблонных заголовков.
 *
 * Exit: 0 PASS, 1 FAIL (нет meta/расхождение маршрутов), 2 ERROR (нет dist/входов).
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(SITE, 'dist')
const ROUTES_FILE = join(SITE, 'data/routes.json')
const SEO_FILE = join(SITE, 'data/seo.json')

if (!existsSync(DIST) || !existsSync(ROUTES_FILE) || !existsSync(SEO_FILE)) {
  console.error('meta: ERROR — нет site/dist, data/routes.json или data/seo.json')
  process.exit(2)
}

const routes = JSON.parse(readFileSync(ROUTES_FILE, 'utf8')).routes.map((route) => route.route)
const seo = JSON.parse(readFileSync(SEO_FILE, 'utf8')).routes ?? {}
const problems = []

for (const route of routes) {
  if (!seo[route]) problems.push(`${route}: нет SEO-записи в data/seo.json`)
}
for (const route of Object.keys(seo)) {
  if (!routes.includes(route)) problems.push(`${route}: SEO-запись для несуществующего маршрута`)
}

const attr = (html, pattern) => html.match(pattern)?.[1] ?? null
for (const route of routes) {
  const file = join(DIST, route === '/' ? 'index.html' : route.slice(1))
  if (!existsSync(file)) {
    problems.push(`${route}: нет ${file}`)
    continue
  }
  const html = readFileSync(file, 'utf8')
  const title = attr(html, /<title>([^<]*)<\/title>/)
  const description = attr(html, /<meta name="description" content="([^"]*)"/)
  if (!title) problems.push(`${route}: нет <title>`)
  else if (/figcraft/i.test(title)) problems.push(`${route}: шаблонный title «${title}»`)
  if (!description) problems.push(`${route}: нет meta description`)
  else if (description.length < 50 || description.length > 200) problems.push(`${route}: description ${description.length} символов (нужно 50–200)`)
  for (const [label, pattern] of [
    ['og:title', /<meta property="og:title" content="([^"]+)"/],
    ['og:description', /<meta property="og:description" content="([^"]+)"/],
    ['og:site_name', /<meta property="og:site_name" content="([^"]+)"/],
    ['og:locale', /<meta property="og:locale" content="([^"]+)"/],
    ['twitter:card', /<meta name="twitter:card" content="([^"]+)"/],
  ]) {
    if (!attr(html, pattern)) problems.push(`${route}: нет ${label}`)
  }
  if (!/^<!doctype html>/i.test(html) || !/<html lang="ru">/.test(html)) problems.push(`${route}: нет doctype/lang=ru`)
}

if (problems.length) {
  console.error(`meta: FAIL — ${problems.length} проблем(ы)`)
  for (const problem of problems.slice(0, 20)) console.error(`  - ${problem}`)
  process.exit(1)
}
const lengths = routes.map((route) => seo[route].description.length)
console.log(`meta: PASS — ${routes.length} маршрутов, title/description/OG, description ${Math.min(...lengths)}–${Math.max(...lengths)} символов`)
