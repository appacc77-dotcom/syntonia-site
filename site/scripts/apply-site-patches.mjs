#!/usr/bin/env node
/**
 * apply-site-patches — идемпотентные правки React-исходников сайта.
 *
 * Зачем: `src/generated/**` — кодогенерация Figma (FigCraft) и в ней нет ни ссылок, ни семантики.
 * Скрипт точечно правит сгенерированную разметку (и её override-копии в `src/interactive/**`),
 * не меняя классы, поэтому визуал 1440 остаётся пиксель-в-пиксель.
 *
 * Что делает:
 *   1. Шапка: пункты навигации → настоящие <a> (href через useHref, aria-current).
 *   2. Подвал: навигация + правовые ссылки + email → <a>; «Отзывы»/«Вопросы и ответы» → якоря главной.
 *   3. Ориентиры: корень страницы → <main id="main">, шапка → <header>, подвал → <footer>.
 *   4. h1: заголовок страницы из макета → <h1> (структура из data/headings.json);
 *      у пустых по дизайну страниц (login/account/practice-detail) — скрытый h1 с title из data/seo.json.
 *   5. Якоря главной: #voices, #faq (для ссылок подвала).
 *
 * Запуск: node scripts/apply-site-patches.mjs   (идемпотентно; повторный запуск ничего не меняет)
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(SITE, 'src')

const read = (p) => readFileSync(p, 'utf8')
const write = (p, s) => writeFileSync(p, s)

// ---------- карта маршрут → JSX-модуль страницы (по generated/router.jsx)
const routerSrc = read(join(SRC, 'generated/router.jsx'))
const imports = new Map()
for (const m of routerSrc.matchAll(/import \{ (\w+) \} from '\.\/([^']+)'/g)) imports.set(m[1], m[2])
const routeModule = new Map()
for (const m of routerSrc.matchAll(/'([^']+)': (\w+),?/g)) {
  const mod = imports.get(m[2])
  if (mod) routeModule.set(m[1], join(SRC, 'generated', mod))
}

// ---------- правки шапки/подвала
const HEADER_LINKS = [
  ['О проекте', '/'],
  ['Понять себя', '/quiz.html'],
  ['Пространство практики', '/practice.html'],
  ['личная встреча', '/booking.html'],
]
const FOOTER_LINKS = [
  ['О проекте', '/'],
  ['Практики', '/practice.html'],
  ['Библиотека', '/library.html'],
  ['Форматы работы', '/booking.html'],
  ['Отзывы', '/#voices'],
  ['Вопросы и ответы', '/#faq'],
  ['Условия использования и продажи', '/legal-terms.html'],
  ['Политика конфиденциальности', '/legal-privacy.html'],
  ['Политика возвратов', '/legal-refund.html'],
  ['Согласия', '/legal-consent.html'],
]

// Содержательные ссылки: узлы-аффордансы из макета (кнопки, карточки, TOC) → href.
// nodeId однозначен во всём файле Figma; правится и generated-копия, и interactive-override.
const CONTENT_LINKS = [
  ['2826', '/quiz.html'],                              // masters: карточка «Пройти диагностику»
  ['2837', '/method.html'],                            // masters: карточка «Узнать о методе»
  ['3219', '/library/book-chapter-intro.html'],        // library: «читать онлайн»
  ['4304', '/library/book-chapter-intro.html'],        // book-chapter: TOC «Введение»
  ['4312', '/library/book-chapter-technique.html'],    // book-chapter: TOC «Техника… Боли»
  ['4314', '/library/book-chapter-story.html'],        // book-chapter: TOC «История Анны»
  ['4370', '/library/book-chapter-intro.html'],        // book-chapter: «назад» → введение
  ['4378', '/library/book-chapter-technique.html'],    // book-chapter: «далее» → техника
  ['4549', '/library/book-chapter.html'],              // intro: «далее» → Код 1. Боль
  ['4551', '/library/book-chapter.html'],              // intro: TOC «Код 1. Боль»
  ['4456', '/library.html'],                           // intro: «Вернуться к книге»
  ['4296', '/library.html'],                           // book-chapter: «Вернуться к книге»
  ['4627', '/library.html'],                           // technique: «Вернуться к книге»
  ['4765', '/library/book-chapter.html'],              // technique: «назад» → Код 1. Боль
  ['4773', '/library/book-chapter-story.html'],        // technique: «далее» → История Анны
  ['4959', '/library/book-chapter-technique.html'],    // story: «назад» → техника
  ['5163', '/quiz.html'],                              // practice: «Пройти тест»
  ['5196', '/checkout-confirm.html'],                  // practice: «Купить» (карточки)
  ['5226', '/checkout-confirm.html'],
  ['5257', '/checkout-confirm.html'],
  ['5287', '/checkout-confirm.html'],
  ['5318', '/checkout-confirm.html'],
  ['5348', '/checkout-confirm.html'],
  ['9593', '/'],                                       // thanks-booking: «На главную»
  ['9771', '/practice.html'],                          // thanks-purchase: «Перейти к практике»
  ['9855', '/'],                                       // not-found: «На главную»
  ['970', '/masters.html'],                            // home: «by Ekaterina Lebedeva» → основатель
]

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** <p ...>Label</p> → <a ... href>Label</a>; идемпотентно (уже <a> не трогаем). */
function linkify(text, label, href, { caseInsensitive = false } = {}) {
  const re = new RegExp(
    `<p((?:[^>"]|"[^"]*")*?)>(\\s*${caseInsensitive ? '' : ''}${escRe(label)}\\s*)</p>`,
    caseInsensitive ? 'gi' : 'g',
  )
  let changed = 0
  const next = text.replace(re, (all, attrs, inner) => {
    if (/\bhref=/.test(attrs)) return all
    changed += 1
    const clean = attrs.trimEnd()
    const path = href.startsWith('#') ? href : href
    return `<a${clean} data-m3-link href={href('${path}')} aria-current={isCurrent(route, '${path}') ? 'page' : undefined}>${inner.trim()}</a>`
  })
  return { text: next, changed }
}

/** Добавить useHref/useRoute в компонент, если их нет. */
function ensureHooks(text) {
  let out = text
  if (!/const href = useHref\(\)/.test(out)) {
    out = out.replace(/(export function (\w+)\([^)]*\)\s*\{\n)/, (m) => `${m}  const href = useHref()\n  const route = useRoute()\n`)
  }
  return out
}

function ensureImports(text, importLine) {
  if (text.includes(importLine)) return text
  // после первого блока //-комментариев / в начало файла
  if (/^import .*$/m.test(text)) {
    return text.replace(/^(import .*)$/m, `${importLine}\n$1`)
  }
  return `${importLine}\n${text}`
}

/** Корневой элемент файла: <div ...> → <tag ...> (первый в return) и парный </div> (последний). */
function retagRoot(text, tag, extraAttrs = '') {
  const m = text.match(/return \(\n(\s*)<div /)
  if (!m) return { text, changed: 0 }
  const opened = text.replace(/return \(\n(\s*)<div /, (all, indent) => `return (\n${indent}<${tag}${extraAttrs ? ' ' + extraAttrs : ''} `)
  const close = opened.lastIndexOf('</div>')
  if (close < 0) return { text, changed: 0 }
  return { text: opened.slice(0, close) + `</${tag}>` + opened.slice(close + 6), changed: 1 }
}


/** Контейнер-аффорданс (div/p) → <a> с теми же классами; закрывающий тег ищется по вложенности. */
function openAnchorDepth(text, index) {
  let depth = 0
  const re = /<\/?a\b[^>]*>/g
  re.lastIndex = 0
  let m
  while ((m = re.exec(text)) && m.index < index) {
    depth += m[0].startsWith('</') ? -1 : 1
    if (depth < 0) depth = 0
  }
  return depth
}

function wrapNodeAsLink(text, nodeId, href) {
  const openRe = new RegExp(`<div((?:[^>"]|"[^"]*")*data-node="${nodeId}"(?:[^>"]|"[^"]*")*)>`)
  const m = text.match(openRe)
  if (!m) return { text, changed: 0 }
  // вложенные <a> — невалидный HTML (ломает гидрацию): пропускаем узел внутри ссылки
  if (openAnchorDepth(text, m.index) > 0) return { text, changed: 0 }
  const attrs = m[1]
  const replacedOpen = `<a${attrs} data-m3-link href={href('${href}')} aria-current={isCurrent(route, '${href}') ? 'page' : undefined}>`
  const start = m.index + m[0].length
  // поиск парного </div> по глубине
  let depth = 1
  const re = /<(\/?)div\b[^>]*>/g
  re.lastIndex = start
  let mm
  let closeEnd = -1
  while ((mm = re.exec(text))) {
    depth += mm[1] ? -1 : 1
    if (depth === 0) { closeEnd = mm.index; break }
  }
  if (closeEnd < 0) return { text, changed: 0 }
  // поддерево не должно содержать своих ссылок — иначе получим вложенные <a>
  if (/<a\b[^>]*>/.test(text.slice(start, closeEnd))) return { text, changed: 0 }
  const next = text.slice(0, m.index) + replacedOpen + text.slice(start, closeEnd) + '</a>' + text.slice(closeEnd + 6)
  return { text: next, changed: 1 }
}

/** Текстовый узел <p data-node="N"> → <a> (короткие ссылки: «Вернуться к книге», кредит основателя). */
function linkTextNode(text, nodeId, href) {
  const re = new RegExp(`<p((?:[^>"]|"[^"]*")*data-node="${nodeId}"(?:[^>"]|"[^"]*")*)>`)
  const m = text.match(re)
  if (!m) return { text, changed: 0 }
  if (openAnchorDepth(text, m.index) > 0) return { text, changed: 0 }
  const close = text.indexOf('</p>', m.index + m[0].length)
  if (close < 0) return { text, changed: 0 }
  const inner = text.slice(m.index + m[0].length, close)
  if (/<[a-z]/.test(inner)) return { text, changed: 0 }
  const attrs = m[1]
  const open = `<a${attrs} data-m3-link href={href('${href}')} aria-current={isCurrent(route, '${href}') ? 'page' : undefined}>`
  const next = text.slice(0, m.index) + open + inner + '</a>' + text.slice(close + 4)
  return { text: next, changed: 1 }
}

// ---------- обход файлов
const walk = (dir) => {
  const out = []
  for (const entry of readdirSyncSafe(dir)) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) out.push(p)
  }
  return out
}
function readdirSyncSafe(dir) {
  return readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
}

const files = walk(SRC)
const stat = { headerFiles: 0, footerFiles: 0, links: 0, landmarks: 0, h1: 0, hiddenH1: 0, anchors: 0 }

// ---------- шапки и подвалы
for (const file of files) {
  let text = read(file)
  const rel = relative(SRC, file)
  const isHeader = /Понять себя/.test(text) && /Пространство практики/.test(text) && /О проекте/.test(text)
  const isFooter = /Политика конфиденциальности/.test(text) && /навигация/.test(text) && /контакты/.test(text)
  if (!isHeader && !isFooter) continue

  const importPath = relative(dirname(file), join(SRC, 'interactive/links.jsx')).replace(/\\/g, '/')
  const importLine = `import { isCurrent, useHref, useRoute } from '${importPath.startsWith('.') ? importPath : './' + importPath}'`
  let changed = 0
  const rules = isHeader ? HEADER_LINKS : FOOTER_LINKS
  for (const [label, href] of rules) {
    const res = linkify(text, label, href, { caseInsensitive: label === 'личная встреча' })
    text = res.text
    changed += res.changed
  }
  if (changed) {
    text = ensureImports(text, importLine)
    text = ensureHooks(text)
    stat.links += changed
    if (isHeader) stat.headerFiles += 1
    else stat.footerFiles += 1
    write(file, text)
  }
  // ориентиры ставим в любом случае (даже если ссылки уже были — как у главной)
  {
    let t = read(file)
    const landmark = retagRoot(t, isHeader ? 'header' : 'footer')
    if (landmark.changed) { write(file, landmark.text); stat.landmarks += 1 }
  }
}

// ---------- страницы: <main id="main">, скрытый h1 у пустых страниц
const headings = JSON.parse(read(join(SITE, 'data/headings.json')))
const seo = JSON.parse(read(join(SITE, 'data/seo.json')))
const EMPTY_PAGES = new Set(['/login.html', '/account-practices.html', '/account-history.html', '/account-profile.html', '/practice-detail.html'])
for (const [route, moduleFile] of routeModule) {
  if (!existsSync(moduleFile)) continue
  let text = read(moduleFile)
  const res = retagRoot(text, 'main', 'id="main"')
  text = res.text
  if (res.changed) stat.landmarks += 1
  if (EMPTY_PAGES.has(route) && !/data-m3-hidden-h1/.test(text)) {
    const title = seo.routes?.[route]?.title || ''
    const h1 = title ? title.split(' — ')[0] : 'Syntonia'
    text = text.replace(/<main id="main"([^>]*)>/, (m) => `${m}\n      <h1 className="sr-only" data-m3-hidden-h1>${h1}</h1>`)
    stat.hiddenH1 += 1
  }
  write(moduleFile, text)
}

// ---------- h1 из макета: <p data-node="N"> → <h1 data-node="N">
const nodeIndex = new Map()
for (const file of files) {
  const text = read(file)
  for (const m of text.matchAll(/data-node="(\d+)"/g)) if (!nodeIndex.has(m[1])) nodeIndex.set(m[1], file)
}
for (const [route, nodeId] of Object.entries(headings)) {
  if (route.startsWith('_')) continue
  const file = nodeIndex.get(String(nodeId))
  if (!file) continue
  let text = read(file)
  const re = new RegExp(`<p((?:[^>"]|"[^"]*")*data-node="${nodeId}"(?:[^>"]|"[^"]*")*)>`)
  if (!re.test(text)) continue
  let changed = false
  text = text.replace(re, (all, attrs) => { changed = true; return `<h1${attrs}>` })
  if (changed) {
    const start = text.search(new RegExp(`<h1(?:[^>"]|"[^"]*")*data-node="${nodeId}"`))
    const close = text.indexOf('</p>', start)
    if (close > 0) text = text.slice(0, close) + '</h1>' + text.slice(close + 4)
    write(file, text)
    stat.h1 += 1
  }
}

// ---------- содержательные ссылки
for (const [nodeId, href] of CONTENT_LINKS) {
  const candidates = files.filter((f) => read(f).includes(`data-node="${nodeId}"`))
  for (const file of candidates) {
    let text = read(file)
    const res = wrapNodeAsLink(text, nodeId, href)
    if (!res.changed) {
      const resP = linkTextNode(read(file), nodeId, href)
      if (!resP.changed) continue
      let t = resP.text
      const importPath = relative(dirname(file), join(SRC, 'interactive/links.jsx')).replace(/\\/g, '/')
      const importLine = `import { isCurrent, useHref, useRoute } from '${importPath.startsWith('.') ? importPath : './' + importPath}'`
      t = ensureImports(t, importLine)
      t = ensureHooks(t)
      write(file, t)
      stat.links += 1
      continue
    }
    text = res.text
    const importPath = relative(dirname(file), join(SRC, 'interactive/links.jsx')).replace(/\\/g, '/')
    const importLine = `import { isCurrent, useHref, useRoute } from '${importPath.startsWith('.') ? importPath : './' + importPath}'`
    text = ensureImports(text, importLine)
    text = ensureHooks(text)
    write(file, text)
    stat.links += 1
  }
}

// ---------- якоря главной: #voices / #faq
for (const file of files) {
  let text = read(file)
  let changed = false
  for (const [nodeId, id] of [['1184', 'voices'], ['1273', 'faq']]) {
    if (new RegExp(`data-node="${nodeId}"`).test(text) && !new RegExp(`id="${id}"`).test(text)) {
      text = text.replace(new RegExp(`<div((?:[^>"]|"[^"]*")*data-node="${nodeId}")`), (all, attrs) => {
        changed = true
        return `<div id="${id}"${attrs}`
      })
    }
  }
  if (changed) { write(file, text); stat.anchors += 1 }
}

console.log(`patches: links=${stat.links} (шапок ${stat.headerFiles}, подвалов ${stat.footerFiles}), ` +
  `landmarks=${stat.landmarks}, h1=${stat.h1}, скрытых h1=${stat.hiddenH1}, якоря=${stat.anchors}`)
