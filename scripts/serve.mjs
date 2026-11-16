#!/usr/bin/env node
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
const root = resolve(process.cwd())
const port = Number(process.argv[2] || process.env.PORT || 4300)
const MIME = { '.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon' }
const server = createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url || '/', 'http://127.0.0.1').pathname)
  let file = join(root, pathname.replace(/^\/+/, ''))
  if (!file.startsWith(root + '/') && file !== root) { res.writeHead(403); res.end('forbidden'); return }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  if (!existsSync(file)) { res.writeHead(404); res.end('not found'); return }
  res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream', 'cache-control':'no-store' })
  res.end(readFileSync(file))
})
server.listen(port, '127.0.0.1', () => console.log(`syntonia-site: http://127.0.0.1:${port}/`))
