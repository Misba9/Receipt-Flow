import { getInitials } from '@/lib/format'
import { cn } from '@/utils'

type AvatarProps = {
  name: string
  className?: string
}

const palette = [
  'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
]

function colorForName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
        colorForName(name),
        className,
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  )
}
