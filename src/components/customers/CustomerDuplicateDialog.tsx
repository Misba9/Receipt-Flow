import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { CustomerSuggestion } from '@/services/customers/types'

type CustomerDuplicateDialogProps = {
  open: boolean
  customer: CustomerSuggestion | null
  onUseExisting: () => void
  onViewCustomer: () => void
  onCancel: () => void
}

export function CustomerDuplicateDialog({
  open,
  customer,
  onUseExisting,
  onViewCustomer,
  onCancel,
}: CustomerDuplicateDialogProps) {
  return (
    <Modal
      open={open}
      title="This customer already exists."
      description="Name, phone, and email match an existing customer. Creating another copy is blocked."
      onClose={onCancel}
    >
      <div className="space-y-4 px-5 py-4">
        {customer ? (
          <div className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm dark:border-surface-700 dark:bg-surface-950/60">
            <p className="font-semibold text-surface-900 dark:text-surface-50">
              {customer.name}
            </p>
            {customer.phone ? (
              <p className="mt-1 text-surface-600 dark:text-surface-300">
                {customer.phone}
              </p>
            ) : null}
            {customer.email ? (
              <p className="text-surface-600 dark:text-surface-300">
                {customer.email}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="ghost" onClick={onViewCustomer}>
            View Customer
          </Button>
          <Button type="button" onClick={onUseExisting}>
            Use Existing Customer
          </Button>
        </div>
      </div>
    </Modal>
  )
}
