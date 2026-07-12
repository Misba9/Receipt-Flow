import { useState, type ReactNode } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils'

type ExportButtonProps = {
  label?: string
  onExport: () => Promise<unknown>
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  icon?: ReactNode
}

export function ExportButton({
  label = 'Export Excel',
  onExport,
  variant = 'secondary',
  className,
  icon,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)
    setIsExporting(true)
    try {
      await onExport()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative shrink-0">
      <Button
        type="button"
        variant={variant}
        className={cn(className)}
        disabled={isExporting}
        onClick={() => void handleClick()}
      >
        {isExporting ? (
          <Spinner className="h-4 w-4" />
        ) : (
          (icon ?? <FileSpreadsheet className="h-4 w-4" />)
        )}
        <span className="hidden sm:inline">
          {isExporting ? 'Exporting…' : label}
        </span>
        <span className="sm:hidden">{isExporting ? '…' : 'Export'}</span>
      </Button>
      {error ? (
        <p className="absolute top-full right-0 z-10 mt-1 max-w-[16rem] text-right text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
