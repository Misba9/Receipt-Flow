import { Link2, Mail, Share2 } from 'lucide-react'
import { useState } from 'react'
import { SEO_SITE_URL, absoluteUrl } from '@/lib/seo'
import { cn } from '@/utils'

type BlogShareButtonsProps = {
  title: string
  path: string
  className?: string
}

export function BlogShareButtons({ title, path, className }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const url =
    typeof window !== 'undefined'
      ? absoluteUrl(path, window.location.origin || SEO_SITE_URL)
      : absoluteUrl(path, SEO_SITE_URL)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const buttonClass =
    'inline-flex h-10 items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 text-sm font-medium text-surface-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800'

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <p className="mr-1 flex items-center gap-1.5 text-sm font-medium text-surface-600">
        <Share2 className="h-4 w-4" aria-hidden />
        Share
      </p>
      <a
        className={buttonClass}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <a
        className={buttonClass}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <a
        className={buttonClass}
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
      >
        <Mail className="h-4 w-4" aria-hidden />
        Email
      </a>
      <button type="button" className={buttonClass} onClick={() => void copyLink()}>
        <Link2 className="h-4 w-4" aria-hidden />
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
