import { Building2 } from 'lucide-react'
import { CompanySettingsForm } from '@/components/settings/CompanySettingsForm'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Card, EmptyState, Spinner } from '@/components/ui'
import { useCompanySettings } from '@/services/settings/hooks'

export function SettingsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useCompanySettings()

  return (
    <div>
      <PageHeader
        title="Company Settings"
        description="Configure profile, branding, currency, and invoice defaults for your company."
      />

      <div className="mx-auto max-w-3xl">
        {isLoading ? (
          <Card className="flex items-center justify-center gap-3 py-16">
            <Spinner className="h-6 w-6" />
            <span className="text-sm text-surface-500">Loading company settings…</span>
          </Card>
        ) : isError ? (
          <div className="space-y-4">
            <Alert>
              {error instanceof Error
                ? error.message
                : 'Unable to load company settings.'}
            </Alert>
            <Card className="p-0">
              <EmptyState
                icon={Building2}
                title="Settings unavailable"
                description="Confirm your Supabase migrations are applied, then try again."
                action={
                  <button
                    type="button"
                    onClick={() => void refetch()}
                    className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                    disabled={isFetching}
                  >
                    Retry
                  </button>
                }
              />
            </Card>
          </div>
        ) : data ? (
          <CompanySettingsForm
            key={`${data.companyId}-${data.logoUrl ?? 'no-logo'}-${data.primaryColor}-${data.currency}-${data.timezone}-${data.invoicePrefix}`}
            settings={data}
          />
        ) : null}
      </div>
    </div>
  )
}
