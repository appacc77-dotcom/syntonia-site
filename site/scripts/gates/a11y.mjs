#!/usr/bin/env node
/**
 * A11y-ворота (без внешних зависимостей): проверяют опубликованную сборку на типовые дефекты,
 * которые не ловят пиксельные гейты:
 *   • aria-hidden на контейнерах с фокусируемыми потомками/текстом;
 *   • вложенную интерактивность (a/button/input внутри role=radio|button|link и т.п.);
 *   • img без alt;
 *   • кнопки без доступного имени, input без label/aria-label;
 *   • ровно один h1 и корректный порядок уровней заголовков;
 *   • <html lang>, <main>, skip-link.
 *
 * Usage: node scripts/gates/a11y.mjs [--dir .] [--json report.json]
 */
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const REPO = resolve(SITE, '..')
const args = process.argv.slice(2)
const argOf = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const OUT_DIR = resolve(argOf('dir', REPO))
const JSON_OUT = argOf('json')
const routes = JSON.parse(readFileSync(join(SITE, 'data/routes.json'), 'utf8')).routes
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' }
const server = createServer((request, response) => {
  let p = decodeURIComponent(new URL(request.url || '/', 'http://x').pathname)
  if (p === '/') p = '/index.html'
  try {
    const file = join(OUT_DIR, p)
    const data = readFileSync(file)
    response.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' })
    response.end(data)
  } catch { response.writeHead(404); response.end('not found') }
})
await new Promise((done) => server.listen(0, '127.0.0.1', done))
const BASE = `http://127.0.0.1:${server.address().port}/`
const launch = async () => { try { return await chromium.launch() } catch { return await chromium.launch({ channel: 'chrome' }) } }
const browser = await launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const results = []
for (const route of routes) {
  const file = route.route === '/' ? 'index.html' : route.route.replace(/^\//, '')
  const errors = []
  if (!existsSync(join(OUT_DIR, file))) { results.push({ route: route.route, error: 'нет страницы' }); continue }
  await page.goto(BASE + file, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(600)
  const found = await page.evaluate(() => {
    const violations = []
    const focusable = 'a[href],button,input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])'
    for (const el of document.querySelectorAll('[aria-hidden="true"]')) {
      const kids = el.querySelectorAll(focusable)
      if (kids.length) violations.push({ rule: 'aria-hidden-focus', detail: `${kids.length} focusable внутри ${el.tagName.toLowerCase()}[data-node="${el.getAttribute('data-node') || ''}"]` })
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
      // текст-дубликат, помеченный разработчиком (visible placeholder при aria-label у поля) — ок
      if (text.length > 40 && !el.matches('[data-a11y-dup], [data-a11y-dup] *')) violations.push({ rule: 'aria-hidden-text', detail: `текст внутри aria-hidden: «${text.slice(0, 40)}…»` })
    }
    const roleInteractive = '[role="radio"],[role="button"],[role="link"],[role="checkbox"],[role="switch"],[role="tab"],[role="option"],[role="menuitem"]'
    for (const el of document.querySelectorAll(roleInteractive)) {
      const inner = el.querySelectorAll(focusable)
      if (inner.length) violations.push({ rule: 'nested-interactive', detail: `role=${el.getAttribute('role')}, вложено ${inner.length}` })
    }
    for (const el of document.querySelectorAll('a[href],button')) {
      if (el.querySelector('a[href],button')) violations.push({ rule: 'nested-interactive', detail: `<${el.tagName.toLowerCase()}> содержит интерактивный элемент` })
    }
    for (const img of document.querySelectorAll('img:not([alt])')) violations.push({ rule: 'img-alt', detail: img.getAttribute('src') || '' })
    for (const button of document.querySelectorAll('button')) {
      const name = (button.getAttribute('aria-label') || button.textContent || '').trim()
      if (!name) violations.push({ rule: 'button-name', detail: 'кнопка без доступного имени' })
    }
    for (const input of document.querySelectorAll('input:not([type=hidden]),textarea,select')) {
      const id = input.getAttribute('id')
      const hasLabel = (id && document.querySelector(`label[for="${id}"]`)) || input.getAttribute('aria-label') || input.getAttribute('aria-labelledby') || input.closest('label')
      if (!hasLabel) violations.push({ rule: 'input-label', detail: input.getAttribute('name') || input.getAttribute('type') || 'input' })
    }
    const h1 = document.querySelectorAll('h1')
    if (h1.length !== 1) violations.push({ rule: 'h1-count', detail: `h1=${h1.length}` })
    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]))
    let prev = levels[0] || 1
    for (const level of levels) {
      if (level > prev + 1) { violations.push({ rule: 'heading-order', detail: `h${prev} → h${level}` }); break }
      prev = level
    }
    if (!document.documentElement.getAttribute('lang')) violations.push({ rule: 'html-lang', detail: '' })
    if (!document.querySelector('main')) violations.push({ rule: 'main-landmark', detail: '' })
    if (!document.querySelector('a.skip-link')) violations.push({ rule: 'skip-link', detail: '' })
    return { violations, counts: { focusable: document.querySelectorAll(focusable).length, inputs: document.querySelectorAll('input:not([type=hidden]),textarea,select').length } }
  })
  results.push({ route: route.route, ...found, errors })
}
await browser.close()
server.close()
const bad = results.filter((r) => r.error || (r.violations && r.violations.length))
const agg = {}
for (const r of results) for (const v of r.violations || []) agg[v.rule] = (agg[v.rule] || 0) + 1
for (const r of results) {
  if (r.error) console.error(`a11y FAIL ${r.route}: ${r.error}`)
  else if (r.violations.length) for (const v of r.violations) console.error(`a11y FAIL ${r.route}: ${v.rule} — ${v.detail}`)
}
const report = { generatedAt: new Date().toISOString(), out: OUT_DIR, summary: { pages: results.length, failed: bad.length, rules: agg }, results }
const outFile = JSON_OUT ? resolve(JSON_OUT) : join(SITE, '.gates/reports/a11y.json')
mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, `${JSON.stringify(report, null, 1)}\n`)
console.log(`a11y: ${results.length - bad.length}/${results.length} PASS; нарушений ${Object.values(agg).reduce((a, b) => a + b, 0)} (${Object.entries(agg).map(([k, v]) => `${k}:${v}`).join(', ') || 'нет'}) → ${outFile}`)
process.exit(bad.length ? 1 : 0)
