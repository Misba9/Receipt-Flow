import type { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { Card, CardDescription, CardTitle, ThemeToggle } from '@/components/ui'
import { APP_NAME } from '@/utils'

type AuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-surface-500">
              {APP_NAME}
            </p>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>

        {children}

        {footer ? (
          <div className="mt-6 text-center text-sm text-surface-500">{footer}</div>
        ) : null}
      </Card>
    </div>
  )
}
