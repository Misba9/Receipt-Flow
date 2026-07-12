import { useState } from 'react'
import { Ban, CheckCircle2, Trash2 } from 'lucide-react'
import { SubscriptionBadge } from '@/components/admin/SubscriptionBadge'
import { Alert, Button, Modal, Select } from '@/components/ui'
import {
  SUBSCRIPTION_STATUSES,
  useDeleteCompany,
  useSetCompanyActive,
  useSetCompanySubscription,
  type AdminCompany,
  type SubscriptionStatus,
} from '@/services/admin'
import { formatCurrency, formatDate } from '@/lib/format'

type CompaniesTableProps = {
  companies: AdminCompany[]
  loading?: boolean
}

export function AdminCompaniesTable({
  companies,
  loading = false,
}: CompaniesTableProps) {
  const setActive = useSetCompanyActive()
  const setSubscription = useSetCompanySubscription()
  const removeCompany = useDeleteCompany()

  const [disableTarget, setDisableTarget] = useState<AdminCompany | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminCompany | null>(null)
  const [subTarget, setSubTarget] = useState<AdminCompany | null>(null)
  const [reason, setReason] = useState('')
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>('trial')
  const [subPlan, setSubPlan] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  const busy =
    setActive.isPending || setSubscription.isPending || removeCompany.isPending

  if (loading) {
    return (
      <p className="px-5 py-10 text-center text-sm text-surface-500">
        Loading companies…
      </p>
    )
  }

  if (companies.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-surface-500">
        No companies yet.
      </p>
    )
  }

  return (
    <>
      {actionError ? (
        <div className="border-b border-surface-100 px-4 py-3 dark:border-surface-800">
          <Alert>{actionError}</Alert>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[64rem] text-left text-sm">
          <thead className="border-b border-surface-100 bg-surface-50/80 text-xs font-semibold tracking-wide text-surface-500 uppercase dark:border-surface-800 dark:bg-surface-950/50">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Subscription</th>
              <th className="px-4 py-3">Users</th>
              <th className="px-4 py-3">Invoices</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {companies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-surface-50/70 dark:hover:bg-surface-900/60"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-surface-900 dark:text-surface-50">
                    {company.name}
                  </p>
                  <p className="text-xs text-surface-500">
                    {company.email ?? 'No email'}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <SubscriptionBadge status={company.subscriptionStatus} />
                    {company.subscriptionPlan ? (
                      <span className="text-xs text-surface-500">
                        {company.subscriptionPlan}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums">{company.userCount}</td>
                <td className="px-4 py-3 tabular-nums">{company.invoiceCount}</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatCurrency(company.revenue)}
                </td>
                <td className="px-4 py-3">
                  {company.isActive ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                      Disabled
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-surface-500">
                  {formatDate(company.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => {
                        setActionError(null)
                        setSubTarget(company)
                        setSubStatus(company.subscriptionStatus)
                        setSubPlan(company.subscriptionPlan ?? '')
                      }}
                    >
                      Plan
                    </Button>
                    {company.isActive ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onClick={() => {
                          setActionError(null)
                          setReason('')
                          setDisableTarget(company)
                        }}
                      >
                        <Ban className="h-4 w-4" />
                        Disable
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onClick={async () => {
                          setActionError(null)
                          try {
                            await setActive.mutateAsync({
                              companyId: company.id,
                              isActive: true,
                            })
                          } catch (error) {
                            setActionError(
                              error instanceof Error
                                ? error.message
                                : 'Unable to enable company.',
                            )
                          }
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Enable
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                      onClick={() => {
                        setActionError(null)
                        setDeleteTarget(company)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={Boolean(disableTarget)}
        title="Disable company"
        description={
          disableTarget
            ? `Users of “${disableTarget.name}” will be locked out of the app.`
            : undefined
        }
        onClose={() => setDisableTarget(null)}
      >
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-surface-700 dark:text-surface-300">
              Reason (optional)
            </span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-950"
              placeholder="Non-payment, abuse, etc."
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDisableTarget(null)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={busy || !disableTarget}
              onClick={async () => {
                if (!disableTarget) return
                try {
                  await setActive.mutateAsync({
                    companyId: disableTarget.id,
                    isActive: false,
                    reason,
                  })
                  setDisableTarget(null)
                } catch (error) {
                  setActionError(
                    error instanceof Error
                      ? error.message
                      : 'Unable to disable company.',
                  )
                  setDisableTarget(null)
                }
              }}
            >
              Disable company
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete company"
        description={
          deleteTarget
            ? `Permanently delete “${deleteTarget.name}” and all of its users, customers, and invoices. This cannot be undone.`
            : undefined
        }
        onClose={() => setDeleteTarget(null)}
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={busy || !deleteTarget}
            className="bg-red-600 hover:bg-red-700"
            onClick={async () => {
              if (!deleteTarget) return
              try {
                await removeCompany.mutateAsync(deleteTarget.id)
                setDeleteTarget(null)
              } catch (error) {
                setActionError(
                  error instanceof Error
                    ? error.message
                    : 'Unable to delete company.',
                )
                setDeleteTarget(null)
              }
            }}
          >
            Delete permanently
          </Button>
        </div>
      </Modal>

      <Modal
        open={Boolean(subTarget)}
        title="Subscription status"
        description={
          subTarget ? `Update plan for “${subTarget.name}”.` : undefined
        }
        onClose={() => setSubTarget(null)}
      >
        <div className="space-y-4">
          <Select
            label="Status"
            value={subStatus}
            options={SUBSCRIPTION_STATUSES.map((status) => ({
              value: status,
              label: status.replace('_', ' '),
            }))}
            onChange={(event) =>
              setSubStatus(event.target.value as SubscriptionStatus)
            }
          />
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-surface-700 dark:text-surface-300">
              Plan name
            </span>
            <input
              value={subPlan}
              onChange={(event) => setSubPlan(event.target.value)}
              className="h-10 w-full rounded-lg border border-surface-200 bg-white px-3 text-sm dark:border-surface-700 dark:bg-surface-950"
              placeholder="Starter, Pro, Enterprise…"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSubTarget(null)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={busy || !subTarget}
              onClick={async () => {
                if (!subTarget) return
                try {
                  await setSubscription.mutateAsync({
                    companyId: subTarget.id,
                    status: subStatus,
                    plan: subPlan.trim() || null,
                  })
                  setSubTarget(null)
                } catch (error) {
                  setActionError(
                    error instanceof Error
                      ? error.message
                      : 'Unable to update subscription.',
                  )
                  setSubTarget(null)
                }
              }}
            >
              Save subscription
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
