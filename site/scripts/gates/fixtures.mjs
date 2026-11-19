#!/usr/bin/env node
/**
 * Fixtures-ворота (методика m2): 116 изолированных fixtures (54 состояния + 62 DS-компонента)
 * из `/fixtures.html` скриншотятся при 1x и сверяются с golden PNG из M2_REFERENCE.
 *
 * Источники:
 *   M2_REFERENCE=/abs/artifacts/reference/<figSha>   — goldens + манифест;
 *   src/generated/meta-fixtures.json                — какие компоненты и какие goldens;
 *   dist/ (site/dist)                               — QA-сборка (npm run build);
 *   assets для fixtures                             — из dist/assets эталонной сборки конвейера
 *                                                     (env M2_FIXTURE_ASSETS, по умолчанию
 *                                                     <reference>/../../site/dist/assets).
 *
 * Пороги: site/data/gates/fixtures-thresholds.json (state 4 %/6, design-system 6 %/8).
 *
 * Usage: node scripts/gates/fixtures.mjs [--stage=final] [--filter=state|design-system]
 *        [--json report.json]
 */
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const REPO = resolve(SITE, '..')
const args = process.argv.slice(2)
const argOf = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const STAGE = argOf('stage', 'final')
const FILTER = argOf('filter', '')
const JSON_OUT = argOf('json')
const REFERENCE = process.env.M2_REFERENCE || argOf('reference')
if (!REFERENCE || !existsSync(REFERENCE)) {
  console.error('fixtures: ERROR — задай M2_REFERENCE=/abs/path/artifacts/reference/<figSha>')
  process.exit(2)
}
const DIST = join(SITE, 'dist')
if (!existsSync(join(DIST, 'fixtures.html'))) {
  console.error('fixtures: ERROR — нет dist/fixtures.html, сначала npm run build')
  process.exit(2)
}
const META = JSON.parse(readFileSync(join(SITE, 'src/generated/meta-fixtures.json'), 'utf8')).fixtures
const thresholdsPath = join(SITE, 'data/gates/fixtures-thresholds.json')
const thresholds = existsSync(thresholdsPath)
  ? JSON.parse(readFileSync(thresholdsPath, 'utf8'))
  : { state: { over24: 4, mean: 6 }, 'design-system': { over24: 6, mean: 8 } }

// assets: fixtures ссылаются на «сырые» имена Figma (/assets/img-….png) — берём их из
// собранного dist конвейера (эталонная сборка содержит public/assets как есть).
const candidates = [
  process.env.M2_FIXTURE_ASSETS,
  resolve(REFERENCE, '../../../site/dist/assets'),
  resolve(REFERENCE, '../../site/dist/assets'),
].filter(Boolean)
const ASSETS_DIR = candidates.find((p) => existsSync(join(p, 'img-8abb88a1df.png'))) || candidates[0]
if (!ASSETS_DIR || !existsSync(ASSETS_DIR)) {
  console.error(`fixtures: ERROR — не найдены assets fixtures (пробовал: ${candidates.join(', ')})`)
  process.exit(2)
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp' }
const { readFileSync: rf, readdirSync } = await import('node:fs')
const server = createServer(async (request, response) => {
  let p = decodeURIComponent(new URL(request.url || '/', 'http://x').pathname)
  if (p === '/') p = '/index.html'
  let file = join(DIST, p)
  if (p.startsWith('/assets/') && !existsSync(file)) file = join(ASSETS_DIR, p.replace(/^\/assets\//, ''))
  try {
    const data = rf(file)
    response.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' })
    response.end(data)
  } catch {
    response.writeHead(404); response.end('not found')
  }
})
await new Promise((done) => server.listen(0, '127.0.0.1', done))
const BASE = `http://127.0.0.1:${server.address().port}/`

const DIFF_DIR = join(SITE, '.gates/fixtures-diff')
const reportDir = join(SITE, '.gates/reports')
mkdirSync(reportDir, { recursive: true })
if (STAGE === 'final') mkdirSync(DIFF_DIR, { recursive: true })

const launch = async () => {
  try { return await chromium.launch() } catch { return await chromium.launch({ channel: 'chrome' }) }
}
const browser = await launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const pageErrors = []
page.on('pageerror', (error) => pageErrors.push(String(error).slice(0, 200)))
await page.goto(`${BASE}fixtures.html`, { waitUntil: 'networkidle', timeout: 180000 })
await page.evaluate(() => document.fonts.ready)
await page.addStyleTag({ content: 'html, body { background: transparent !important; }' })
// дождаться, пока все fixtures отрендерятся
await page.waitForFunction(() => document.querySelectorAll('[data-fixture]').length >= 100, { timeout: 180000 })

const flatten = (png) => {
  const out = new PNG({ width: png.width, height: png.height })
  for (let i = 0; i < png.data.length; i += 4) {
    const alpha = png.data[i + 3] / 255
    out.data[i] = Math.round(png.data[i] * alpha + 255 * (1 - alpha))
    out.data[i + 1] = Math.round(png.data[i + 1] * alpha + 255 * (1 - alpha))
    out.data[i + 2] = Math.round(png.data[i + 2] * alpha + 255 * (1 - alpha))
    out.data[i + 3] = 255
  }
  return out
}

const results = []
for (const fixture of META) {
  if (FILTER && fixture.kind !== FILTER) continue
  const row = { component: fixture.component, kind: fixture.kind, page: fixture.page, name: fixture.name, golden: fixture.golden }
  const goldenPath = join(REFERENCE, 'golden', fixture.golden)
  if (!existsSync(goldenPath)) { row.error = 'нет гольдена'; results.push(row); continue }
  const locator = page.locator(`[data-fixture="${fixture.component}"]`)
  let shot
  try {
    shot = flatten(PNG.sync.read(await locator.screenshot({ animations: 'disabled', omitBackground: true })))
  } catch (error) { row.error = String(error).slice(0, 160); results.push(row); continue }
  const golden = flatten(PNG.sync.read(readFileSync(goldenPath)))
  row.buildSize = { width: shot.width, height: shot.height }
  row.goldenSize = { width: golden.width, height: golden.height }
  if (shot.width !== golden.width || shot.height !== golden.height) row.sizeMismatch = true
  const width = Math.min(shot.width, golden.width)
  const height = Math.min(shot.height, golden.height)
  const a = new PNG({ width, height })
  const b = new PNG({ width, height })
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const from = (y * shot.width + x) * 4
      const to = (y * width + x) * 4
      shot.data.copy(a.data, to, from, from + 4)
      const gfrom = (y * golden.width + x) * 4
      golden.data.copy(b.data, to, gfrom, gfrom + 4)
    }
  }
  const diff = new PNG({ width, height })
  const diffPixels = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 })
  let sum = 0
  let over24 = 0
  for (let i = 0; i < a.data.length; i += 4) {
    const delta = Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2]))
    sum += delta
    if (delta > 24) over24 += 1
  }
  const total = width * height
  row.over24 = Math.round((over24 / total) * 10000) / 100
  row.pixelmatch = Math.round((diffPixels / total) * 10000) / 100
  row.mean = Math.round((sum / total) * 100) / 100
  const limits = thresholds[fixture.kind] || thresholds.state
  row.limits = limits
  row.pass = !row.sizeMismatch && row.over24 <= limits.over24 && row.mean <= limits.mean
  if (!row.pass && STAGE === 'final') {
    try { writeFileSync(join(DIFF_DIR, `${fixture.component}.png`), PNG.sync.write(diff)) } catch { /* ignore */ }
  }
  results.push(row)
  if (!row.pass) console.log(`FAIL ${fixture.kind.padEnd(13)} ${String(fixture.name).padEnd(26)} over24 ${row.over24}% mean ${row.mean}${row.sizeMismatch ? ` SIZE ${shot.width}x${shot.height} vs ${golden.width}x${golden.height}` : ''}`)
}
await browser.close()
server.close()

const summary = {}
for (const kind of ['state', 'design-system']) {
  const rows = results.filter((row) => row.kind === kind)
  const passed = rows.filter((row) => row.pass).length
  const measured = rows.filter((row) => row.mean !== undefined)
  const mean = measured.reduce((acc, row) => acc + row.mean, 0) / Math.max(1, measured.length)
  const worst = [...measured].sort((a, b) => b.over24 - a.over24).slice(0, 8)
  summary[kind] = { total: rows.length, passed, mean: Math.round(mean * 100) / 100, worst: worst.map((row) => ({ name: row.name, over24: row.over24, mean: row.mean })) }
  console.log(`${kind}: ${passed}/${rows.length} PASS, mean ${summary[kind].mean}%, worst ${worst.map((row) => `${row.name} ${row.over24}%`).join(', ')}`)
}
const report = { stage: STAGE, snapshot: REFERENCE.split('/').pop(), generatedAt: new Date().toISOString(), thresholds, assets: ASSETS_DIR, summary, results }
const outFile = JSON_OUT ? resolve(JSON_OUT) : join(reportDir, 'fixtures.json')
mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, `${JSON.stringify(report, null, 1)}\n`)
const allPass = results.every((row) => row.pass)
console.log(`fixtures: ${results.filter((row) => row.pass).length}/${results.length} PASS (${STAGE}) → ${outFile}${pageErrors.length ? `, ${pageErrors.length} ошибок страницы` : ''}`)
process.exit(STAGE === 'final' && !allPass ? 1 : 0)
