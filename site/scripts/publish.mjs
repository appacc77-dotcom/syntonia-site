#!/usr/bin/env node
/**
 * publish: site/dist → корень репозитория сайта (публикуемые файлы).
 *
 * Что делает:
 *  1. HTML/CSS/JS из dist → корень; ссылки на ассеты переименовываются по asset-map.json
 *     (raw-имя из React-исходников → финальное оптимизированное имя в assets/).
 *  2. CSS: url(/assets/..) → url(../assets/..), url(/fonts/..) → url(../fonts/..) (переносимость).
 *  3. SEO-слой production: canonical/og:url/og:image/robots в каждый HTML (профиль public).
 *  4. 404.html — копия not-found.html с абсолютными путями /syntonia-site/... (Pages отдаёт её
 *     на любой глубине URL, поэтому относительные пути там не работают).
 *  5. Шрифты/ассеты не перезаписываются, если не изменились; старые хэши css/js удаляются.
 *
 * Usage: node site/scripts/publish.mjs [--dry] [--out <dir>]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, copyFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = resolve(SITE, '..')
const DIST = join(SITE, 'dist')
const args = process.argv.slice(2)
const OUT = args.includes('--out') ? resolve(args[args.indexOf('--out') + 1]) : REPO
const DRY = args.includes('--dry')

const SITE_URL = 'https://appacc77-dotcom.github.io/syntonia-site'
const BASE_PATH = '/syntonia-site'

const fail = (msg) => { console.error(`publish: FAIL — ${msg}`); process.exit(1) }
if (!existsSync(DIST)) fail('нет site/dist (сначала npm run build в site/)')

const routes = JSON.parse(readFileSync(join(SITE, 'data/routes.json'), 'utf8')).routes.map((r) => r.route)
const seo = JSON.parse(readFileSync(join(SITE, 'data/seo.json'), 'utf8'))
const map = JSON.parse(readFileSync(join(SITE, 'asset-map.json'), 'utf8'))

// --- порядок замен: длинные имена первыми, чтобы не портить короткие вхождения
const pairs = Object.entries(map).filter(([from, to]) => from !== to).sort((a, b) => b[0].length - a[0].length)
const escCss = (s) => s.replace(/([./])/g, '\\$1')

function rewriteNames(text) {
  let out = text
  for (const [from, to] of pairs) {
    if (!out.includes(from) && !out.includes(escCss(from))) continue
    out = out.split(from).join(to)
    out = out.split(escCss(from)).join(escCss(to))
  }
  return out
}

/** og:image маршрута: social/… как есть, assets/… через карту имён, иначе глобальный fallback. */
function routeOgImage(route) {
  const routeImage = (seo.routes[route] || {}).ogImage
  if (routeImage) return routeImage.startsWith('assets/') ? (map[routeImage] || routeImage) : routeImage
  return map[seo.site.ogImage] || seo.site.ogImage
}

function rewriteCssLinks(text) {
  return text
    .replace(/url\(\s*(["']?)\/assets\//g, 'url($1../assets/')
    .replace(/url\(\s*(["']?)\/fonts\//g, 'url($1../fonts/')
}

/** JSON-LD: Organization + WebSite + WebPage (+ BreadcrumbList для подстраниц). */
function jsonLd(route, ogImage) {
  const info = seo.routes[route] || {}
  const path = route === '/' ? '/' : `/${route.replace(/^\//, '')}`
  const url = `${SITE_URL}${path}`
  const orgId = `${SITE_URL}/#organization`
  const siteId = `${SITE_URL}/#website`
  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: seo.site.name,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icons/favicon-512.png`,
      description: (seo.routes['/'] || {}).description,
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      url: `${SITE_URL}/`,
      name: seo.site.name,
      inLanguage: seo.site.locale.replace('_', '-'),
      publisher: { '@id': orgId },
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: info.title,
      description: info.description,
      inLanguage: seo.site.locale.replace('_', '-'),
      isPartOf: { '@id': siteId },
      about: { '@id': orgId },
    },
  ]
  if (route !== '/') {
    const items = [{ name: 'Главная', item: `${SITE_URL}/` }]
    if (route.startsWith('/library/')) items.push({ name: 'Библиотека', item: `${SITE_URL}/library.html` })
    items.push({ name: info.title || route, item: url })
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.item })),
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

const NOINDEX = /^\/(login|account-[a-z]+|checkout-confirm|thanks-[a-z]+)\.html$/

function seoHead(route, ogImage) {
  const path = route === '/' ? '/' : `/${route.replace(/^\//, '')}`
  const canonical = `${SITE_URL}${path}`
  const robots = NOINDEX.test(route) ? 'noindex, follow' : 'index, follow'
  const title = (seo.routes[route] || {}).title || seo.site.name
  const imageUrl = `${SITE_URL}/${ogImage}`
  return [
    `    <link rel="canonical" href="${canonical}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta property="og:image" content="${imageUrl}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:alt" content="${title.replace(/"/g, '&quot;')}" />`,
    `    <meta name="twitter:image" content="${imageUrl}" />`,
    `    <meta name="robots" content="${robots}" />`,
    `    <script type="application/ld+json">${jsonLd(route, ogImage)}</script>`,
  ].join('\n')
}

const written = []
const write = (absPath, content) => {
  written.push(absPath)
  if (DRY) return
  mkdirSync(dirname(absPath), { recursive: true })
  writeFileSync(absPath, content)
}

const walk = (dir) => {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    entry.isDirectory() ? out.push(...walk(p)) : out.push(p)
  }
  return out
}

// ---------- 1. HTML страниц
for (const route of routes) {
  const file = route === '/' ? 'index.html' : route.replace(/^\//, '')
  const src = join(DIST, file)
  if (!existsSync(src)) fail(`в dist нет ${file}`)
  let html = readFileSync(src, 'utf8')
  html = rewriteNames(html)
  const ogImage = routeOgImage(route)
  // фавикон/theme-color: заменяем заглушку <link rel="icon" href="data:," />
  html = html.replace(
    /<link rel="icon" href="data:," \/>/,
    [
      // абсолютные URL: страницы бывают на глубине /library/…, относительный путь там ломается
      `<link rel="icon" type="image/png" sizes="32x32" href="${SITE_URL}/icons/favicon-32.png" />`,
      `<link rel="apple-touch-icon" sizes="180x180" href="${SITE_URL}/icons/apple-touch-icon.png" />`,
      '<meta name="theme-color" content="#3A3223" />',
    ].join('\n    '),
  )
  if (!html.includes('rel="canonical"')) {
    if (!html.includes('</head>')) fail(`${file}: нет </head>`)
    html = html.replace('</head>', `${seoHead(route, ogImage)}\n  </head>`)
  }
  write(join(OUT, file), html)
}

// ---------- 2. 404.html (абсолютные пути: Pages отдаёт страницу на любой глубине URL)
{
  const src = join(DIST, 'not-found.html')
  if (!existsSync(src)) fail('в dist нет not-found.html')
  let html = readFileSync(src, 'utf8')
  html = rewriteNames(html)
  html = html
    .replace(/(\b(?:href|src)=")\.\//g, `$1${BASE_PATH}/`)
    .replace(/(\bstyle="[^"]*url\()\/assets\//g, `$1${BASE_PATH}/assets/`)
    .replace(/(\bstyle="[^"]*url\()\/fonts\//g, `$1${BASE_PATH}/fonts/`)
    .replace(/\n {6}<link rel="canonical"[^\n]*\n/, '\n')
    .replace(/(<meta name="robots" content=")[^"]*(")/, '$1noindex, follow$2')
    .replace(/\n {4}<meta property="og:url"[^\n]*\n/, '\n')
    .replace(/\n {4}<meta property="og:image"[^\n]*\n/, '\n')
  if (!html.includes('name="robots"')) html = html.replace('</head>', '    <meta name="robots" content="noindex, follow" />\n  </head>')
  write(join(OUT, '404.html'), html)
}

// ---------- 3. CSS/JS бандлы
const distAssets = readdirSync(join(DIST, 'assets'))
const oldAssetFiles = existsSync(join(OUT, 'assets')) ? readdirSync(join(OUT, 'assets')) : []
const newBundles = distAssets.filter((f) => /^main-.*\.(css|js)$/.test(f))
const oldBundles = oldAssetFiles.filter((f) => /^main-.*\.(css|js)$/.test(f))
for (const name of newBundles) {
  let text = readFileSync(join(DIST, 'assets', name), 'utf8')
  text = rewriteNames(text)
  if (name.endsWith('.css')) text = rewriteCssLinks(text)
  write(join(OUT, 'assets', name), text)
}

// ---------- 3b. Иконки из public/icons (Figma-экспорт SVG)
const distIcons = join(DIST, 'icons')
let copiedIcons = 0
if (existsSync(distIcons)) {
  for (const abs of walk(distIcons)) {
    const rel = relative(DIST, abs)
    const dst = join(OUT, rel)
    const same = existsSync(dst) && statSync(dst).size === statSync(abs).size && readFileSync(dst).equals(readFileSync(abs))
    if (!same) { write(dst, readFileSync(abs)); copiedIcons += 1 }
  }
}

// ---------- 3c. Соц-превью (public/social → social/)
const distSocial = join(DIST, 'social')
let copiedSocial = 0
if (existsSync(distSocial)) {
  for (const abs of walk(distSocial)) {
    const rel = relative(DIST, abs)
    const dst = join(OUT, rel)
    const same = existsSync(dst) && statSync(dst).size === statSync(abs) && readFileSync(dst).equals(readFileSync(abs))
    if (!same) { write(dst, readFileSync(abs)); copiedSocial += 1 }
  }
}

// ---------- 4. Шрифты (копируем, только если отличаются)
const distFonts = join(DIST, 'fonts')
let copiedFonts = 0
if (existsSync(distFonts)) {
  for (const abs of walk(distFonts)) {
    const rel = relative(DIST, abs)
    const dst = join(OUT, rel)
    const same = existsSync(dst) && statSync(dst).size === statSync(abs).size &&
      readFileSync(dst).equals(readFileSync(abs))
    if (!same) { write(dst, readFileSync(abs)); copiedFonts += 1 }
  }
}

// ---------- 5. Чистим старые бандлы и битые ссылки
const removed = []
if (!DRY) {
  for (const name of oldBundles) {
    if (newBundles.includes(name)) continue
    rmSync(join(OUT, 'assets', name), { force: true })
    removed.push(`assets/${name}`)
  }
}

// ---------- 5b. Проверка: og-картинки и фавиконы на месте
for (const route of routes) {
  const image = routeOgImage(route)
  if (!existsSync(join(OUT, image))) fail(`нет og-картинки для ${route}: ${image}`)
}
for (const icon of ['icons/favicon-32.png', 'icons/apple-touch-icon.png', 'icons/favicon-512.png']) {
  if (!existsSync(join(OUT, icon))) fail(`нет иконки ${icon}`)
}

// ---------- 6. Проверка: все ссылки на ассеты существуют
const finalAssets = new Set(
  (existsSync(join(OUT, 'assets')) ? readdirSync(join(OUT, 'assets')) : []).concat(newBundles),
)
const missing = new Set()
const textFiles = routes.map((r) => (r === '/' ? 'index.html' : r.replace(/^\//, ''))).concat(['404.html'])
for (const rel of textFiles) {
  const abs = join(OUT, rel)
  if (!existsSync(abs)) continue
  const text = readFileSync(abs, 'utf8')
  for (const m of text.matchAll(/assets\/([A-Za-z0-9@._-]+)/g)) {
    const name = m[1]
    if (!finalAssets.has(name)) missing.add(`${rel}: ${name}`)
  }
}
for (const name of newBundles) {
  const text = readFileSync(join(OUT, 'assets', name), 'utf8')
  for (const m of text.matchAll(/assets\/([A-Za-z0-9@._-]+)/g)) {
    const asset = m[1]
    if (!finalAssets.has(asset)) missing.add(`assets/${name}: ${asset}`)
  }
}
if (missing.size) {
  console.error(`publish: FAIL — ссылки на отсутствующие ассеты (${missing.size}):`)
  for (const m of [...missing].slice(0, 20)) console.error('  - ' + m)
  process.exit(1)
}

// ---------- 7. Переносимость опубликованного: никаких корневых URL (кроме 404.html)
const portability = []
for (const rel of routes.map((r) => (r === '/' ? 'index.html' : r.replace(/^\//, ''))).concat(['404.html'])) {
  const abs = join(OUT, rel)
  if (!existsSync(abs)) continue
  const text = readFileSync(abs, 'utf8')
  for (const m of text.matchAll(/\b(href|src|action|poster)="(\/[^"]*)"/g)) {
    if (rel === '404.html' && m[2].startsWith(BASE_PATH + '/')) continue
    portability.push(`${rel}: ${m[1]}="${m[2]}"`)
  }
  for (const m of text.matchAll(/\bstyle="[^"]*url\(\s*["']?(\/[^)"']*)/g)) {
    if (rel === '404.html' && m[1].startsWith(BASE_PATH + '/')) continue
    portability.push(`${rel}: style url(${m[1]})`)
  }
}
for (const name of newBundles.filter((n) => n.endsWith('.css'))) {
  const css = readFileSync(join(OUT, 'assets', name), 'utf8')
  for (const m of css.matchAll(/(?<!\\)url\(\s*["']?(\/[^)"']*)/g)) {
    portability.push(`assets/${name}: url(${m[1]})`)
  }
}
if (portability.length) {
  console.error(`publish: FAIL — корневые URL в опубликованных файлах (${portability.length}):`)
  for (const p of portability.slice(0, 20)) console.error('  - ' + p)
  process.exit(1)
}

console.log(`publish: ${DRY ? 'DRY ' : ''}OK — ${routes.length} страниц + 404, бандлы: ${newBundles.join(', ')}`)
if (removed.length) console.log(`publish: удалены старые бандлы: ${removed.join(', ')}`)
if (copiedFonts) console.log(`publish: обновлены шрифты: ${copiedFonts} файлов`)
if (copiedIcons) console.log(`publish: обновлены иконки: ${copiedIcons} файлов`)
console.log(`publish: файлов записано: ${written.length}, целевой каталог: ${OUT}`)
if (copiedIcons || copiedSocial) console.log(`publish: иконок ${copiedIcons}, соц-превью ${copiedSocial}`)
