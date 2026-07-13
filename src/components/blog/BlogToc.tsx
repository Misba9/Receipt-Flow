import { useEffect, useState } from 'react'
import { cn } from '@/utils'

export type TocItem = {
  id: string
  label: string
}

export function BlogToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  useEffect(() => {
    if (!items.length) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-2xl border border-surface-200 bg-surface-50 p-5"
    >
      <p className="text-xs font-semibold tracking-wide text-surface-500 uppercase">
        On this page
      </p>
      <ol className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block text-sm leading-snug transition-colors',
                activeId === item.id
                  ? 'font-semibold text-brand-700'
                  : 'text-surface-600 hover:text-surface-900',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
