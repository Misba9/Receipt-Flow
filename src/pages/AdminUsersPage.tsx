import { useState } from 'react'
import { AdminUsersTable } from '@/components/admin/AdminUsersTable'
import { PageHeader } from '@/layouts/PageHeader'
import { Alert, Card, SearchInput } from '@/components/ui'
import { useAdminUsers } from '@/services/admin'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export function AdminUsersPage() {
  const { data = [], isLoading, isError, error } = useAdminUsers()
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search.trim().toLowerCase(), 200)

  const filtered = debounced
    ? data.filter((user) => {
        const haystack = [
          user.fullName ?? '',
          user.email ?? '',
          user.companyName,
          user.role,
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(debounced)
      })
    : data

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="All platform users across every company."
      />

      {isError ? (
        <Alert>
          {error instanceof Error ? error.message : 'Unable to load users.'}
        </Alert>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-surface-100 p-4 dark:border-surface-800">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users by name, email, or company…"
            className="max-w-md"
          />
        </div>
        <AdminUsersTable users={filtered} loading={isLoading} />
      </Card>
    </div>
  )
}
