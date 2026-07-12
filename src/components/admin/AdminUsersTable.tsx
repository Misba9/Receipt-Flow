import { Badge } from '@/components/ui/Badge'
import type { AdminUser } from '@/services/admin'
import { formatDate } from '@/lib/format'

type UsersTableProps = {
  users: AdminUser[]
  loading?: boolean
}

export function AdminUsersTable({ users, loading = false }: UsersTableProps) {
  if (loading) {
    return (
      <p className="px-5 py-10 text-center text-sm text-surface-500">
        Loading users…
      </p>
    )
  }

  if (users.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-surface-500">
        No users yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[56rem] text-left text-sm">
        <thead className="border-b border-surface-100 bg-surface-50/80 text-xs font-semibold tracking-wide text-surface-500 uppercase dark:border-surface-800 dark:bg-surface-950/50">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Flags</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Last sign-in</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-surface-50/70 dark:hover:bg-surface-900/60"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-surface-900 dark:text-surface-50">
                  {user.fullName || 'Unnamed'}
                </p>
                <p className="text-xs text-surface-500">{user.email ?? '—'}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-surface-800 dark:text-surface-200">
                  {user.companyName}
                </p>
                <p className="text-xs text-surface-500">
                  {user.companyActive ? 'Company active' : 'Company disabled'}
                </p>
              </td>
              <td className="px-4 py-3 capitalize">{user.role}</td>
              <td className="px-4 py-3">
                {user.isSuperAdmin ? (
                  <Badge variant="warning">Super admin</Badge>
                ) : (
                  <span className="text-xs text-surface-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-surface-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-3 text-surface-500">
                {user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Never'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
