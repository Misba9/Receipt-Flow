import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/utils'

type LazySectionProps = {
  children: ReactNode
  /** Approximate reserved height to limit CLS before content paints. */
  minHeight?: number | string
  className?: string
  rootMargin?: string
}

/**
 * Defers mounting below-the-fold UI until near viewport (helps LCP/INP/TBT).
 */
export function LazySection({
  children,
  minHeight = 240,
  className,
  rootMargin = '200px 0px',
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, visible])

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? children : <div aria-hidden className="w-full" />}
    </div>
  )
}
