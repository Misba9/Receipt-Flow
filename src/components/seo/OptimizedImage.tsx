import { cn } from '@/utils'

export type OptimizedImageProps = {
  src: string
  alt: string
  width: number
  height: number
  /** WebP primary source (single URL). */
  webpSrc?: string
  /** Responsive WebP srcset. */
  webpSrcSet?: string
  /** Fallback raster srcset (JPEG/PNG). */
  srcSet?: string
  sizes?: string
  className?: string
  /** Default lazy; use eager for LCP/hero images. */
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Responsive image with WebP `<picture>`, intrinsic dimensions, and lazy loading.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  webpSrc,
  webpSrcSet,
  srcSet,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
  className,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
}: OptimizedImageProps) {
  const img = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={cn(className)}
    />
  )

  if (!webpSrc && !webpSrcSet) return img

  return (
    <picture>
      {(webpSrcSet || webpSrc) && (
        <source
          type="image/webp"
          srcSet={webpSrcSet || webpSrc}
          sizes={webpSrcSet ? sizes : undefined}
        />
      )}
      {img}
    </picture>
  )
}
