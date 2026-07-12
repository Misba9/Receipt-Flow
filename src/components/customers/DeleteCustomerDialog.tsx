import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useDeleteCustomer } from '@/services/customers/hooks'
import type { Customer } from '@/services/customers/types'

type DeleteCustomerDialogProps = {
  open: boolean
  customer: Customer | null
  onClose: () => void
}

export function DeleteCustomerDialog({
  open,
  customer,
  onClose,
}: DeleteCustomerDialogProps) {
  const deleteCustomer = useDeleteCustomer()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!customer) return
    setError(null)
    try {
      await deleteCustomer.mutateAsync(customer.id)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to delete customer.',
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete customer"
      description="This removes the customer from your active directory."
      className="max-w-md"
    >
      <div className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}

        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-900 dark:text-amber-100">
            Delete <span className="font-semibold">{customer?.name}</span>? Existing
            invoices linked to this customer will keep their history.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleteCustomer.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => void handleDelete()}
            disabled={deleteCustomer.isPending}
          >
            {deleteCustomer.isPending ? (
              <Spinner className="h-4 w-4 border-white/30 border-t-white" />
            ) : null}
            {deleteCustomer.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
