#!/usr/bin/env node
/**
 * Гейты сайта по методике конвейера m2 (golden + contract), против эталона m2.
 *
 * Отличия от m2-скриптов — только источники путей: здесь нет export-pack/`project`;
 * эталон берётся из `M2_REFERENCE` (immutable artifacts/reference/<figSha>), а сверяется
 * **опубликованная сборка** этого репозитория (`--dir`, по умолчанию корень репозитория).
 * Логика измерения и сравнения — копия ядра конвейера (`lib/golden-core.mjs`,
 * `lib/contract-core.mjs`), поэтому числа сопоставимы с приёмкой 10/10.
 *
 * Usage:
 *   M2_REFERENCE=/abs/path/artifacts/reference/179a800f9fbf \
 *     node scripts/gates/run.mjs [--only golden|contract|fixtures|a11y|all] [--route /practice.html]
 *        [--jobs 4] [--changed] [--dir .] [--json gates.json]
 *
 *  --jobs N     параллельные воркеры по маршрутам (по умолчанию 4)
 *  --changed    только маршруты, затронутые правками в site/src/generated|interactive (git diff)
 *  --routes a,b только перечисленные маршруты (быстро проверить 2–3 затронутые страницы)
 *  --fast       не писать build-PNG на диск и сократить паузу ожидания (для итераций, ~30–40% быстрее)
 *
 * fixtures прогоняются отдельным процессом (scripts/gates/fixtures.mjs): им нужен QA-билд
 * site/dist/fixtures.html, а golden/contract меряют опубликованную сборку.
 *
 * Exit: 0 PASS, 1 FAIL (регрессии), 2 ERROR (нет эталона/страниц/данных).
 */
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { captureGolden, goldenLine, STAGE_THRESHOLDS } from './lib/golden-core.mjs'
import { loadContractContext, measureContractRoute, contractSummary } from './lib/contract-core.mjs'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const REPO = resolve(SITE, '..')
const args = process.argv.slice(2)
const argOf = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const ONLY_LIST = (argOf('only', 'all') || 'all').split(',').map((x) => x.trim()).filter(Boolean)
const ONLY = ONLY_LIST.length === 1 ? ONLY_LIST[0] : 'list'
const ONLY_ROUTE = argOf('route')
const OUT_DIR = resolve(argOf('dir', REPO))
const JSON_OUT = argOf('json')
const REFERENCE = process.env.M2_REFERENCE || argOf('reference')
const STAGE = argOf('stage', 'final')
const JOBS = Math.max(1, Number(argOf('jobs', String(Math.min(4, Number(process.env.GATE_JOBS || 4))))))
const CHANGED = args.includes('--changed')
const ROUTES_ARG = argOf('routes', null)
const FAST = args.includes('--fast')

const fail = (message) => { console.error(`gates: ERROR — ${message}`); process.exit(2) }
if (!REFERENCE || !existsSync(REFERENCE)) fail('задай M2_REFERENCE=/abs/path/artifacts/reference/<figSha>')
const goldenManifest = join(REFERENCE, 'golden/figma/manifest.json')
if (!existsSync(goldenManifest)) fail(`нет ${goldenManifest}`)
const want = (name) => ONLY === 'all' || ONLY_LIST.includes(name)
const useFixtures = want('fixtures')
const useA11y = want('a11y')
const useGolden = want('golden')
const useContract = want('contract')
if ((useGolden || useContract) && !existsSync(join(OUT_DIR, 'index.html'))) fail(`нет ${join(OUT_DIR, 'index.html')} — сначала npm run deploy`)
if (!STAGE_THRESHOLDS[STAGE]) fail(`неизвестный stage: ${STAGE}`)

let allRoutes = JSON.parse(readFileSync(join(SITE, 'data/routes.json'), 'utf8')).routes
if (CHANGED) {
  const { execSync } = await import('node:child_process')
  let changedFiles = ''
  try {
    changedFiles = execSync('git status --porcelain --untracked-files=all', { cwd: REPO, encoding: 'utf8' })
  } catch { changedFiles = '' }
  const files = changedFiles.split('\n').map((l) => l.slice(3).trim()).filter(Boolean)
  const genFiles = files.filter((f) => /^site\/(src\/generated|src\/interactive)\//.test(f))
  const slugOf = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\.html$/, '').replace(/\//g, '-'))
  const dirToRoute = new Map(allRoutes.map((r) => [slugOf(r.route), r.route]))
  const changedRoutes = new Set()
  let shared = false
  for (const f of genFiles) {
    const m = f.match(/^site\/src\/generated\/pages\/([^/]+)\//)
    if (m && dirToRoute.has(m[1])) { changedRoutes.add(dirToRoute.get(m[1])); continue }
    shared = true // sections/interactive/theme — меняют все страницы
  }
  if (shared) allRoutes = allRoutes
  else if (changedRoutes.size) allRoutes = allRoutes.filter((r) => changedRoutes.has(r.route))
  else { console.log('gates: --changed — правок в site/src/generated|interactive нет, проверять нечего'); process.exit(0) }
  console.log(`gates: --changed — маршрутов к проверке: ${allRoutes.length}${shared ? ' (общие секции затронуты — все)' : ''}`)
}
const ONLY_ROUTES = ROUTES_ARG ? ROUTES_ARG.split(',').map((x) => x.trim()).filter(Boolean) : null
const routeEntries = allRoutes.filter((r) => (!ONLY_ROUTE || r.route === ONLY_ROUTE) && (!ONLY_ROUTES || ONLY_ROUTES.includes(r.route)))
const manifest = JSON.parse(readFileSync(goldenManifest, 'utf8'))
const byRoute = new Map((manifest.entries || []).filter((e) => e.kind === 'route').map((e) => [e.route, e]))

// --- G-контекст для contract-core (тот же набор полей, что в конвейере)
const G = {
  SNAPSHOT: REFERENCE,
  SNAPSHOT_NAME: REFERENCE.split('/').pop(),
  DOC: join(REFERENCE, 'doc.live.figcraft'),
  LIVE_NODES: join(REFERENCE, 'live-nodes.json'),
  GEN: join(SITE, 'src/generated'),
  CONFIG: join(SITE, 'data/gates'),
  ROUTES: routeEntries,
}

// --- статический сервер опубликованной сборки
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain',
}
const server = createServer(async (request, response) => {
  let p = decodeURIComponent(new URL(request.url || '/', 'http://x').pathname)
  if (p === '/') p = '/index.html'
  try {
    const file = join(OUT_DIR, p)
    if (!statSync(file).isFile()) throw new Error('not file')
    const data = readFileSync(file)
    response.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' })
    response.end(data)
  } catch {
    response.writeHead(404); response.end('not found')
  }
})
await new Promise((done) => server.listen(0, '127.0.0.1', done))
const BASE = `http://127.0.0.1:${server.address().port}/`

const buildDir = join(SITE, '.gates/build')
const diffDir = join(SITE, '.gates/diff')
const reportDir = join(SITE, '.gates/reports')
mkdirSync(buildDir, { recursive: true })
mkdirSync(reportDir, { recursive: true })

let context = null
if (useContract) {
  try { context = loadContractContext(G) } catch (error) { fail(`contract: ${error.message}`) }
}

const launch = async () => {
  try { return await chromium.launch() } catch { return await chromium.launch({ channel: 'chrome' }) }
}
const browser = await launch()
const results = { golden: [], contract: [], fixtures: null, startedAt: new Date().toISOString(), reference: REFERENCE, out: OUT_DIR }

// --- a11y: статическая проверка опубликованной сборки
if (useA11y) {
  const { spawnSync } = await import('node:child_process')
  const a11yReport = join(SITE, '.gates/reports/a11y.json')
  const run = spawnSync(process.execPath, [join(SITE, 'scripts/gates/a11y.mjs'), '--dir', OUT_DIR, '--json', a11yReport], { env: process.env, encoding: 'utf8', timeout: 900000 })
  if (run.stdout) process.stdout.write(run.stdout)
  if (run.stderr) process.stderr.write(run.stderr)
  try { results.a11y = JSON.parse(readFileSync(a11yReport, 'utf8')) } catch { results.a11y = { error: 'нет отчёта a11y' } }
  results.a11yOk = run.status === 0
}

// --- fixtures: отдельный QA-билд site/dist (см. scripts/gates/fixtures.mjs)
if (useFixtures) {
  const { spawnSync } = await import('node:child_process')
  const fixturesReport = join(SITE, '.gates/reports/fixtures.json')
  const run = spawnSync(process.execPath, [join(SITE, 'scripts/gates/fixtures.mjs'), '--stage', STAGE, '--json', fixturesReport], {
    env: process.env,
    encoding: 'utf8',
    timeout: 1800000,
  })
  if (run.stdout) process.stdout.write(run.stdout)
  if (run.stderr) process.stderr.write(run.stderr)
  try { results.fixtures = JSON.parse(readFileSync(fixturesReport, 'utf8')) } catch { results.fixtures = { error: 'нет отчёта fixtures' } }
  results.fixturesOk = run.status === 0
}

const routePool = async (items, worker) => {
  const queue = [...items]
  const runners = Array.from({ length: Math.min(JOBS, queue.length) }, async () => {
    while (queue.length) await worker(queue.shift())
  })
  await Promise.all(runners)
}

await routePool(useGolden || useContract ? routeEntries : [], async (route) => {
  const path = route.route
  const file = path === '/' ? 'index.html' : path.replace(/^\//, '')
  const pageErrors = []
  const contextBrowser = await browser.newContext({ viewport: { width: 1440, height: 2000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
  const page = await contextBrowser.newPage()
  page.on('pageerror', (e) => pageErrors.push(e.message.slice(0, 120)))
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text().slice(0, 120)) })
  await page.goto(BASE + file, { waitUntil: 'load', timeout: 120000 })
  await page.waitForTimeout(FAST ? 500 : 1600)

  if (useGolden) {
    const entry = byRoute.get(path)
    if (!entry) {
      results.golden.push({ route: path, error: 'нет гольдена в манифесте' })
      console.error(`golden: ERROR — нет гольдена для ${path}`)
    } else {
      const name = entry.out.replace(/^figma\//, '').replace(/@2x\.png$/, '').replace(/\//g, '-')
      try {
        const metrics = await captureGolden(page, {
          goldenPath: join(REFERENCE, 'golden', entry.out),
          route: path,
          name,
          width: 1440,
          scale: 2,
          stage: STAGE,
          errors: pageErrors,
          root: REPO,
          buildDir,
          diffDir,
          fast: FAST,
        })
        results.golden.push(metrics)
        console.log(goldenLine(metrics))
      } catch (error) {
        results.golden.push({ route: path, error: error.message.slice(0, 200) })
        console.error(`golden[${STAGE}] ${path}: ERROR ${error.message}`)
      }
    }
  }

  if (useContract && route.page) {
    try {
      await page.evaluate(() => document.fonts.ready)
      const row = await measureContractRoute(page, context, route, pageErrors)
      results.contract.push(row)
      console.log('contract ' + contractSummary(row, context.thresholds))
    } catch (error) {
      results.contract.push({ route: path, error: error.message.slice(0, 200) })
      console.error(`contract ${path}: ERROR ${error.message}`)
    }
  }
  await contextBrowser.close()
})
await browser.close()
server.close()

// --- вердикт (порядок как в routes.json)
const routeOrder = new Map(routeEntries.map((r, i) => [r.route, i]))
results.golden.sort((a, b) => (routeOrder.get(a.route) ?? 99) - (routeOrder.get(b.route) ?? 99))
results.contract.sort((a, b) => (routeOrder.get(a.route) ?? 99) - (routeOrder.get(b.route) ?? 99))
results.jobs = JOBS
let failed = false
if (useGolden) {
  const bad = results.golden.filter((r) => r.error || r.passed === false)
  console.log(`\ngolden[${STAGE}]: ${results.golden.length - bad.length}/${results.golden.length} PASS`)
  if (bad.length) { failed = true; for (const r of bad) console.error(`  - ${r.route}: ${r.error || `Δ>24 ${r.pixelOver24Pct}% mean ${r.meanAbs}`}`) }
}
if (useContract) {
  const bad = results.contract.filter((r) => r.error || r.pass === false)
  console.log(`contract: ${results.contract.length - bad.length}/${results.contract.length} PASS`)
  if (bad.length) { failed = true; for (const r of bad) console.error(`  - ${r.route}: ${r.error || `geo ${r.geometry?.ratio} typo ${r.typography?.ratio}`}`) }
}
if (useA11y) {
  const a = results.a11y || {}
  console.log(`a11y: ${(a.summary && (a.summary.pages - a.summary.failed)) || 0}/${(a.summary && a.summary.pages) || 0} PASS`)
  if (!results.a11yOk) { failed = true; console.error('  - a11y: есть нарушения (см. отчёт)') }
}
if (useFixtures) {
  const f = results.fixtures || {}
  const sum = f.summary || {}
  for (const kind of ['state', 'design-system']) {
    const row = sum[kind]
    if (row) console.log(`fixtures ${kind}: ${row.passed}/${row.total} PASS, mean ${row.mean}%`)
  }
  if (!results.fixturesOk) { failed = true; console.error('  - fixtures: есть непрошедшие fixtures') }
}
const reportFile = JSON_OUT ? resolve(JSON_OUT) : join(reportDir, `gates-${STAGE}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
mkdirSync(dirname(reportFile), { recursive: true })
writeFileSync(reportFile, JSON.stringify(results, null, 2))
console.log(`gates: отчёт → ${reportFile}`)
if (failed) process.exit(1)
console.log('gates: PASS')
