import { Badge } from '@/components/ui/Badge'
import { isEmailDevelopmentMode } from '@/services/email'

export function DemoModeEmailBadge() {
  if (!isEmailDevelopmentMode()) return null

  return (
    <div className="inline-flex flex-col items-start gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950/40">
      <Badge variant="warning">Demo Mode</Badge>
      <p className="text-xs text-amber-800 dark:text-amber-200">
        Email sending disabled
      </p>
    </div>
  )
}
