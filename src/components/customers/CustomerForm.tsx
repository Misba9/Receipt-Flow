import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { CustomerDuplicateDialog } from '@/components/customers/CustomerDuplicateDialog'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Textarea } from '@/components/ui/Textarea'
import { useCustomerAutocomplete } from '@/hooks/useCustomerAutocomplete'
import { showFieldSuccess } from '@/lib/formFeedback'
import { paths } from '@/lib/paths'
import {
  customerToFormValues,
  findExactCustomerDuplicate,
} from '@/services/customers/api'
import type {
  Customer,
  CustomerInput,
  CustomerSuggestion,
} from '@/services/customers/types'
import {
  customerSchema,
  type CustomerFormSchema,
} from '@/validation/customer.schema'

type CustomerFormProps = {
  customer?: Customer | null
  submitting?: boolean
  error?: string | null
  onSubmit: (values: CustomerInput) => Promise<void> | void
  onCancel: () => void
  /** When choosing an existing customer (autocomplete or duplicate dialog). */
  onSelectExisting?: (customer: CustomerSuggestion) => void
}

export function CustomerForm({
  customer,
  submitting = false,
  error,
  onSubmit,
  onCancel,
  onSelectExisting,
}: CustomerFormProps) {
  const navigate = useNavigate()
  const [duplicate, setDuplicate] = useState<CustomerSuggestion | null>(null)
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors, isValid, dirtyFields, touchedFields },
  } = useForm<CustomerFormSchema>({
    resolver: zodResolver(customerSchema),
    mode: 'onChange',
    defaultValues: {
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      email: customer?.email ?? '',
      company_name: customer?.company_name ?? '',
      address: customer?.address_line1 ?? '',
      tax_id: customer?.tax_id ?? '',
      notes: customer?.notes ?? '',
    },
  })

  useEffect(() => {
    void trigger()
  }, [trigger])

  const watchedName = useWatch({ control, name: 'name' }) ?? ''
  const watchedPhone = useWatch({ control, name: 'phone' }) ?? ''
  const watchedEmail = useWatch({ control, name: 'email' }) ?? ''
  const watchedAddress = useWatch({ control, name: 'address' }) ?? ''
  const watchedTaxId = useWatch({ control, name: 'tax_id' }) ?? ''
  const watchedNotes = useWatch({ control, name: 'notes' }) ?? ''

  const applyCustomer = (selected: CustomerSuggestion) => {
    const values = customerToFormValues(selected)
    setValue('name', values.name, { shouldDirty: true, shouldValidate: true })
    setValue('phone', values.phone, { shouldDirty: true, shouldValidate: true })
    setValue('email', values.email, { shouldDirty: true, shouldValidate: true })
    setValue('address', values.address, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('tax_id', values.tax_id, { shouldDirty: true, shouldValidate: true })
    setValue('notes', values.notes, { shouldDirty: true, shouldValidate: true })
    setDuplicate(null)
    onSelectExisting?.(selected)
  }

  const autocomplete = useCustomerAutocomplete({
    excludeId: customer?.id,
    getFieldValue: (field) => {
      if (field === 'name') return watchedName
      if (field === 'phone') return watchedPhone
      return watchedEmail
    },
    onSelect: applyCustomer,
  })

  const nameA11y = autocomplete.getInputA11y('name')
  const phoneA11y = autocomplete.getInputA11y('phone')
  const emailA11y = autocomplete.getInputA11y('email')

  const busy = submitting || checkingDuplicate
  const canSubmit = isValid && !busy

  return (
    <>
      <form
        className="space-y-4 px-5 py-4"
        onSubmit={handleSubmit(async (values) => {
          const payload: CustomerInput = {
            name: values.name.trim(),
            phone: values.phone.trim(),
            email: values.email.trim(),
            company_name: '',
            address: values.address.trim(),
            tax_id: values.tax_id.trim(),
            notes: values.notes.trim(),
          }

          setCheckingDuplicate(true)
          try {
            const match = await findExactCustomerDuplicate({
              ...payload,
              excludeId: customer?.id,
            })
            if (match) {
              setDuplicate(match)
              return
            }
            await onSubmit(payload)
          } finally {
            setCheckingDuplicate(false)
          }
        })}
        noValidate
      >
        {error ? <Alert>{error}</Alert> : null}

        <div className="relative">
          <Input
            label="Name"
            placeholder="Customer name"
            disabled={busy}
            error={errors.name?.message}
            success={showFieldSuccess({
              dirty: dirtyFields.name,
              touched: touchedFields.name,
              invalid: Boolean(errors.name),
              value: watchedName,
            })}
            role={nameA11y.role}
            aria-expanded={nameA11y['aria-expanded']}
            aria-controls={nameA11y['aria-controls']}
            aria-autocomplete={nameA11y['aria-autocomplete']}
            aria-activedescendant={nameA11y['aria-activedescendant']}
            autoComplete="off"
            {...register('name', {
              onChange: () => {
                nameA11y.onFocus()
              },
              onBlur: () => {
                nameA11y.onBlur()
              },
            })}
            onFocus={() => {
              nameA11y.onFocus()
            }}
            onKeyDown={nameA11y.onKeyDown}
          />
          {autocomplete.renderDropdownFor('name')}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <Input
              label="Phone number"
              type="tel"
              placeholder="+919876543210"
              disabled={busy}
              error={errors.phone?.message}
              success={showFieldSuccess({
                dirty: dirtyFields.phone,
                touched: touchedFields.phone,
                invalid: Boolean(errors.phone),
                value: watchedPhone,
              })}
              role={phoneA11y.role}
              aria-expanded={phoneA11y['aria-expanded']}
              aria-controls={phoneA11y['aria-controls']}
              aria-autocomplete={phoneA11y['aria-autocomplete']}
              aria-activedescendant={phoneA11y['aria-activedescendant']}
              autoComplete="off"
              {...register('phone', {
                onChange: () => {
                  phoneA11y.onFocus()
                },
                onBlur: () => {
                  phoneA11y.onBlur()
                },
              })}
              onFocus={() => {
                phoneA11y.onFocus()
              }}
              onKeyDown={phoneA11y.onKeyDown}
            />
            {autocomplete.renderDropdownFor('phone')}
          </div>
          <div className="relative">
            <Input
              label="Email"
              type="email"
              placeholder="customer@email.com"
              disabled={busy}
              error={errors.email?.message}
              success={showFieldSuccess({
                dirty: dirtyFields.email,
                touched: touchedFields.email,
                invalid: Boolean(errors.email),
                value: watchedEmail,
              })}
              role={emailA11y.role}
              aria-expanded={emailA11y['aria-expanded']}
              aria-controls={emailA11y['aria-controls']}
              aria-autocomplete={emailA11y['aria-autocomplete']}
              aria-activedescendant={emailA11y['aria-activedescendant']}
              autoComplete="off"
              {...register('email', {
                onChange: () => {
                  emailA11y.onFocus()
                },
                onBlur: () => {
                  emailA11y.onBlur()
                },
              })}
              onFocus={() => {
                emailA11y.onFocus()
              }}
              onKeyDown={emailA11y.onKeyDown}
            />
            {autocomplete.renderDropdownFor('email')}
          </div>
        </div>

        <Textarea
          label="Address / place"
          placeholder="Street, city, state, postal code"
          disabled={busy}
          error={errors.address?.message}
          success={showFieldSuccess({
            dirty: dirtyFields.address,
            touched: touchedFields.address,
            invalid: Boolean(errors.address),
            value: watchedAddress,
          })}
          className="min-h-20"
          {...register('address')}
        />

        <Input
          label="GST number"
          placeholder="Optional"
          disabled={busy}
          error={errors.tax_id?.message}
          success={showFieldSuccess({
            dirty: dirtyFields.tax_id,
            touched: touchedFields.tax_id,
            invalid: Boolean(errors.tax_id),
            value: watchedTaxId,
          })}
          {...register('tax_id')}
        />

        <Textarea
          label="Comments"
          placeholder="Internal notes about this customer"
          disabled={busy}
          error={errors.notes?.message}
          success={showFieldSuccess({
            dirty: dirtyFields.notes,
            touched: touchedFields.notes,
            invalid: Boolean(errors.notes),
            value: watchedNotes,
          })}
          {...register('notes')}
        />

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {busy ? (
              <Spinner className="h-4 w-4 border-white/30 border-t-white" />
            ) : null}
            {busy
              ? 'Saving…'
              : customer
                ? 'Save changes'
                : 'Add customer'}
          </Button>
        </div>
      </form>

      <CustomerDuplicateDialog
        open={Boolean(duplicate)}
        customer={duplicate}
        onCancel={() => setDuplicate(null)}
        onUseExisting={() => {
          if (duplicate) applyCustomer(duplicate)
        }}
        onViewCustomer={() => {
          if (!duplicate) return
          navigate(
            `${paths.customers}?edit=${duplicate.id}&q=${encodeURIComponent(duplicate.name)}`,
          )
        }}
      />
    </>
  )
}
