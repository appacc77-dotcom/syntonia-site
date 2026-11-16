#!/usr/bin/env node
/**
 * GitHub Pages project-site base path: URL /syntonia-site/<route>.
 * The m2 build is a root-based SPA and reads window.location.pathname directly.
 * Patch the one route lookup in the built bundle so /syntonia-site/quiz.html
 * resolves to the quiz route. Idempotent; run after import from m2 and before publish.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const BASE = '/syntonia-site'
const needle = 'Ai[window.location.pathname]||Page'
const replacement = `Ai[(window.location.pathname.startsWith("${BASE}")?window.location.pathname.slice(${BASE.length})||"/":window.location.pathname)]||Page`
let patched = 0
for (const name of readdirSync('assets').filter((n) => n.endsWith('.js'))) {
  const file = join('assets', name)
  let code = readFileSync(file, 'utf8')
  if (code.includes(replacement)) { patched += 1; continue }
  if (!code.includes(needle)) { console.warn(`patch-base: нет route lookup в ${file}`); continue }
  code = code.replace(needle, replacement)
  writeFileSync(file, code)
  patched += 1
}
console.log(`patch-base: patched ${patched} bundle(s) for ${BASE}`)
if (!patched) process.exit(1)
