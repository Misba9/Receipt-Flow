import { Link } from 'react-router-dom'
import { CircleAlert } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { getProfileCompletion } from '@/services/onboarding'
import { useCompanySettings } from '@/services/settings/hooks'
import { paths } from '@/lib/paths'

export function ProfileCompletionCard() {
  const { data } = useCompanySettings()
  if (!data) return null

  const { percent, isComplete } = getProfileCompletion(data)
  if (isComplete) return null

  return (
    <Card className="flex flex-col gap-4 border-amber-200 bg-amber-50/70 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900 dark:bg-amber-950/30">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
          <CircleAlert className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-surface-900 dark:text-surface-50">
            Complete your profile
          </p>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
            Your workspace is {percent}% complete. Add a logo, GST, website, or
            address to look more professional on invoices.
          </p>
          <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900">
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
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
