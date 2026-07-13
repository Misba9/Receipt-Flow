import { useState } from 'react'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/hooks/useToast'
import { toFriendlyError } from '@/lib/friendlyError'
import {
  useCreateCustomer,
  useUpdateCustomer,
} from '@/services/customers/hooks'
import type { Customer, CustomerInput } from '@/services/customers/types'

type CustomerFormModalProps = {
  open: boolean
  customer?: Customer | null
  onClose: () => void
  /** Switch the modal to edit an existing customer (from autocomplete). */
  onSwitchToCustomer?: (customerId: string) => void
}

export function CustomerFormModal({
  open,
  customer,
  onClose,
  onSwitchToCustomer,
}: CustomerFormModalProps) {
  const { toast } = useToast()
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const [error, setError] = useState<string | null>(null)

  const isEdit = Boolean(customer)
  const submitting = createCustomer.isPending || updateCustomer.isPending

  const handleSubmit = async (values: CustomerInput) => {
    setError(null)
    try {
      if (customer) {
        await updateCustomer.mutateAsync({ id: customer.id, input: values })
      } else {
        await createCustomer.mutateAsync(values)
      }
      toast('Saved successfully.', 'success')
      onClose()
    } catch (err) {
      setError(toFriendlyError(err, 'Unable to save customer.'))
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit customer' : 'Add customer'}
      description={
        isEdit
          ? 'Update this customer’s contact details.'
          : 'Create a new customer for your company.'
      }
    >
      <CustomerForm
        key={customer?.id ?? 'new'}
        customer={customer}
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onSelectExisting={(selected) => {
          if (customer?.id === selected.id) return
          onSwitchToCustomer?.(selected.id)
        }}
      />
    </Modal>
  )
}
