#!/usr/bin/env node
/** Собирает .pages/ только из рабочей копии; reference/, prompts/, scripts/, metadata исключены. */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
const root = resolve(process.cwd())
const out = join(root, '.pages')
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true })
const skip = new Set(['.git','.github','.pages','reference','prompts','scripts','node_modules','site.json','publish-site.json','VERSIONS.md','CHANGELOG.md','README.md','.gitignore','.nojekyll'])
for (const name of readdirSync(root)) {
  if (skip.has(name)) continue
  const path = join(root, name)
  const stat = statSync(path)
  if (stat.isDirectory()) cpSync(path, join(out, name), { recursive: true })
  else if (stat.isFile()) cpSync(path, join(out, name))
}
cpSync(join(root, '.nojekyll'), join(out, '.nojekyll'))
console.log(`prepare-pages: ${readdirSync(out).length} entries → .pages/`)
