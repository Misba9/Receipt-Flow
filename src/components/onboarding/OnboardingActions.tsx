import type { ReactNode } from 'react'
import { cn } from '@/utils'

type OnboardingActionsProps = {
  children: ReactNode
  className?: string
}

/** Stacks full-width on mobile; row on larger screens. */
export function OnboardingActions({ children, className }: OnboardingActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between',
        '[&>button]:w-full sm:[&>button]:w-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}
