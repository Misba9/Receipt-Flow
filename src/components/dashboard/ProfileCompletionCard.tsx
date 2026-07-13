import { Link } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import {
  getRequiredProfileCompletion,
  isWorkspaceReady,
} from '@/services/settings/profileCompletion'
import { useCompanySettings } from '@/services/settings/hooks'
import { paths } from '@/lib/paths'

export function ProfileCompletionCard() {
  const { data } = useCompanySettings()
  if (!data) return null

  const completion = getRequiredProfileCompletion(data)
  if (isWorkspaceReady(data)) return null

  return (
    <Card className="flex flex-col gap-4 border-amber-200 bg-amber-50/70 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900 dark:bg-amber-950/30">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          <CircleAlert className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-surface-900 dark:text-surface-50">
            Complete your profile
          </p>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
            Complete the required company information to start sending
            professional invoices.
          </p>
          <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900">
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{ width: `${completion.percent}%` }}
              role="progressbar"
              aria-valuenow={completion.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Required profile completion"
            />
          </div>
          <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
            {completion.done} of {completion.total} required fields ·{' '}
            {completion.percent}%
          </p>
        </div>
      </div>
      <Link to={paths.settings} className="w-full shrink-0 sm:w-auto">
        <Button variant="secondary" className="w-full sm:w-auto">
          Finish setup
        </Button>
      </Link>
    </Card>
  )
}
