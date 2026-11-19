#!/usr/bin/env node
/**
 * build-icon-overrides — векторные override-правила для иконок, у которых в codegen-слепке
 * не было SVG (fallback — div+border аппроксимация, визуально «толще» и со смещениями).
 *
 * Источник: site/data/icon-overrides.json (node → SVG-ассет из Figma, сгенерирован из id-map)
 *          site/public/icons/vec/*.svg (экспорт Figma)
 * Результат: site/src/generated/vector-extra.css + копии SVG в <repo>/assets/vec-*.svg
 *            (publish переписывает /assets/… на относительные пути, как и для snap-*).
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = resolve(SITE, '..')
const DATA = join(SITE, 'data/icon-overrides.json')
if (!existsSync(DATA)) {
  console.log('icon-overrides: нет data/icon-overrides.json — пропуск')
  process.exit(0)
}
const entries = JSON.parse(readFileSync(DATA, 'utf8'))
const css = ['/* vector-extra: SVG-иконки из Figma для узлов без override в codegen-слепке */']
const copied = new Set()
for (const e of entries) {
  // color-режим: сплошная заливка (точки/маркеры) — правильный цвет из golden
  if (e.color) {
    css.push(`[data-node="${e.node}"]{background-image:none!important;background-color:${e.color}!important;border-radius:9999px!important;outline:0!important;box-shadow:none!important;border:0!important}`)
    continue
  }
  const src = join(SITE, 'public/icons/vec', `${e.asset}.svg`)
  if (!existsSync(src)) continue
  const assetFile = `vec-${e.asset}.svg`
  if (!copied.has(assetFile)) {
    copyFileSync(src, join(REPO, 'assets', assetFile))
    copied.add(assetFile)
  }
  const transform = e.rotate ? `transform:rotate(${e.rotate}deg);` : ''
  css.push(
    `[data-node="${e.node}"]{background-image:url(/assets/${assetFile});background-repeat:no-repeat;background-position:center;background-size:contain;background-color:transparent!important;outline:0!important;box-shadow:none!important;border:0!important;${transform}}`,
    `[data-node="${e.node}"]>*{display:none!important}`,
  )
}
writeFileSync(join(SITE, 'src/generated/vector-extra.css'), css.join('\n') + '\n')
console.log(`icon-overrides: ${entries.length} узлов, ${copied.size} SVG → assets/vec-*.svg`)
