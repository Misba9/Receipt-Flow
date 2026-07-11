import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui'
import { APP_NAME } from '@/lib/utils'

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences."
      />

      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Placeholder form — no business logic yet.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <Input label="Display name" placeholder="Your name" disabled />
            <Input label="Email" type="email" placeholder="you@example.com" disabled />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Application</CardTitle>
              <CardDescription>Environment metadata</CardDescription>
            </div>
          </CardHeader>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-surface-500">App name</dt>
              <dd className="font-medium">{APP_NAME}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-surface-500">Theme</dt>
              <dd className="font-medium">Use the header toggle</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
