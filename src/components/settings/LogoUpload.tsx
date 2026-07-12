import { useRef, useState } from 'react'
import { ImagePlus, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const MAX_BYTES = 2 * 1024 * 1024

type LogoUploadProps = {
  value: string | null
  disabled?: boolean
  uploading?: boolean
  onSelect: (file: File) => Promise<void> | void
  onRemove: () => Promise<void> | void
  className?: string
}

export function LogoUpload({
  value,
  disabled = false,
  uploading = false,
  onSelect,
  onRemove,
  className,
}: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File | undefined) => {
    setError(null)
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Use PNG, JPG, WebP, or SVG.')
      return
    }

    if (file.size > MAX_BYTES) {
      setError('Logo must be 2MB or smaller.')
      return
    }

    await onSelect(file)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-surface-300 bg-surface-50 dark:border-surface-700 dark:bg-surface-900">
          {value ? (
            <img
              src={value}
              alt="Company logo"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <ImagePlus className="h-8 w-8 text-surface-400" aria-hidden />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
            Company logo
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            PNG, JPG, WebP, or SVG up to 2MB. Used on invoices and your workspace.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? 'Uploading…' : value ? 'Replace logo' : 'Upload logo'}
            </Button>
            {value ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || uploading}
                onClick={() => onRemove()}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        disabled={disabled || uploading}
        onChange={(event) => {
          const file = event.target.files?.[0]
          void handleFile(file)
          event.target.value = ''
        }}
      />

      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  )
}
