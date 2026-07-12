import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

type PaginationProps = {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  if (total === 0) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-surface-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-surface-800',
        className,
      )}
    >
      <p className="text-sm text-surface-500 dark:text-surface-400">
        Showing{' '}
        <span className="font-medium text-surface-700 dark:text-surface-200">
          {from}
        </span>
        –
        <span className="font-medium text-surface-700 dark:text-surface-200">
          {to}
        </span>{' '}
        of{' '}
        <span className="font-medium text-surface-700 dark:text-surface-200">
          {total}
        </span>
      </p>

      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          className="min-w-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <span className="min-w-14 text-center text-sm text-surface-600 dark:text-surface-300">
          {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className="min-w-0"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
