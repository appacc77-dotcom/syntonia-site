#!/usr/bin/env node
/**
 * verify-golden — пиксельная сверка собранного сайта с эталоном m2 (golden reference).
 *
 * Эталон: `artifacts/reference/<figSha>/golden` конвейера studio-pipeline-v2:
 *   • `figma/<page>@2x.png` — рендер Figma-фрейма маршрута (54 state + 62 DS сняты в 1x);
 *   • `figma/manifest.json` — реестр гольденов (route / state / design-system, размеры).
 *
 * Методика (чтобы сравнение было честным):
 *   1. страница рендерится в Chromium при DSF=2 (как эталон), full page;
 *   2. и наш рендер, и гольден приводятся к одной ширине 1440 одним и тем же
 *      ресайзером (sharp/lanczos) — иначе разница ресэмплинга шумит на весь кадр;
 *   3. считаем Δвысоту, diff % (порог по каналу 60/765), среднюю дельту и худшие
 *      блоки 160×160 — они указывают, где именно «поехала» вёрстка/иконка/шрифт.
 *
 * Usage:
 *   M2_GOLDEN=/abs/path/to/golden node scripts/verify-golden.mjs [--url http://127.0.0.1:4321/]
 *        [--only page1,page2] [--json out.json] [--update]
 *
 * Exit: 0 PASS (все маршруты в бюджете), 1 FAIL (регрессии), 2 ERROR (нет эталона/сборки).
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { PNG } from 'pngjs'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const argOf = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const URL_BASE = argOf('url', 'http://127.0.0.1:4321/')
const GOLDEN = process.env.M2_GOLDEN || argOf('golden')
const ONLY = argOf('only')
const JSON_OUT = argOf('json')
const UPDATE = args.includes('--update')

if (!GOLDEN || !existsSync(GOLDEN)) {
  console.error('golden: ERROR — нет эталона. Задай M2_GOLDEN=/abs/path/to/.../golden')
  process.exit(2)
}
const manifestFile = join(GOLDEN, 'figma/manifest.json')
if (!existsSync(manifestFile)) {
  console.error(`golden: ERROR — нет ${manifestFile}`)
  process.exit(2)
}
const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'))
const routes = JSON.parse(readFileSync(join(SITE, 'data/routes.json'), 'utf8')).routes.map((r) => r.route)
const pageOf = (route) => (route === '/' ? 'index.html' : route.replace(/^\//, ''))

// Бюджеты: геометрия должна совпадать точно; картинка — near-lossless WebP + ресэмплинг,
// поэтому допускаем небольшую среднюю дельту (калибровано на эталонной сборке v0.9.0).
const BUDGET = {
  heightDelta: 0,          // px
  diffPct: 1.6,            // % пикселей выше порога (калибровка: эталон ~0.9–1.5)
  meanDelta: 2.5,          // средняя |Δ| по каналам 0..255 (эталон ~1.1–2.4)
}
const THRESHOLD = 60
const BLOCK = 160

const routeEntries = manifest.entries.filter((e) => e.kind === 'route')
  .filter((e) => (ONLY ? ONLY.split(',').some((p) => e.route.includes(p)) : true))

const readPng = async (file, width = 1440) => {
  const buf = await sharp(file).resize({ width, fit: 'inside' }).png().toBuffer()
  return PNG.sync.read(buf)
}
const downscale = async (png, width = 1440) => {
  if (png.width === width) return png
  const buf = await sharp(PNG.sync.write(png)).resize({ width, fit: 'inside' }).png().toBuffer()
  return PNG.sync.read(buf)
}

const launchBrowser = async () => {
  try { return await chromium.launch() } catch (e) {
    // локальная машина: нет скачанного chromium Playwright — используем установленный Chrome
    return await chromium.launch({ channel: 'chrome' })
  }
}
const browser = await launchBrowser()
const rows = []
for (const entry of routeEntries) {
  const route = entry.route
  const file = pageOf(route)
  const goldenFile = join(GOLDEN, entry.out)
  if (!existsSync(goldenFile)) { rows.push({ route, error: `нет гольдена ${entry.out}` }); continue }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 120)) })
  const failed = []
  page.on('requestfailed', (r) => failed.push(r.url().slice(-60)))
  try {
    await page.goto(URL_BASE + file, { waitUntil: 'load', timeout: 90000 })
    await page.waitForTimeout(1800)
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    const shot = await downscale(PNG.sync.read(await page.screenshot({ fullPage: true })))
    const golden = await readPng(goldenFile)
    const W = Math.min(shot.width, golden.width)
    const H = Math.min(shot.height, golden.height)
    let over = 0
    let sum = 0
    const blocks = new Map()
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * shot.width + x) * 4
        const j = (y * golden.width + x) * 4
        const d = Math.abs(shot.data[i] - golden.data[j]) + Math.abs(shot.data[i + 1] - golden.data[j + 1]) + Math.abs(shot.data[i + 2] - golden.data[j + 2])
        sum += d / 3
        if (d > THRESHOLD) {
          over += 1
          const key = `${Math.floor(x / BLOCK) * BLOCK},${Math.floor(y / BLOCK) * BLOCK}`
          blocks.set(key, (blocks.get(key) || 0) + 1)
        }
      }
    }
    const px = W * H
    const worst = [...blocks.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, n]) => `${k}→${n}`)
    rows.push({
      route,
      heightDelta: shot.height - golden.height,
      diffPct: +(100 * over / px).toFixed(3),
      mean: +(sum / px).toFixed(2),
      worst,
      consoleErrors: consoleErrors.length,
      failedRequests: failed.length,
    })
  } catch (error) {
    rows.push({ route, error: error.message.slice(0, 120) })
  }
  await context.close()
}
await browser.close()

// --- отчёт
const pad = (s, n) => String(s).padEnd(n)
console.log(`${pad('route', 32)}${pad('Δh', 6)}${pad('diff%', 8)}${pad('mean', 7)}const  worst blocks`)
const failures = []
for (const r of rows) {
  if (r.error) { failures.push(`${r.route}: ${r.error}`); console.log(`${pad(r.route, 32)}ERROR  ${r.error}`); continue }
  const bad = Math.abs(r.heightDelta) > BUDGET.heightDelta || r.diffPct > BUDGET.diffPct || r.mean > BUDGET.meanDelta || r.consoleErrors > 0 || r.failedRequests > 0
  const flags = []
  if (Math.abs(r.heightDelta) > BUDGET.heightDelta) flags.push(`Δh=${r.heightDelta}`)
  if (r.diffPct > BUDGET.diffPct) flags.push(`diff=${r.diffPct}%`)
  if (r.mean > BUDGET.meanDelta) flags.push(`mean=${r.mean}`)
  if (r.consoleErrors) flags.push(`console=${r.consoleErrors}`)
  if (r.failedRequests) flags.push(`failed=${r.failedRequests}`)
  if (bad) failures.push(`${r.route}: ${flags.join(' ')}`)
  console.log(`${pad(r.route, 32)}${pad(r.heightDelta, 6)}${pad(r.diffPct, 8)}${pad(r.mean, 7)}${bad ? 'FAIL' : 'ok  '}  ${r.worst.join(' | ')}`)
}
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify({ budgets: BUDGET, rows }, null, 2))
if (failures.length) {
  console.error(`\ngolden: FAIL — ${failures.length}/${rows.length} маршрутов вне бюджета:`)
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`\ngolden: PASS — ${rows.length} маршрутов в бюджете (Δh ${BUDGET.heightDelta}, diff ≤ ${BUDGET.diffPct} %, mean ≤ ${BUDGET.meanDelta})`)
