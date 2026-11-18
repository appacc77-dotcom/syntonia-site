/**
 * Ядро contract-ворот: загрузка контекста (id-map, live-nodes, doc, skip-логика)
 * и измерение одной страницы. Используется verify-contract.mjs и browser-pass.mjs.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

export const round = (value) => (Number.isFinite(value) ? Math.round(value * 100) / 100 : null)
export function lineHeightPx(lineHeight, fontSize) {
  if (!lineHeight || typeof lineHeight !== 'object') return NaN
  return lineHeight.unit === 'PERCENT' ? (Number(lineHeight.value) / 100) * fontSize : Number(lineHeight.value)
}
export function spacingPx(spacing, fontSize) {
  if (!spacing || typeof spacing !== 'object') return 0
  return spacing.unit === 'PERCENT' ? (Number(spacing.value) / 100) * fontSize : Number(spacing.value)
}

/** Контекст contract-ворот: всё, что не зависит от страницы. */
export function loadContractContext(G) {
  const fail = (message) => {
    throw new Error(message)
  }
  const snapDir = G.SNAPSHOT
  const idMap = JSON.parse(readFileSync(join(snapDir, 'props', 'id-map.json'), 'utf8')).nodes
  const liveText = new Map()
  const livePath = G.LIVE_NODES
  if (!existsSync(livePath)) fail(`нет live-nodes.json в export-pack: ${livePath}`)
  for (const page of JSON.parse(readFileSync(livePath, 'utf8')).result || []) {
    for (const node of page.nodes || []) if (node.text) liveText.set(node.id, node.text)
  }
  if (!liveText.size) fail('live-nodes.json пуст — contract без текстовых узлов неполный')
  const metaPages = JSON.parse(readFileSync(join(G.GEN, 'meta-pages.json'), 'utf8')).pages
  const homeMeta = JSON.parse(readFileSync(join(G.GEN, 'meta.json'), 'utf8'))
  const findMeta = (route) => {
    const found = metaPages.find((item) => (item.route?.route || item.route) === route.route)
    if (found) return found
    if (route.route === '/') return { route: '/', page: route.page, frameId: homeMeta.source.frameId }
    return null
  }
  const routes = G.ROUTES
  const thresholdsPath = join(G.CONFIG, 'contract-thresholds.json')
  const thresholds = existsSync(thresholdsPath) ? JSON.parse(readFileSync(thresholdsPath, 'utf8')) : { geometry: 0.995, typography: 0.99, tolerancePx: 1 }
  const TOL = Number(thresholds.tolerancePx || 1)
  const WIDTH_TOL = Number(thresholds.widthTolerancePx || TOL)
  const byLive = new Map(Object.entries(idMap).map(([figId, meta]) => [meta.liveId, figId]))
  const mixedIds = new Set()
  for (const [liveId, text] of liveText) if ((text.segments || 1) > 1 && byLive.has(liveId)) mixedIds.add(String(byLive.get(liveId)))
  const rotatedIds = new Set()
  const parentOf = new Map()
  const docNodesCache = { nodes: {} }
  const docPath = G.DOC
  if (existsSync(docPath)) {
    const { unzipSync } = requireFflate()
    const zip = unzipSync(readFileSync(docPath))
    const doc = JSON.parse(Buffer.from(zip['document.json']).toString('utf8'))
    docNodesCache.nodes = doc.nodes
    for (const [id, node] of Object.entries(doc.nodes)) {
      for (const child of node.children || []) parentOf.set(String(child), id)
      const transform = node.transform
      if (Array.isArray(transform) && transform.length === 6) {
        const rotation = Math.atan2(transform[1], transform[0])
        if (Math.abs(rotation) > 0.01 || Math.abs(transform[0] - 1) > 0.01 || Math.abs(transform[3] - 1) > 0.01) rotatedIds.add(id)
      }
    }
  }
  const childOf = new Map()
  for (const [id, node] of Object.entries(docNodesCache.nodes || {})) {
    for (const child of node.children || []) {
      if (!childOf.has(String(id))) childOf.set(String(id), [])
      childOf.get(String(id)).push(String(child))
    }
  }
  const addSubtree = (set, id) => {
    const key = String(id)
    if (set.has(key)) return
    set.add(key)
    for (const child of childOf.get(key) || []) addSubtree(set, child)
  }
  const rotatedInCode = new Set()
  const walkGenerated = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) {
        walkGenerated(path)
        continue
      }
      if (!name.endsWith('.jsx')) continue
      for (const line of readFileSync(path, 'utf8').split('\n')) {
        if (!line.includes('rotate-[')) continue
        for (const match of line.matchAll(/data-node="(\d+)"/g)) rotatedInCode.add(match[1])
      }
    }
  }
  walkGenerated(G.GEN)
  const sectionIds = new Set()
  for (const meta of metaPages) for (const section of meta.sections || []) sectionIds.add(String(section.id))
  for (const section of homeMeta.code?.sections || []) sectionIds.add(String(section.id))
  const sectionOf = (id) => {
    let cur = String(id)
    for (let depth = 0; depth < 40; depth += 1) {
      if (sectionIds.has(cur)) return cur
      const parent = parentOf.get(cur)
      if (parent === undefined) return null
      cur = String(parent)
    }
    return null
  }
  const skipIds = new Set()
  for (const id of [...rotatedIds, ...rotatedInCode]) addSubtree(skipIds, id)
  for (const id of mixedIds) {
    const top = sectionOf(id)
    if (top) addSubtree(skipIds, top)
    addSubtree(skipIds, id)
  }
  return { idMap, liveText, metaPages, homeMeta, findMeta, routes, thresholds, TOL, WIDTH_TOL, skipIds, docNodesCache }
}

// fflate — CommonJS/ESM-совместимый пакет; в ESM удобно через createRequire.
import { createRequire } from 'node:module'
const requireFflate = () => {
  const require = createRequire(import.meta.url)
  return require('fflate')
}

/** Измерить одну страницу (page уже загружена и шрифты готовы). */
export async function measureContractRoute(page, context, route, pageErrors = []) {
  const { idMap, liveText, findMeta, thresholds, TOL, WIDTH_TOL, skipIds } = context
  const meta = findMeta(route)
  if (!meta) return { route: route.route, error: 'no meta-pages entry' }
  const expectedIds = Object.entries(idMap).filter(([, mapping]) => mapping.page === route.page).map(([id]) => id)
  const dom = await page.evaluate((ids) => {
    const out = {}
    for (const id of ids) {
      const element = document.querySelector(`[data-node="${id}"]`)
      if (!element) continue
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      out[id] = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 || rect.height > 0,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        fontFamily: style.fontFamily,
      }
    }
    return out
  }, expectedIds)
  const rootLive = idMap[String(meta.frameId)]?.liveBox
  const rootDom = dom[meta.frameId]
  let geometryTotal = 0
  let geometryOk = 0
  let typographyTotal = 0
  let typographyOk = 0
  const violations = []
  for (const [id, mapping] of Object.entries(idMap)) {
    if (mapping.page !== route.page || !mapping.liveBox) continue
    if (skipIds.has(String(id))) continue
    const build = dom[id]
    const live = mapping.liveBox
    if (!build || !build.visible || !rootDom || !rootLive) continue
    geometryTotal += 1
    const box = { x: build.x - rootDom.x, y: build.y - rootDom.y, width: build.width, height: build.height }
    const dx = Math.abs(box.x - live.x)
    const dy = Math.abs(box.y - live.y)
    const dw = Math.abs(box.width - live.width)
    const dh = Math.abs(box.height - live.height)
    const isText = String(mapping.type || '').toLowerCase() === 'text'
    const widthLimit = Math.max(WIDTH_TOL, live.width * 0.02)
    const xLimit = isText ? Math.max(TOL, Math.min(dw, widthLimit)) : TOL
    const yLimit = isText ? Math.max(2, TOL) : TOL
    const geometryPass = dx <= xLimit && dy <= yLimit && dw <= widthLimit && dh <= TOL + 0.5
    if (geometryPass) geometryOk += 1
    else if (violations.length < 200) violations.push({ id, name: mapping.name, kind: 'geometry', dx: round(dx), dy: round(dy), dw: round(dw), dh: round(dh) })
    const liveNode = liveText.get(mapping.liveId)
    if (liveNode) {
      typographyTotal += 1
      const wantedSize = Number(liveNode.fontSize)
      const builtSize = parseFloat(build.fontSize)
      const wantedLine = lineHeightPx(liveNode.lineHeight, wantedSize)
      const builtLine = parseFloat(build.lineHeight)
      const wantedSpacing = spacingPx(liveNode.letterSpacing, wantedSize)
      const builtSpacing = build.letterSpacing === 'normal' ? 0 : parseFloat(build.letterSpacing)
      const wantedFamily = (liveNode.fontName?.family || '').toLowerCase()
      const builtFamily = build.fontFamily.toLowerCase()
      const pass =
        Number.isFinite(wantedSize) &&
        Math.abs(builtSize - wantedSize) <= 0.5 &&
        (!Number.isFinite(wantedLine) || Math.abs(builtLine - wantedLine) <= 1) &&
        Math.abs(builtSpacing - wantedSpacing) <= 0.1 &&
        (!wantedFamily || builtFamily.includes(wantedFamily))
      if (pass) typographyOk += 1
      else if (violations.length < 200) {
        violations.push({
          id,
          name: mapping.name,
          kind: 'typography',
          size: [wantedSize, builtSize],
          line: [round(wantedLine), round(builtLine)],
          spacing: [round(wantedSpacing), round(builtSpacing)],
          family: [liveNode.fontName?.family || '', build.fontFamily],
        })
      }
    }
  }
  const geometryRatio = geometryTotal ? geometryOk / geometryTotal : 1
  const typographyRatio = typographyTotal ? typographyOk / typographyTotal : 1
  const pass = geometryRatio >= thresholds.geometry && typographyRatio >= thresholds.typography
  return {
    route: route.route,
    page: route.page,
    pass,
    geometry: { total: geometryTotal, ok: geometryOk, ratio: round(geometryRatio) },
    typography: { total: typographyTotal, ok: typographyOk, ratio: round(typographyRatio) },
    violations: violations.slice(0, 40),
    violationCount: violations.length,
    errors: pageErrors.splice(0),
  }
}

export function contractSummary(row, thresholds) {
  return `${row.pass ? 'PASS' : 'FAIL'} ${row.route.padEnd(16)} geometry ${row.geometry.ok}/${row.geometry.total} (${(row.geometry.ratio * 100).toFixed(2)}%)  typography ${row.typography.ok}/${row.typography.total} (${(row.typography.ratio * 100).toFixed(2)}%)${row.violationCount ? `  violations ${row.violationCount}` : ''}`
}
