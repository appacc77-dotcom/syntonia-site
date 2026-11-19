#!/usr/bin/env node
/**
 * Live-приёмка против эталона m2: качает опубликованные страницы GitHub Pages и меряет их
 * тем же ядром, что golden-ворота (lib/golden-core.mjs), чтобы числа были сопоставимы с приёмкой.
 *
 * Usage:
 *   M2_REFERENCE=/abs/artifacts/reference/<figSha> node scripts/gates/live.mjs \
 *     [--url https://appacc77-dotcom.github.io/syntonia-site] [--route /practice.html] [--json out.json]
 *
 * Exit: 0 — все маршруты 200, пиксельные метрики в порогах, без ошибок страницы; 1 — иначе.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { captureGolden, goldenLine, STAGE_THRESHOLDS } from './lib/golden-core.mjs'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const REPO = resolve(SITE, '..')
const args = process.argv.slice(2)
const argOf = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const LIVE = (argOf('url', process.env.LIVE_URL) || 'https://appacc77-dotcom.github.io/syntonia-site').replace(/\/$/, '')
const ONLY_ROUTE = argOf('route')
const JSON_OUT = argOf('json')
const REFERENCE = process.env.M2_REFERENCE || argOf('reference')
const STAGE = argOf('stage', 'final')
if (!REFERENCE || !existsSync(REFERENCE)) {
  console.error('live: ERROR — задай M2_REFERENCE=/abs/path/artifacts/reference/<figSha>')
  process.exit(2)
}
if (!STAGE_THRESHOLDS[STAGE]) { console.error(`live: ERROR — неизвестный stage ${STAGE}`); process.exit(2) }
const routes = JSON.parse(readFileSync(join(SITE, 'data/routes.json'), 'utf8')).routes
  .filter((r) => !ONLY_ROUTE || r.route === ONLY_ROUTE)
const manifest = JSON.parse(readFileSync(join(REFERENCE, 'golden/figma/manifest.json'), 'utf8'))
const byRoute = new Map((manifest.entries || []).filter((e) => e.kind === 'route').map((e) => [e.route, e]))
const buildDir = join(SITE, '.gates/live-build')
const diffDir = join(SITE, '.gates/live-diff')
mkdirSync(buildDir, { recursive: true })
mkdirSync(diffDir, { recursive: true })

const launch = async () => {
  try { return await chromium.launch() } catch { return await chromium.launch({ channel: 'chrome' }) }
}
const browser = await launch()
const results = { url: LIVE, checkedAt: new Date().toISOString(), reference: REFERENCE, routes: [] }
for (const route of routes) {
  const path = route.route === '/' ? '/' : route.route
  const errors = []
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 2000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)) })
  const row = { route: path, errors }
  try {
    const response = await page.goto(LIVE + (path === '/' ? '/' : '/' + path.replace(/^\//, '')), { waitUntil: 'load', timeout: 120000 })
    row.status = response ? response.status() : 0
    await page.waitForTimeout(1600)
    const entry = byRoute.get(path)
    if (entry) {
      const name = entry.out.replace(/^figma\//, '').replace(/@2x\.png$/, '').replace(/\//g, '-')
      const metrics = await captureGolden(page, {
        goldenPath: join(REFERENCE, 'golden', entry.out),
        route: path,
        name,
        width: 1440,
        scale: 2,
        stage: STAGE,
        errors,
        root: REPO,
        buildDir,
        diffDir,
      })
      row.metrics = metrics
      console.log('live ' + goldenLine(metrics))
    } else {
      console.log(`live ${path}: нет гольдена — проверяю только статус/ошибки`)
    }
  } catch (error) {
    row.fatal = String(error).slice(0, 200)
    console.error(`live ${path}: ERROR ${row.fatal}`)
  }
  results.routes.push(row)
  await ctx.close()
}
await browser.close()

const bad = results.routes.filter((r) => r.fatal || r.status !== 200 || (r.metrics && r.metrics.passed === false))
const withErrors = results.routes.filter((r) => r.errors && r.errors.length)
const out = JSON_OUT ? resolve(JSON_OUT) : join(SITE, '.gates/reports/live.json')
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `${JSON.stringify(results, null, 1)}\n`)
console.log(`\nlive: ${results.routes.length - bad.length}/${results.routes.length} PASS по статусу/пикселям; ошибок страницы: ${withErrors.length}`)
for (const r of bad) console.error(`  - ${r.route}: ${r.fatal || `status ${r.status}`}${r.metrics && r.metrics.passed === false ? ` Δ>24 ${r.metrics.pixelOver24Pct}% mean ${r.metrics.meanAbs}` : ''}`)
for (const r of withErrors) console.error(`  - ${r.route}: ошибки: ${r.errors.slice(0, 2).join(' | ')}`)
console.log(`live: отчёт → ${out}`)
if (bad.length || withErrors.length) process.exit(1)
console.log('live: PASS')
