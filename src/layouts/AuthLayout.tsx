import type { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { Card, CardDescription, CardTitle, ThemeToggle } from '@/components/ui'
import { APP_NAME, cn } from '@/utils'

type AuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  /** Wider card for denser forms (default ~ max-w-md / 28rem). */
  size?: 'md' | 'lg'
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
  className,
  size = 'md',
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-dvh items-center justify-center overflow-x-hidden',
        'bg-[radial-gradient(circle_at_top,_rgba(26,115,245,0.08),_transparent_42%),linear-gradient(to_bottom,#f8fafc,#f1f5f9)]',
        'px-4 py-8 sm:px-6 sm:py-12',
        'dark:bg-[radial-gradient(circle_at_top,_rgba(26,115,245,0.14),_transparent_40%),linear-gradient(to_bottom,#020617,#0f172a)]',
        className,
      )}
    >
      <div className="absolute right-3 top-3 sm:right-5 sm:top-5">
        <ThemeToggle />
      </div>

      <Card
        className={cn(
          'w-full motion-safe:animate-[fadeSlideIn_0.3s_ease-out]',
          size === 'lg' ? 'max-w-xl' : 'max-w-lg',
          'border-surface-200/80 p-5 shadow-sm sm:p-8',
          'dark:border-surface-800',
        )}
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm shadow-brand-600/25">
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-surface-400">
              {APP_NAME}
            </p>
            <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
            <CardDescription className="mt-1.5 text-sm leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </div>

        {children}

        {footer ? (
          <div className="mt-6 border-t border-surface-100 pt-5 text-center text-sm text-surface-500 dark:border-surface-800 sm:mt-8">
            {footer}
          </div>
        ) : null}
      </Card>
    </div>
  )
}
