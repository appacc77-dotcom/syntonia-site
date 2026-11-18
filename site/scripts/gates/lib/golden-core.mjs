/**
 * Ядро golden-ворот: скриншот страницы (уже загруженной) при width×scale,
 * склейка плит, pixelmatch против PNG эталона. Используется golden.mjs и browser-pass.mjs.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

export const STAGE_THRESHOLDS = {
  'home-1': { over24: 15, mean: 15 },
  'home-2': { over24: 5, mean: 8 },
  final: { over24: 2, mean: 5 },
  baseline: null,
}

/**
 * Снять и сравнить golden для уже открытой страницы.
 * @returns {Promise<object>} metrics (как в metrics/golden.json)
 */
export async function captureGolden(page, { goldenPath, route, name, width = 1440, scale = 2, stage = 'final', errors = [], root, buildDir, diffDir }) {
  const thresholds = STAGE_THRESHOLDS[stage]
  if (stage !== 'baseline' && !thresholds) throw new Error(`неизвестный stage: ${stage} (baseline|home-1|home-2|final)`)
  if (!existsSync(goldenPath)) throw new Error(`нет golden PNG: ${goldenPath}`)
  const reportOnly = stage === 'baseline'
  mkdirSync(buildDir, { recursive: true })
  mkdirSync(diffDir, { recursive: true })

  const VIEWPORT_CSS = 2000
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.setViewportSize({ width, height: VIEWPORT_CSS })
  const cssSize = await page.evaluate(() => {
    const root = document.getElementById('root')
    const rect = root ? root.getBoundingClientRect() : null
    return {
      width: document.documentElement.scrollWidth,
      height: Math.max(1, Math.ceil(rect ? rect.bottom + window.scrollY : document.documentElement.scrollHeight)),
    }
  })
  const buildPng = join(buildDir, `${name}@${scale}x.png`)
  mkdirSync(dirname(buildPng), { recursive: true })
  const maxScroll = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight))
  const tiles = []
  for (let y = 0; y < cssSize.height; y += VIEWPORT_CSS) {
    const target = Math.min(y, maxScroll)
    await page.evaluate((top) => window.scrollTo(0, top), target)
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))))
    const tile = PNG.sync.read(await page.screenshot())
    const offset = Math.round((y - target) * scale)
    const height = Math.min(Math.min(VIEWPORT_CSS, cssSize.height - y) * scale, tile.height - offset)
    const cropped = new PNG({ width: tile.width, height })
    for (let row = 0; row < height; row += 1) {
      const source = (offset + row) * tile.width * 4
      tile.data.copy(cropped.data, row * tile.width * 4, source, source + tile.width * 4)
    }
    tiles.push(cropped)
  }
  const stitched = new PNG({ width: width * scale, height: tiles.reduce((sum, tile) => sum + tile.height, 0) })
  let offset = 0
  for (const tile of tiles) {
    for (let row = 0; row < tile.height; row += 1) {
      tile.data.copy(stitched.data, (offset + row) * stitched.width * 4, row * tile.width * 4, (row + 1) * tile.width * 4)
    }
    offset += tile.height
  }
  writeFileSync(buildPng, PNG.sync.write(stitched))

  const golden = PNG.sync.read(readFileSync(goldenPath))
  const build = PNG.sync.read(readFileSync(buildPng))
  const compareWidth = Math.min(golden.width, build.width)
  const compareHeight = Math.min(golden.height, build.height)
  if (compareWidth < 10 || compareHeight < 10) throw new Error(`несовместимые размеры: golden ${golden.width}x${golden.height}, build ${build.width}x${build.height}`)
  const crop = (png, w, h) => {
    if (png.width === w && png.height === h) return png.data
    const out = Buffer.alloc(w * h * 4)
    for (let y = 0; y < h; y += 1) png.data.copy(out, y * w * 4, y * png.width * 4, y * png.width * 4 + w * 4)
    return out
  }
  const goldenData = crop(golden, compareWidth, compareHeight)
  const buildData = crop(build, compareWidth, compareHeight)
  const diff = new PNG({ width: compareWidth, height: compareHeight })
  const diffPixels = pixelmatch(goldenData, buildData, diff.data, compareWidth, compareHeight, { threshold: 0.1, includeAA: false, alpha: 0.1 })
  let absSum = 0
  for (let i = 0; i < compareWidth * compareHeight; i += 1) {
    const base = i * 4
    absSum +=
      Math.abs(goldenData[base] - buildData[base]) +
      Math.abs(goldenData[base + 1] - buildData[base + 1]) +
      Math.abs(goldenData[base + 2] - buildData[base + 2])
  }
  const meanAbs = absSum / (compareWidth * compareHeight * 3)
  const over24Pct = (diffPixels / (compareWidth * compareHeight)) * 100
  const passed = reportOnly ? null : over24Pct <= thresholds.over24 && meanAbs <= thresholds.mean
  // Гигиена (ADR-0015): карта диффа нужна только для разбора провала;
  // для PASS-маршрутов N-МБ PNG не пишем на каждый прогон.
  const keepDiff = passed !== true
  const diffFile = join(diffDir, `${name}-diff.png`)
  if (keepDiff) {
    mkdirSync(dirname(diffFile), { recursive: true })
    writeFileSync(diffFile, PNG.sync.write(diff))
  }
  return {
    route,
    name,
    stage,
    createdAt: new Date().toISOString(),
    golden: { file: goldenPath.replace(`${root}/`, ''), width: golden.width, height: golden.height },
    build: { file: buildPng.replace(`${root}/`, ''), width: build.width, height: build.height, css: cssSize },
    compared: { width: compareWidth, height: compareHeight, heightDelta: build.height - golden.height, widthDelta: build.width - golden.width },
    pixelOver24Pct: Number(over24Pct.toFixed(2)),
    meanAbs: Number(meanAbs.toFixed(2)),
    diffPixels,
    diffFile: keepDiff ? diffFile.replace(`${root}/`, '') : null,
    thresholds,
    passed,
    errors: errors.slice(0, 5),
  }
}

export function goldenLine(metrics) {
  const status = metrics.passed === null ? 'REPORT' : metrics.passed ? 'PASS' : 'FAIL'
  return `golden[${metrics.stage}] ${metrics.route}: build ${metrics.build.width}x${metrics.build.height} vs golden ${metrics.golden.width}x${metrics.golden.height}; ` +
    `pixel Δ>24: ${metrics.pixelOver24Pct}% (${metrics.diffPixels} px), mean ${metrics.meanAbs}/255, height Δ ${metrics.compared.heightDelta}px → ${status}`
}
