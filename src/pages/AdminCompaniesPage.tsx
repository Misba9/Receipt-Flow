import { AdminCompaniesTable } from '@/components/admin/AdminCompaniesTable'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Card, SearchInput } from '@/components/ui'
import { useAdminCompanies } from '@/services/admin'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useState } from 'react'

export function AdminCompaniesPage() {
  const { data = [], isLoading, isError, error } = useAdminCompanies()
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search.trim().toLowerCase(), 200)

  const filtered = debounced
    ? data.filter((company) => {
        const haystack = [
          company.name,
          company.email ?? '',
          company.subscriptionStatus,
          company.subscriptionPlan ?? '',
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(debounced)
      })
    : data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="View tenants, subscription status, disable or delete workspaces."
      />

      {isError ? (
        <Alert>
          {error instanceof Error ? error.message : 'Unable to load companies.'}
        </Alert>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-surface-100 p-4 dark:border-surface-800">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search companies…"
            className="max-w-md"
          />
        </div>
        <AdminCompaniesTable companies={filtered} loading={isLoading} />
      </Card>
    </div>
  )
}
