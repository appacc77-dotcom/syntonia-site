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


/** Шапка: у header-inner в кодогене оказался gap-[10px], хотя в Figma эффективный gap = 0
 *  (596.17 + 167.66 + 596.17 = 1360 ровно влезает в контейнер 1424 − 2×32). Из-за лишних
 *  20 px флекс сжимал nav и header-actions на 10 px каждый. Патч: gap-[10px] → gap-0. */
function fixHeaderGap(text) {
  let changed = 0
  const out = text.replace(/(<div[^>]*className="[^"]*min-h-\[92px\][^"]*justify-between[^"]*")/g, (all) => {
    if (!/\bgap-\[10px\]/.test(all)) return all
    changed += 1
    return all.replace(/\bgap-\[10px\]/, 'gap-0')
  })
  return { text: out, changed }
}


/** Кодоген-хак: в flex-ряду с justify-between вместо точных отступов ставился огромный
 *  фиксированный gap (напр. gap-[430px]). Он не влезает в контейнер → flex сжимает детей:
 *  иконки вообще схлопываются в 0, кнопки теряют ширину. В таких рядах gap не нужен —
 *  распределение делает justify-between. Патч: gap-[Npx] (N ≥ 100) → gap-0. */
function fixHugeGaps(text) {
  let changed = 0
  const out = text.replace(/className="([^"]*)"/g, (all, cls) => {
    if (!/justify-between/.test(cls)) return all
    const next = cls.replace(/\bgap-\[(\d{2,})px\]/g, (m, n) => (Number(n) >= 100 ? 'gap-0' : m))
    if (next === cls) return all
    changed += 1
    return `className="${next}"`
  })
  return { text: out, changed }
}

/** Компенсации кодогена под тот же gap: на floating-шапке (book-chapter*) элементы сдвинуты
 *  inline-стилем `left: -Npx` ровно на величину зазоров. После gap-0 они лишние → убираем. */
function dropGapCompensations(text) {
  let changed = 0
  let out = text
  // вариант 1: стиль состоял только из компенсации — удаляем атрибут целиком
  out = out.replace(/ style=\{\{ position: 'relative', left: '-[0-9.]+px', top: '0px' \}\}/g, () => {
    changed += 1
    return ''
  })
  // вариант 2: компенсация — префикс в наборе других стилей
  out = out.replace(/(style=\{\{ )position: 'relative', left: '-[0-9.]+px', top: '0px', /g, (all, head) => {
    changed += 1
    return head
  })
  return { text: out, changed }
}


// ---------- rich text: списки и абзацные интервалы (карта из Figma: data/rich-text.json)
const RICH = existsSync(join(SITE, 'data/rich-text.json')) ? JSON.parse(read(join(SITE, 'data/rich-text.json'))) : []
const jsxStr = (value) => `{${JSON.stringify(value)}}`

/** Элемент <p ... data-node="N">...</p> → {start, contentStart, contentEnd, end, attrs, openEnd}. */
function findTextElement(text, nodeId) {
  const openRe = new RegExp(`<p((?:[^>"]|"[^"]*")*data-node="${nodeId}"(?:[^>"]|"[^"]*")*)>`)
  const m = openRe.exec(text)
  if (!m) return null
  const contentStart = m.index + m[0].length
  const contentEnd = text.indexOf('</p>', contentStart)
  if (contentEnd < 0) return null
  if (text.slice(contentStart, contentEnd).includes('<ul')) return null // уже преобразовано
  return { openStart: m.index, attrs: m[1], contentStart, contentEnd }
}

/** Bullet-список из Figma TEXT-узла: висчий отступ + «•» (геометрия из golden). */
function renderList(items, entry) {
  const fontSize = entry.fontSize || 16
  const bulletLeft = Math.round(fontSize * 0.63 * 10) / 10
  const textIndent = Math.round(fontSize * 1.58 * 10) / 10
  const li = items.map((item) => {
    const parts = String(item).split(/\n|\u2028/).map((line) => jsxStr(line))
    // Переносы Figma — жёсткие: каждую строку держим нераспадающейся, иначе шрифтовые метрики
    // добавляют лишний перенос и пункт вырастает. Длинные однострочные пункты Figma тоже не
    // переносит (expectedLines === 1).
    const hardLines = parts.length > 1 || entry.expectedLines === 1
    const body = hardLines
      ? parts.map((line) => `<span style={{ whiteSpace: 'nowrap' }}>${line}</span>`).join('<br />')
      : parts.join('<br />')
    return `<li style={{ position: 'relative', paddingLeft: '${textIndent}px' }}><span style={{ position: 'absolute', left: '${bulletLeft}px' }}>•</span>${body}</li>`
  }).join('')
  return `<ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>${li}</ul>`
}

function renderParagraphs(items, spacing) {
  return items.map((item, index) => {
    const margin = index === 0 ? 0 : spacing
    // мягкие переносы Figma (U+2028 / \n) внутри абзаца → <br/>
    const parts = String(item).split(/\n|\u2028/).map((line) => jsxStr(line))
    return `<p style={{ margin: 0, marginTop: '${margin}px' }}>${parts.join('<br />')}</p>`
  }).join('')
}

/** Применить rich-text карту к файлу. Идемпотентно (уже преобразованное пропускаем). */
function applyRichText(text, fileName) {
  let next = text
  let changed = 0
  for (const entry of RICH) {
    const found = findTextElement(next, entry.node)
    if (!found) continue
    const width = entry.width ? `width: '${entry.width}px', ` : ''
    const inner = entry.kind === 'list'
      ? renderList(entry.items, entry)
      : renderParagraphs(entry.items, entry.paragraphSpacing)
    const replacement = `<div${found.attrs} style={{ ${width}boxSizing: 'border-box' }}>${inner}</div>`
    next = next.slice(0, found.openStart) + replacement + next.slice(found.contentEnd + 4)
    changed += 1
    stat.richText = (stat.richText || 0) + 1
  }
  return { text: next, changed }
}


// ---------- фикс-боксы текста (Figma textAutoResize=NONE): напр. script-нумерация bio 01..05,
// у которой бокс 20 px при line-height 32 px — иначе head вырастает на 3–12 px и каскадит дальше.
const BOX_FIXES = existsSync(join(SITE, 'data/box-fixes.json')) ? JSON.parse(read(join(SITE, 'data/box-fixes.json'))) : []

function applyBoxFixes(text) {
  let next = text
  let changed = 0
  for (const fix of BOX_FIXES) {
    const openRe = new RegExp(`<(p|div|span)((?:[^>"]|"[^"]*")*data-node="${fix.node}"(?:[^>"]|"[^"]*")*)>`)
    const m = openRe.exec(next)
    if (!m) continue
    if (/style=\{\{/.test(m[2])) {
      // идемпотентность: если ширина/высота уже заданы — не дублируем
      if (/width:\s*'/.test(m[2]) && /height:\s*'/.test(m[2])) continue
      const tag = m[0]
      const patched = tag.replace(/style=\{\{/, `style={{ width: '${fix.width}px', height: '${fix.height}px', `)
      next = next.slice(0, m.index) + patched + next.slice(m.index + tag.length)
    } else {
      const tag = m[0].replace(/^(<(?:p|div|span))/, `$1 style={{ width: '${fix.width}px', height: '${fix.height}px' }}`)
      next = next.slice(0, m.index) + tag + next.slice(m.index + m[0].length)
    }
    changed += 1
    stat.boxFixes = (stat.boxFixes || 0) + 1
  }
  return { text: next, changed }
}



// ---------- семантика: h2/h3 из карты Figma-имён и найденных заголовков секций
const HEADING_TAGS = existsSync(join(SITE, 'data/heading-tags.json')) ? JSON.parse(read(join(SITE, 'data/heading-tags.json'))) : []

function applyHeadingTags(text) {
  let next = text
  let changed = 0
  for (const entry of HEADING_TAGS) {
    const tag = entry.tag === 'h3' ? 'h3' : 'h2'
    const openRe = new RegExp(`<(p|div)((?:[^>"]|"[^"]*")*data-node="${entry.node}"(?:[^>"]|"[^"]*")*)>`)
    const m = openRe.exec(next)
    if (!m) continue
    const openEnd = m.index + m[0].length
    const end = findElementEnd(next, openEnd, m[1])
    if (!end) continue
    const inner = next.slice(openEnd, end.closeStart)
    if (/<h[12]/.test(inner)) continue // уже заголовок внутри
    next = next.slice(0, m.index) + `<${tag}${m[2]}>` + inner + `</${tag}>` + next.slice(end.closeEnd)
    changed += 1
    stat.headingTags = (stat.headingTags || 0) + 1
  }
  return { text: next, changed }
}


function findElementEnd(text, openEnd, tagName) {
  const re = new RegExp(`<${tagName}\\b|</${tagName}>`, 'g')
  re.lastIndex = openEnd
  let depth = 1
  let m
  while ((m = re.exec(text))) {
    if (m[0].startsWith(`<${tagName}`)) depth += 1
    else depth -= 1
    if (depth === 0) return { closeStart: m.index, closeEnd: m.index + m[0].length }
  }
  return null
}

/** Убрать накопленные дубли width/height в inline-стиле фикс-боксов (старые прогоны не были
 * идемпотентны). Идемпотентно: повторный запуск ничего не меняет. */
function dedupeBoxFixStyles(text) {
  let changed = 0
  const out = text.replace(/style=\{\{([^}]*)\}\}/g, (all, body) => {
    const pairs = body.match(/(?:width|height):\s*'[^']*'/g) || []
    if (pairs.length < 2) return all
    const last = new Map()
    for (const p of pairs) last.set(p.split(':')[0].trim(), p)
    if (last.get('width') === undefined || last.get('height') === undefined) return all
    let rest = body
    for (const p of pairs) rest = rest.replace(p, '')
    // чистим осиротевшие запятые
    rest = rest.replace(/\s*,\s*,/g, ',').replace(/^\s*,\s*/, '').replace(/\s*,\s*$/, '').replace(/\s{2,}/g, ' ').trim()
    const w = /'([^']*)'/.exec(last.get('width'))[1]
    const h = /'([^']*)'/.exec(last.get('height'))[1]
    const nextBody = [`width: '${w}'`, `height: '${h}'`, rest].filter(Boolean).join(', ')
    const outStyle = `style={{ ${nextBody} }}`
    if (outStyle === all) return all
    changed += 1
    return outStyle
  })
  return { text: out, changed }
}


// ---------- семантика изображений: CSS-фоны → role="img" + aria-label или aria-hidden
const IMAGE_LABELS = existsSync(join(SITE, 'data/image-labels.json')) ? JSON.parse(read(join(SITE, 'data/image-labels.json'))) : {}

/** Элемент с CSS-фоном: информативный → role="img"/aria-label, декоративный → aria-hidden.
 *  Не трогаем элементы, внутри которых есть текст (иначе скроем контент). */
function applyImageSemantics(text) {
  let next = text
  let changed = 0
  const re = /<(div|section|header|footer|span)((?:[^>"]|"[^"]*")*)>/g
  const hits = []
  let m
  while ((m = re.exec(next))) {
    const attrs = m[2]
    if (!/\]\[background:url\(\(?\/assets\//.test(attrs) && !attrs.includes('[background:url(/assets/')) continue
    if (/role=|aria-hidden=/.test(attrs)) continue
    const openEnd = m.index + m[0].length
    const end = findElementEnd(next, openEnd, m[1])
    if (!end) continue
    const inner = next.slice(openEnd, end.closeStart)
    // JSX-компоненты внутри (например <QuizWizard />) в статике не видны: такие контейнеры
    // нельзя помечать aria-hidden — внутри может быть весь интерактивный контент.
    const hasComponents = /<[A-Z]/.test(inner)
    const textLen = inner.replace(/<[^>]*>/g, '').replace(/\{[^{}]*\}/g, '').replace(/\s+/g, ' ').trim().length
    const node = /data-node="(\d+)"/.exec(attrs)
    const nodeId = node ? node[1] : null
    hits.push({ index: m.index, tag: m[0], openEnd, end: end.closeEnd, textLen, hasComponents, nodeId })
  }
  for (const hit of hits.reverse()) {
    const label = hit.nodeId ? IMAGE_LABELS[hit.nodeId] : null
    let insertion
    if (label && hit.textLen < 40 && !hit.hasComponents) insertion = ` role="img" aria-label="${label.replace(/"/g, '&quot;')}"`
    else if (hit.textLen === 0 && !hit.hasComponents) insertion = ' aria-hidden="true"'
    else continue
    const tag = hit.tag.replace(/>$/, `${insertion}>`)
    next = next.slice(0, hit.index) + tag + next.slice(hit.index + hit.tag.length)
    changed += 1
    stat.imageSemantics = (stat.imageSemantics || 0) + 1
  }
  return { text: next, changed }
}


// ---------- mixed-font строки (m2: «Практика» Great Vibes 36 + Golos 20 и др.)
// Кодоген берёт первый сегмент на весь текст — вторая часть рендерится чужим шрифтом.
// data/rich-text-runs.json описывает сегменты из Figma (шрифт/размер/line-height).
const RICH_RUNS = existsSync(join(SITE, 'data/rich-text-runs.json')) ? JSON.parse(read(join(SITE, 'data/rich-text-runs.json'))) : []
const FONT_CLASS = { 'Great Vibes': "font-['Great_Vibes']", 'Golos Text': "font-['Golos_Text']", 'Lora': "font-['Lora']", 'Literata': "font-['Literata']" }

function applyRichTextRuns(text) {
  let next = text
  let changed = 0
  for (const entry of RICH_RUNS) {
    const found = findTextElement(next, entry.node)
    if (!found) continue
    const spans = entry.runs.map((run) => {
      const font = FONT_CLASS[run.font] || ''
      // сдвиг по вертикали — relative top: vertical-align на инлайн-боксе с большим line-height
      // в Chromium не сдвигает глифы так, как это делает Figma
      const va = run.offsetTopPx ? ` style={{ position: 'relative', top: '${run.offsetTopPx}px' }}` : ''
      return `<span className="${font} text-[${run.size}px] leading-[${run.lineHeightPx}px]"${va}>${jsxStr(run.text)}</span>`
    }).join('')
    const cleanAttrs = found.attrs.replace(/\s*style=\{\{[^}]*\}\}/, '')
    const replacement = `<div${cleanAttrs} style={{ width: '${entry.width}px', whiteSpace: 'pre-wrap' }}>${spans}</div>`
    next = next.slice(0, found.openStart) + replacement + next.slice(found.contentEnd + 4)
    changed += 1
    stat.richRuns = (stat.richRuns || 0) + 1
  }
  return { text: next, changed }
}


// ---------- форма booking: статический блок кодогена → интерактивная BookingForm
// Разметка и data-node сохраняются 1:1 (пиксели не меняются), поля становятся настоящими
// input/textarea с валидацией и отправкой в канал из data/form-config.json.
function applyBookingForm(text, file) {
  if (!text.includes('data-node="8337"')) return { text, changed: false }
  // обёртка блока — <div ... data-node="8337">…</div>; заменяем весь блок на <BookingForm />
  const openRe = /<(div)((?:[^>"]|"[^"]*")*data-node="8337"(?:[^>"]|"[^"]*")*)>/
  const m = openRe.exec(text)
  if (!m) return { text, changed: false }
  const openEnd = m.index + m[0].length
  const end = findElementEnd(text, openEnd, m[1])
  if (!end) return { text, changed: false }
  let out = text.slice(0, m.index) + '<BookingForm />' + text.slice(end.closeEnd)
  if (!out.includes('BookingForm.jsx')) {
    const rel = relative(dirname(file), join(SRC, 'interactive/components/BookingForm.jsx')).replace(/\\/g, '/')
    const spec = rel.startsWith('.') ? rel : `./${rel}`
    const lines = out.split('\n')
    let insertAt = 0
    while (insertAt < lines.length && /^\s*(\/\/|\/\*)/.test(lines[insertAt])) insertAt += 1
    lines.splice(insertAt, 0, `import { BookingForm } from '${spec}'`)
    out = lines.join('\n')
  }
  return { text: out, changed: true }
}


/** Снять ошибочные aria-hidden="true" с контейнеров, внутри которых JSX-компоненты или текст
 * (старая версия патча помечала такие элементы декоративными — внутри мог быть интерактив). */
function stripWrongAriaHidden(text) {
  let next = text
  let changed = 0
  const re = /<(div|section|header|footer|span)((?:[^>"]|"[^"]*")*?)( aria-hidden="true")((?:[^>"]|"[^"]*")*)>/g
  const hits = []
  let m
  while ((m = re.exec(next))) {
    const openEnd = m.index + m[0].length
    const end = findElementEnd(next, openEnd, m[1])
    if (!end) continue
    const inner = next.slice(openEnd, end.closeStart)
    const hasComponents = /<[A-Z]/.test(inner)
    const textLen = inner.replace(/<[^>]*>/g, '').replace(/\{[^{}]*\}/g, '').replace(/\s+/g, ' ').trim().length
    if (hasComponents || textLen > 0) hits.push({ start: m.index, end: openEnd, tag: m[0] })
  }
  for (const hit of hits.reverse()) {
    const cleaned = hit.tag.replace(' aria-hidden="true"', '')
    next = next.slice(0, hit.start) + cleaned + next.slice(hit.end)
    changed += 1
  }
  return { text: next, changed }
}


/** Убрать пропуски уровней заголовков: если после h1 идёт сразу h3/h4 — повысить его до h2.
 *  Работает по JSX-файлу (после всех промоушенов), максимум один апгрейд на файл. */
function fixHeadingOrder(text) {
  const openRe = /<(h[1-6])\b((?:[^>"]|"[^"]*")*)>/g
  const heads = []
  let m
  while ((m = openRe.exec(text))) heads.push({ level: Number(m[1][1]), index: m.index, tag: m[1], attrs: m[2], openEnd: m.index + m[0].length })
  let seen = 1
  for (const h of heads) {
    if (h.level > seen + 1) {
      const end = findElementEnd(text, h.openEnd, h.tag)
      if (!end) return { text, changed: false }
      const inner = text.slice(h.openEnd, end.closeStart)
      const promoted = text.slice(0, h.index) + `<h2${h.attrs}>` + inner + '</h2>' + text.slice(end.closeEnd)
      return { text: promoted, changed: true }
    }
    if (h.level > seen) seen = h.level
  }
  return { text, changed: false }
}


// ---------- точечные геометрические фиксы (локальные пятна кодогена)
const GEOMETRY_FIXES = existsSync(join(SITE, 'data/geometry-fixes.json')) ? JSON.parse(read(join(SITE, 'data/geometry-fixes.json'))) : []

function applyGeometryFixes(text) {
  let next = text
  let changed = 0
  for (const fix of GEOMETRY_FIXES) {
    const openRe = new RegExp(`(className="[^"]*")((?:[^>"]|"[^"]*")*?data-node="${fix.node}")`)
    const m = openRe.exec(next)
    if (!m) continue
    let cls = m[1]
    const original = cls
    for (const [from, to] of fix.replace || []) cls = cls.split(from).join(to)
    if (cls === original) continue
    next = next.slice(0, m.index) + cls + m[2] + next.slice(m.index + m[0].length)
    changed += 1
    stat.geometryFixes = (stat.geometryFixes || 0) + 1
  }
  return { text: next, changed }
}


// ---------- переносы строк в заголовках по макету (кодоген склеивает \n в пробел)
const TEXT_BREAKS = existsSync(join(SITE, 'data/text-breaks.json')) ? JSON.parse(read(join(SITE, 'data/text-breaks.json'))) : []

function applyTextBreaks(text) {
  let next = text
  let changed = 0
  for (const fix of TEXT_BREAKS) {
    const openRe = new RegExp(`<(h[1-6]|p|div|span)\\b((?:[^>"]|"[^"]*")*data-node="${fix.node}"(?:[^>"]|"[^"]*")*)>`)
    const m = openRe.exec(next)
    if (!m) continue
    const end = findElementEnd(next, m.index + m[0].length, m[1])
    if (!end) continue
    const inner = next.slice(m.index + m[0].length, end.closeStart)
    if (!inner.includes(fix.before) || inner.includes(fix.insert + fix.before)) continue
    const replaced = inner.replace(fix.before, fix.insert + fix.before)
    next = next.slice(0, m.index + m[0].length) + replaced + next.slice(end.closeStart)
    changed += 1
    stat.textBreaks = (stat.textBreaks || 0) + 1
  }
  return { text: next, changed }
}

// ---------- обход файлов
const walk = (dir) => {
  const out = []
  for (const entry of readdirSyncSafe(dir)) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'fixtures') continue // QA-эталоны: только чистая кодогенерация
      out.push(...walk(p))
    } else if (entry.name === 'FixturesPage.jsx') continue
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
  if (isHeader) {
    const t = read(file)
    const gap = fixHeaderGap(t)
    let next = gap.text
    const comp = dropGapCompensations(next)
    next = comp.text
    if (gap.changed || comp.changed) {
      write(file, next)
      stat.gapFixes = (stat.gapFixes || 0) + gap.changed
      stat.compFixes = (stat.compFixes || 0) + comp.changed
    }
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

// ---------- огромные gap-хаки в flex-рядах.
// ВАЖНО: хак gap-[430px] ломает только страницы story (там ряд из трёх блоков распределяется
// justify-between); на book-chapter/intro/technique тот же ряд из двух блоков этим gap'ом
// позиционируется корректно — поэтому фикс скоупим на story.
for (const file of files) {
  if (!file.includes('library-book-chapter-story/')) continue
  const t = read(file)
  const huge = fixHugeGaps(t)
  if (huge.changed) { write(file, huge.text); stat.hugeGaps = (stat.hugeGaps || 0) + huge.changed }
}

// ---------- фикс-боксы текста
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const deduped = dedupeBoxFixStyles(t)
  const boxed = applyBoxFixes(deduped.text)
  if (deduped.changed || boxed.changed) write(file, boxed.text)
}

// ---------- очистка накопленных дублей в inline-стилях
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const d = dedupeBoxFixStyles(t)
  if (d.changed) write(file, d.text)
}

// ---------- фикс-боксы текста (Figma textAutoResize=NONE)
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const deduped = dedupeBoxFixStyles(t)
  const boxed = applyBoxFixes(deduped.text)
  if (deduped.changed || boxed.changed) write(file, boxed.text)
}

// ---------- снять ошибочные aria-hidden
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const cleaned = stripWrongAriaHidden(t)
  if (cleaned.changed) { write(file, cleaned.text); stat.ariaCleanup = (stat.ariaCleanup || 0) + cleaned.changed }
}

// ---------- семантика изображений
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const imgs = applyImageSemantics(t)
  if (imgs.changed) write(file, imgs.text)
}

// ---------- семантика: h2/h3
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const heads = applyHeadingTags(t)
  const fixed = fixHeadingOrder(heads.text)
  if (heads.changed || fixed.changed) write(file, fixed.text)
  if (fixed.changed) stat.headingOrder = (stat.headingOrder || 0) + 1
}

// ---------- форма booking
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const form = applyBookingForm(t, file)
  if (form.changed) { write(file, form.text); stat.bookingForm = (stat.bookingForm || 0) + 1 }
}

// ---------- точечные геометрические фиксы
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const fixed = applyGeometryFixes(t)
  if (fixed.changed) write(file, fixed.text)
}

// ---------- переносы строк в заголовках
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const fixed = applyTextBreaks(t)
  if (fixed.changed) write(file, fixed.text)
}

// ---------- mixed-font runs
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const runs = applyRichTextRuns(t)
  if (runs.changed) write(file, runs.text)
}

// ---------- rich text: списки и абзацные интервалы
for (const file of files) {
  if (!/\.jsx$/.test(file)) continue
  const t = read(file)
  const rich = applyRichText(t, file)
  if (rich.changed) write(file, rich.text)
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
  `landmarks=${stat.landmarks}, h1=${stat.h1}, скрытых h1=${stat.hiddenH1}, якоря=${stat.anchors}, ` +
  `gap-фиксов в шапке=${stat.gapFixes || 0}, компенсаций убрано=${stat.compFixes || 0}, huge-gap=${stat.hugeGaps || 0}, rich-text=${stat.richText || 0}, box-fixes=${stat.boxFixes || 0}, heading-tags=${stat.headingTags || 0}, image-семантика=${stat.imageSemantics || 0}, aria-очистка=${stat.ariaCleanup || 0}, heading-order=${stat.headingOrder || 0}, mixed-font=${stat.richRuns || 0}, booking-form=${stat.bookingForm || 0}, geom-fixes=${stat.geometryFixes || 0}, text-breaks=${stat.textBreaks || 0}`)
