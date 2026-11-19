#!/usr/bin/env node
/**
 * probe — быстрая проверка ОДНОГО элемента/области против golden, без полного прогона ворот.
 * Скриншот только нужного региона (клип), сравнение с соответствующим кропом эталона,
 * при провале/по запросу — side-by-side PNG для глаза.
 *
 * Usage:
 *   M2_REFERENCE=/abs/.../reference/179a800f9fbf node scripts/gates/probe.mjs \
 *     --route / --node 964 [--node 2708,2793] [--pad 6] [--url http://127.0.0.1:5173] \
 *     [--out .gates/probe] [--json out.json] [--threshold 2]
 *
 * Без --node сравнивает область --box x,y,w,h (CSS px) на странице --route.
 * --url нужен для дев-сервера; по умолчанию поднимается локальный сервер опубликованной сборки.
 * Exit: 0 PASS, 1 FAIL.
 */
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'
import { PNG } from 'pngjs'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const REPO = resolve(SITE, '..')
const args = process.argv.slice(2)
const argOf = (name, fallback = null) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback }
const argAll = (name) => args.reduce((acc, a, i) => (a === `--${name}` ? acc.concat((args[i + 1] || '').split(',').map((s) => s.trim()).filter(Boolean)) : acc), [])
const ROUTE = argOf('route', '/')
const NODES = argAll('node')
const PAD = Number(argOf('pad', '4'))
const URL_ARG = argOf('url')
const OUT_DIR = resolve(SITE, argOf('out', '.gates/probe'))
const JSON_OUT = argOf('json')
const THRESHOLD = Number(argOf('threshold', '15'))
const BASELINE = argOf('baseline')
const BASELINE_TOL = Number(argOf('tolerance', '0.3'))
const REFERENCE = process.env.M2_REFERENCE || argOf('reference')
const STAGE = argOf('stage', 'final')
const fail = (m) => { console.error(`probe: ERROR — ${m}`); process.exit(2) }
if (!REFERENCE || !existsSync(REFERENCE)) fail('задай M2_REFERENCE=/abs/path/reference/<figSha>')
if (!NODES.length && !argOf('box')) fail('нужен --node <id[,id]> или --box x,y,w,h')
mkdirSync(OUT_DIR, { recursive: true })

const routes = JSON.parse(readFileSync(join(SITE, 'data/routes.json'), 'utf8')).routes
const routeEntry = routes.find((r) => r.route === ROUTE)
if (!routeEntry) fail(`маршрут ${ROUTE} нет в data/routes.json`)
const manifest = JSON.parse(readFileSync(join(REFERENCE, 'golden/figma/manifest.json'), 'utf8'))
const entry = (manifest.entries || []).find((e) => e.kind === 'route' && e.route === ROUTE)
if (!entry) fail(`нет golden для ${ROUTE}`)
const goldenPath = join(REFERENCE, 'golden', entry.out)

const idmap = JSON.parse(readFileSync(join(REFERENCE, 'props/id-map.json'), 'utf8')).nodes
const boxes = []
if (NODES.length) {
  for (const id of NODES) {
    const m = idmap[id]
    if (!m || !m.liveBox) fail(`узел ${id} не найден в id-map`)
    if (m.page !== routeEntry.page || m.frame !== routeEntry.frame) fail(`узел ${id} не из кадра ${ROUTE} (${m.page}/${m.frame})`)
    boxes.push({ id, ...m.liveBox })
  }
} else {
  const [x, y, w, h] = (argOf('box') || '').split(',').map(Number)
  boxes.push({ id: 'box', x, y, width: w, height: h })
}

// --- сервер опубликованной сборки (если не задан --url)
let server = null
let BASE = URL_ARG
if (!BASE) {
  const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain' }
  server = createServer((request, response) => {
    let p = decodeURIComponent(new URL(request.url || '/', 'http://x').pathname)
    if (p === '/') p = '/index.html'
    try {
      const file = join(REPO, p)
      if (!statSync(file).isFile()) throw new Error('not file')
      response.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' })
      response.end(readFileSync(file))
    } catch { response.writeHead(404); response.end('not found') }
  })
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  BASE = `http://127.0.0.1:${server.address().port}`
}

const t0 = Date.now()
const launch = async () => { try { return await chromium.launch() } catch { return await chromium.launch({ channel: 'chrome' }) } }
const browser = await launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
const page = await ctx.newPage()
const file = ROUTE === '/' ? 'index.html' : ROUTE.replace(/^\//, '')
const pageErrors = []
page.on('pageerror', (e) => pageErrors.push(e.message.slice(0, 120)))
await page.goto(`${BASE}/${file}`, { waitUntil: 'load', timeout: 120000 })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)
const golden = PNG.sync.read(readFileSync(goldenPath))
const results = []
for (const box of boxes) {
  const x = Math.max(0, Math.round((box.x - PAD) * 2))
  const y = Math.max(0, Math.round((box.y - PAD) * 2))
  const w = Math.min(golden.width - x, Math.round((box.width + PAD * 2) * 2))
  const h = Math.min(golden.height - y, Math.round((box.height + PAD * 2) * 2))
  // скроллим элемент в вьюпорт и снимаем клип
  await page.evaluate(({ id, y }) => {
    if (id !== 'box') {
      const el = document.querySelector(`[data-node="${id}"]`)
      if (el) { el.scrollIntoView({ block: 'center', behavior: 'instant' }); return }
    }
    window.scrollTo({ top: Math.max(0, y - 300), behavior: 'instant' })
  }, { id: box.id, y: box.y })
  await page.waitForTimeout(80)
  const rect = await page.evaluate((id) => {
    if (id === 'box') return null
    const el = document.querySelector(`[data-node="${id}"]`)
    if (!el) return 'missing'
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, w: r.width, h: r.height }
  }, box.id)
  if (rect === 'missing') { results.push({ id: box.id, error: 'нет элемента в DOM' }); continue }
  const clip = rect ? { x: Math.max(0, rect.x - PAD), y: Math.max(0, rect.y - PAD), width: box.width + PAD * 2, height: box.height + PAD * 2 } : { x: box.x - PAD, y: box.y - PAD, width: box.width + PAD * 2, height: box.height + PAD * 2 }
  const shot = await page.screenshot({ clip })
  const site = PNG.sync.read(shot)
  // сравнение (сайт может отличаться размером на 1px — ресайзим через sharp при необходимости)
  let siteRaw = site
  if (site.width !== w || site.height !== h) {
    const resized = await sharp(shot).resize({ width: w, height: h, fit: 'fill' }).png().toBuffer()
    siteRaw = PNG.sync.read(resized)
  }
  let over = 0, sum = 0, n = 0
  for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
    const i = (yy * siteRaw.width + xx) * 4
    const j = ((y + yy) * golden.width + (x + xx)) * 4
    const d = (Math.abs(siteRaw.data[i] - golden.data[j]) + Math.abs(siteRaw.data[i + 1] - golden.data[j + 1]) + Math.abs(siteRaw.data[i + 2] - golden.data[j + 2])) / 3
    sum += d; n++
    if (d > 24) over++
  }
  const pct = +(100 * over / n).toFixed(2)
  const mean = +(sum / n).toFixed(2)
  let baseline = null
  if (BASELINE && existsSync(BASELINE)) {
    try { baseline = (JSON.parse(readFileSync(BASELINE, 'utf8')).results || []).find((r) => r.id === box.id) || null } catch {}
  }
  // PASS: либо в пределах абсолютного порога, либо (в режиме baseline) не хуже него
  const pass = baseline
    ? (pct <= baseline.pixelOver24Pct + BASELINE_TOL && mean <= baseline.meanAbs + BASELINE_TOL)
    : pct <= THRESHOLD
  const cmpFile = join(OUT_DIR, `probe-${box.id}.png`)
  const cropGolden = await sharp(goldenPath).extract({ left: x, top: y, width: w, height: h }).png().toBuffer()
  const cropSite = await sharp(shot).resize({ width: w, height: h, fit: 'fill' }).png().toBuffer()
  const divider = await sharp({ create: { width: w, height: 4, channels: 4, background: { r: 255, g: 0, b: 255, alpha: 1 } } }).png().toBuffer()
  await sharp({ create: { width: w, height: h * 2 + 4, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
    .composite([{ input: cropGolden, top: 0, left: 0 }, { input: divider, top: h, left: 0 }, { input: cropSite, top: h + 4, left: 0 }])
    .png().toFile(cmpFile)
  const delta = baseline ? { dPct: +(pct - baseline.pixelOver24Pct).toFixed(2), dMean: +(mean - baseline.meanAbs).toFixed(2) } : null
  results.push({ id: box.id, route: ROUTE, pass, pixelOver24Pct: pct, meanAbs: mean, baseline, delta, box: { x: box.x, y: box.y, w: box.width, h: box.height }, screenshot: cmpFile })
}
await browser.close()
if (server) server.close()
const failed = results.filter((r) => !r.pass)
const line = (r) => r.error
  ? `probe ${ROUTE} node ${r.id}: ERROR — ${r.error}`
  : `probe ${ROUTE} node ${r.id}: ${r.pass ? 'PASS' : 'FAIL'} Δ>24 ${r.pixelOver24Pct}% mean ${r.meanAbs}/255${r.delta ? ` (Δ vs baseline: ${r.delta.dPct > 0 ? '+' : ''}${r.delta.dPct}% / ${r.delta.dMean > 0 ? '+' : ''}${r.delta.dMean})` : ''} → ${r.screenshot.replace(SITE + '/', '')}`
for (const r of results) console.log(line(r))
console.log(`probe: ${results.length - failed.length}/${results.length} PASS за ${((Date.now() - t0) / 1000).toFixed(1)}s${pageErrors.length ? ` | pageerrors: ${pageErrors.length}` : ''}`)
if (BASELINE) writeFileSync(resolve(BASELINE), JSON.stringify({ route: ROUTE, checkedAt: new Date().toISOString(), reference: REFERENCE, results }, null, 2))
if (JSON_OUT) writeFileSync(resolve(JSON_OUT), JSON.stringify({ route: ROUTE, checkedAt: new Date().toISOString(), reference: REFERENCE, results }, null, 2))
process.exit(failed.length ? 1 : 0)
