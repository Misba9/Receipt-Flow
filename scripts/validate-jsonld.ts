/**
 * Local smoke test for JSON-LD builders.
 * Run: npx vite-node scripts/validate-jsonld.ts
 */
import { buildPageJsonLd } from '../src/lib/jsonld/pages'
import { validateJsonLdGraph } from '../src/lib/jsonld/validate'

const site = 'https://receiptflow.velonerp.com'
const paths = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/invoices/abc',
  '/settings',
]

let failed = false
for (const path of paths) {
  const graph = buildPageJsonLd(path, site)
  const result = validateJsonLdGraph(graph)
  const types = [
    ...new Set(
      graph['@graph'].flatMap((n) =>
        Array.isArray(n['@type']) ? n['@type'] : [n['@type']],
      ),
    ),
  ]
  const status = result.ok ? 'OK' : 'FAIL'
  console.log(
    `${status} ${path} → ${types.join(', ')} (errors=${result.errors.length}, warnings=${result.warnings.length})`,
  )
  if (!result.ok) {
    failed = true
    console.error(result.errors)
  }
}

if (failed) process.exit(1)
