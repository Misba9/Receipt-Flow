/**
 * Post-build: write per-route HTML shells with correct title/description/canonical
 * so crawlers that don't execute JS still see accurate meta (Vercel serves these
 * before the SPA rewrite when the file exists).
 *
 * Run after `vite build`: node scripts/prerender-meta.mjs
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const SITE = 'https://receiptflow.velonerp.com'
const root = process.cwd()
const distIndex = join(root, 'dist/index.html')

function extractRoutes() {
  const src = readFileSync(
    join(root, 'src/content/public-route-meta.ts'),
    'utf8',
  )
  const routes = [{ path: '/', title: '', description: '' }]
  // Hub + content entries with title/description nearby
  const blocks = src.split(/\n  \{\n/).slice(1)
  for (const chunk of blocks) {
    const path = chunk.match(/path:\s*'([^']+)'/)?.[1]
      ?? chunk.match(/"path":\s*"([^"]+)"/)?.[1]
    const title = chunk.match(/title:\s*'([^']+)'/)?.[1]
      ?? chunk.match(/"title":\s*"([^"]+)"/)?.[1]
    const description = chunk.match(/description:\s*\n?\s*'([^']+)'/)?.[1]
      ?? chunk.match(/"description":\s*"([^"]+)"/)?.[1]
    if (path && title && description) {
      routes.push({ path, title, description })
    }
  }
  // Homepage from landing-seo
  try {
    const landing = readFileSync(
      join(root, 'src/components/landing/landing-seo.ts'),
      'utf8',
    )
    const title = landing.match(/title:\s*'([^']+)'/)?.[1]
    const description = landing.match(/description:\s*\n?\s*'([^']+)'/)?.[1]
    if (title && description) {
      routes[0] = { path: '/', title, description }
    }
  } catch {
    /* keep placeholder */
  }
  return routes
}

function escapeAttr(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
}

function injectMeta(html, { path, title, description }) {
  const url = path === '/' ? `${SITE}/` : `${SITE}${path}`
  let out = html
  out = out.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escapeAttr(title)}</title>`,
  )
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  )
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
  )
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
  )
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
  )
  if (path !== '/') {
    // Private/auth should stay noindex if ever prerendered — public only here
    out = out.replace(
      /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="robots" content="index, follow" />`,
    )
  }
  return out
}

if (!existsSync(distIndex)) {
  console.error('dist/index.html missing — run vite build first')
  process.exit(1)
}

const template = readFileSync(distIndex, 'utf8')
const routes = extractRoutes().filter((r) => r.title && r.description)
let written = 0

for (const route of routes) {
  const html = injectMeta(template, route)
  if (route.path === '/') {
    writeFileSync(distIndex, html)
    written += 1
    continue
  }
  const outPath = join(root, 'dist', route.path.replace(/^\//, ''), 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  written += 1
}

console.log(`prerendered meta shells: ${written}`)
