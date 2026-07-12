import { ONBOARDING_STEPS } from '@/services/onboarding'
import { cn } from '@/utils'

type OnboardingProgressProps = {
  step: number
}

export function OnboardingProgress({ step }: OnboardingProgressProps) {
  const progress = Math.round((step / ONBOARDING_STEPS.length) * 100)
  const current = ONBOARDING_STEPS[step - 1]

  return (
    <div className="w-full space-y-4" aria-label={`Onboarding progress: step ${step} of ${ONBOARDING_STEPS.length}`}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Step {step} of {ONBOARDING_STEPS.length}
          </p>
          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-surface-900 sm:text-2xl dark:text-surface-50">
            {current?.title}
          </h1>
          <p className="mt-1 text-sm text-surface-500">{current?.description}</p>
        </div>
        <p className="shrink-0 text-sm font-medium tabular-nums text-surface-500">
          {progress}%
        </p>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Onboarding completion"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mobile: compact dots */}
      <ol className="flex items-center justify-between gap-1 sm:hidden" aria-hidden>
        {ONBOARDING_STEPS.map((item) => {
          const active = item.id === step
          const done = item.id < step
          return (
            <li
              key={item.id}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors duration-300',
                active && 'bg-brand-600',
                done && 'bg-emerald-500',
                !active && !done && 'bg-surface-200 dark:bg-surface-800',
              )}
            />
          )
        })}
      </ol>

      {/* Tablet+ : labeled steps */}
      <ol className="hidden gap-2 sm:grid sm:grid-cols-4">
        {ONBOARDING_STEPS.map((item) => {
          const active = item.id === step
          const done = item.id < step
          return (
            <li
              key={item.id}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'rounded-xl border px-2 py-2.5 text-center text-[11px] font-medium leading-tight transition-colors duration-200',
                active &&
                  'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-300',
                done &&
                  'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
                !active &&
                  !done &&
                  'border-surface-200 text-surface-400 dark:border-surface-800',
              )}
            >
              {item.title}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
