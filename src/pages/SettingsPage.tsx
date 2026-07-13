import { Building2 } from 'lucide-react'
import { BrandingSettingsCard } from '@/components/settings/BrandingSettingsCard'
import { CompanyProfileCard } from '@/components/settings/CompanyProfileCard'
import { LocalizationSettingsCard } from '@/components/settings/LocalizationSettingsCard'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Card, EmptyState, Spinner } from '@/components/ui'
import { useCompanySettings } from '@/services/settings/hooks'

export function SettingsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useCompanySettings()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Settings"
        description="Manage your company profile, invoicing defaults, and branding."
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {!data?.canEdit && data ? (
          <Alert variant="info">
            Only company owners and admins can edit company settings.
          </Alert>
        ) : null}

        {isLoading ? (
          <Card className="flex items-center justify-center gap-3 p-8 py-16">
            <Spinner className="h-6 w-6" />
            <span className="text-sm text-surface-500">
              Loading company settings…
            </span>
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
          <>
            <CompanyProfileCard settings={data} />
            <LocalizationSettingsCard settings={data} />
            <BrandingSettingsCard settings={data} />
          </>
        ) : null}
      </div>
    </div>
  )
}
