import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils'

type PageLoaderProps = {
  className?: string
  label?: string
  fullScreen?: boolean
}

/** Shared loading state for route Suspense and auth gates. */
export function PageLoader({
  className,
  label = 'Loading…',
  fullScreen = true,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 bg-surface-50 dark:bg-surface-950',
        fullScreen ? 'min-h-screen' : 'min-h-[40vh] py-16',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-surface-500">{label}</p>
    </div>
  )
}
