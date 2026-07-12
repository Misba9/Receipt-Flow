import { useState, type ReactNode } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

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
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <Button
        type="button"
        variant={variant}
        className={className}
        disabled={isExporting}
        onClick={() => void handleClick()}
      >
        {isExporting ? (
          <Spinner className="h-4 w-4" />
        ) : (
          (icon ?? <FileSpreadsheet className="h-4 w-4" />)
        )}
        {isExporting ? 'Exporting…' : label}
      </Button>
      {error ? (
        <p className="max-w-xs text-right text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
