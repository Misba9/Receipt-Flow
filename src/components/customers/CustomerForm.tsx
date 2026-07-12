import { useForm } from 'react-hook-form'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import type { Customer, CustomerInput } from '@/services/customers/types'

type CustomerFormProps = {
  customer?: Customer | null
  submitting?: boolean
  error?: string | null
  onSubmit: (values: CustomerInput) => Promise<void> | void
  onCancel: () => void
}

const EMAIL_PATTERN = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CustomerForm({
  customer,
  submitting = false,
  error,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({
    defaultValues: {
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      email: customer?.email ?? '',
      address: customer?.address_line1 ?? '',
      notes: customer?.notes ?? '',
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          address: values.address.trim(),
          notes: values.notes.trim(),
        })
      })}
      noValidate
    >
      {error ? <Alert>{error}</Alert> : null}

      <Input
        label="Name"
        placeholder="Customer name"
        autoComplete="name"
        disabled={submitting}
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Enter at least 2 characters' },
          maxLength: { value: 120, message: 'Name is too long' },
        })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 555 0100"
          autoComplete="tel"
          disabled={submitting}
          error={errors.phone?.message}
          {...register('phone', {
            maxLength: { value: 40, message: 'Phone is too long' },
          })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="customer@email.com"
          autoComplete="email"
          disabled={submitting}
          error={errors.email?.message}
          {...register('email', {
            pattern: {
              value: EMAIL_PATTERN,
              message: 'Enter a valid email address',
            },
            maxLength: { value: 160, message: 'Email is too long' },
          })}
        />
      </div>

      <Textarea
        label="Address"
        placeholder="Street, city, state, postal code"
        disabled={submitting}
        error={errors.address?.message}
        className="min-h-20"
        {...register('address', {
          maxLength: { value: 500, message: 'Address is too long' },
        })}
      />

      <Textarea
        label="Notes"
        placeholder="Internal notes about this customer"
        disabled={submitting}
        error={errors.notes?.message}
        {...register('notes', {
          maxLength: { value: 2000, message: 'Notes are too long' },
        })}
      />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Spinner className="h-4 w-4 border-white/30 border-t-white" />
          ) : null}
          {submitting
            ? 'Saving…'
            : customer
              ? 'Save changes'
              : 'Add customer'}
        </Button>
      </div>
    </form>
  )
}
