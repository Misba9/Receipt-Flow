/**
 * Generates WebP (+ JPEG fallbacks) for marketing images.
 * Run: node scripts/optimize-images.mjs
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const blogDir = path.join(publicDir, 'blog')
const widths = [480, 768, 1200]

async function writeVariants(input, baseName, outDir, { heightRatio } = {}) {
  await mkdir(outDir, { recursive: true })
  const image = sharp(input, { density: 150 })
  const meta = await image.metadata()

  for (const width of widths) {
    const height = heightRatio
      ? Math.round(width * heightRatio)
      : meta.height && meta.width
        ? Math.round((width / meta.width) * meta.height)
        : undefined

    const resize = image.clone().resize({
      width,
      height,
      fit: 'cover',
      position: 'centre',
    })

    const webpPath = path.join(outDir, `${baseName}-${width}.webp`)
    const jpgPath = path.join(outDir, `${baseName}-${width}.jpg`)

    await resize.clone().webp({ quality: 78 }).toFile(webpPath)
    await resize.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgPath)
    console.log('wrote', path.relative(root, webpPath))
  }

  // Primary full-size WebP (1200) also as un-suffixed convenience for OG-adjacent use
  const primary = image.clone().resize({
    width: 1200,
    height: heightRatio ? Math.round(1200 * heightRatio) : undefined,
    fit: 'cover',
    position: 'centre',
  })
  await primary.clone().webp({ quality: 80 }).toFile(path.join(outDir, `${baseName}.webp`))
  console.log('wrote', path.relative(root, path.join(outDir, `${baseName}.webp`)))
}

async function main() {
  // OG image
  const og = path.join(publicDir, 'og-image.jpg')
  await writeVariants(await readFile(og), 'og-image', publicDir, {
    heightRatio: 630 / 1200,
  })

  // Blog SVGs → raster WebP/JPEG
  const svgs = (await readdir(blogDir)).filter((f) => f.endsWith('.svg'))
  for (const file of svgs) {
    const base = file.replace(/\.svg$/, '')
    const svg = await readFile(path.join(blogDir, file))
    await writeVariants(svg, base, blogDir, { heightRatio: 630 / 1200 })
  }

  // Manifest of generated assets for the image sitemap / OptimizedImage helpers
  const manifest = {
    generatedAt: new Date().toISOString(),
    widths,
    og: {
      alt: 'Billing Software for Small Businesses | ReceiptFlow',
      width: 1200,
      height: 630,
      webp: '/og-image.webp',
      fallback: '/og-image.jpg',
      srcSetWebp: widths.map((w) => `/og-image-${w}.webp ${w}w`).join(', '),
      srcSetJpeg: widths.map((w) => `/og-image-${w}.jpg ${w}w`).join(', '),
    },
    blog: Object.fromEntries(
      svgs.map((file) => {
        const base = file.replace(/\.svg$/, '')
        return [
          base,
          {
            width: 1200,
            height: 630,
            svg: `/blog/${base}.svg`,
            webp: `/blog/${base}.webp`,
            fallback: `/blog/${base}-1200.jpg`,
            srcSetWebp: widths.map((w) => `/blog/${base}-${w}.webp ${w}w`).join(', '),
            srcSetJpeg: widths.map((w) => `/blog/${base}-${w}.jpg ${w}w`).join(', '),
          },
        ]
      }),
    ),
  }

  await writeFile(
    path.join(publicDir, 'image-manifest.json'),
    JSON.stringify(manifest, null, 2),
  )
  console.log('wrote public/image-manifest.json')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
