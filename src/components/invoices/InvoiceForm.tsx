import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Check, FileText, Mail, Plus, Trash2 } from 'lucide-react'
import { Alert, Button, Card, Input, Select, Spinner, Textarea } from '@/components/ui'
import { CustomerDuplicateDialog } from '@/components/customers/CustomerDuplicateDialog'
import { QuantityStepper } from '@/components/invoices/QuantityStepper'
import { useCustomerAutocomplete } from '@/hooks/useCustomerAutocomplete'
import { useToast } from '@/hooks/useToast'
import {
  calculateInvoiceTotals,
  lineAmount,
} from '@/services/invoices/calculations'
import {
  deliverNewInvoice,
  type InvoiceDeliveryResult,
} from '@/services/invoices/deliver'
import {
  useCreateBill,
  useUpdateInvoice,
} from '@/services/invoices/hooks'
import type {
  InvoiceDefaults,
  InvoiceDetail,
  InvoiceInput,
  InvoiceStatus,
  PaymentMode,
} from '@/services/invoices/types'
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUSES,
  PAYMENT_MODE_LABELS,
  PAYMENT_MODES,
} from '@/services/invoices/types'
import {
  customerToFormValues,
  findExactCustomerDuplicate,
} from '@/services/customers/api'
import type { CustomerSuggestion } from '@/services/customers/types'
import { useCompanySettings } from '@/services/settings/hooks'
import { showFieldSuccess } from '@/lib/formFeedback'
import { formatCurrency } from '@/lib/format'
import { toFriendlyError } from '@/lib/friendlyError'
import { paths } from '@/lib/paths'
import {
  invoiceCreateSchema,
  invoiceEditSchema,
} from '@/validation/invoice.schema'

type InvoiceFormValues = {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  customer_tax_id: string
  customer_notes: string
  invoice_number: string
  customer_id: string
  issue_date: string
  due_date: string
  status: InvoiceStatus
  discount_amount: number
  tax_rate: number
  notes: string
  payment_mode: PaymentMode | ''
  payment_mode_other: string
  employee_name: string
  items: Array<{
    description: string
    product_type: string
    quantity: number
    unit_price: number
  }>
}

type InvoiceFormProps = {
  invoice?: InvoiceDetail
  defaults?: InvoiceDefaults
}

const paymentModeOptions = [
  { value: '', label: 'Select payment mode' },
  ...PAYMENT_MODES.map((mode) => ({
    value: mode,
    label: PAYMENT_MODE_LABELS[mode],
  })),
]

const statusOptions = INVOICE_STATUSES.filter(
  (status) => status !== 'void',
).map((status) => ({
  value: status,
  label: INVOICE_STATUS_LABELS[status],
}))

type CreateBillPhase = 'saving' | 'delivering'

const CREATE_PHASES: Array<{
  id: CreateBillPhase
  label: string
  description: string
  icon: typeof FileText
}> = [
  {
    id: 'saving',
    label: 'Saving bill',
    description: 'Creating customer and invoice…',
    icon: FileText,
  },
  {
    id: 'delivering',
    label: 'Sending email',
    description: 'Generating PDF and emailing the customer…',
    icon: Mail,
  },
]

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function addDaysIso(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function buildDefaultValues(
  invoice?: InvoiceDetail,
  defaults?: InvoiceDefaults,
): InvoiceFormValues {
  if (invoice) {
    return {
      customer_name: invoice.customer?.name ?? '',
      customer_phone: invoice.customer?.phone ?? '',
      customer_email: invoice.customer?.email ?? '',
      customer_address: invoice.customer?.address_line1 ?? '',
      customer_tax_id: '',
      customer_notes: '',
      invoice_number: invoice.invoice_number,
      customer_id: invoice.customer_id,
      issue_date: invoice.issue_date,
      due_date:
        invoice.due_date ??
        addDaysIso(invoice.issue_date, defaults?.due_days ?? 30),
      status: invoice.status,
      discount_amount: invoice.discount_amount,
      tax_rate: invoice.tax_rate,
      notes: invoice.notes ?? '',
      payment_mode: invoice.payment_mode ?? '',
      payment_mode_other: invoice.payment_mode_other ?? '',
      employee_name: invoice.employee_name ?? '',
      items:
        invoice.items.length > 0
          ? invoice.items.map((item) => ({
              description: item.description,
              product_type: item.product_type ?? '',
              quantity: item.quantity,
              unit_price: item.unit_price,
            }))
          : [{ description: '', product_type: '', quantity: 1, unit_price: 0 }],
    }
  }

  return {
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    customer_tax_id: '',
    customer_notes: '',
    invoice_number: defaults?.invoice_number ?? '',
    customer_id: '',
    issue_date: todayIso(),
    due_date: addDaysIso(todayIso(), defaults?.due_days ?? 30),
    status: 'paid',
    discount_amount: 0,
    tax_rate: defaults?.tax_rate ?? 0,
    notes: '',
    payment_mode: '',
    payment_mode_other: '',
    employee_name: '',
    items: [{ description: '', product_type: '', quantity: 1, unit_price: 0 }],
  }
}

export function InvoiceForm({ invoice, defaults }: InvoiceFormProps) {
  const isEdit = Boolean(invoice)
  const navigate = useNavigate()
  const createBill = useCreateBill()
  const updateInvoice = useUpdateInvoice()
  const { data: company } = useCompanySettings()

  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [createPhase, setCreatePhase] = useState<CreateBillPhase | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    invoice?.customer_id ?? null,
  )
  const { toast } = useToast()
  const [duplicate, setDuplicate] = useState<CustomerSuggestion | null>(null)
  const [pendingSubmit, setPendingSubmit] = useState<InvoiceFormValues | null>(
    null,
  )

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting, isValid, dirtyFields, touchedFields },
  } = useForm<InvoiceFormValues>({
    // Schema output matches InvoiceFormValues after coerce; cast keeps RHF types stable.
    resolver: zodResolver(
      isEdit ? invoiceEditSchema : invoiceCreateSchema,
    ) as never,
    mode: 'onChange',
    defaultValues: buildDefaultValues(invoice, defaults),
  })

  useEffect(() => {
    void trigger()
  }, [trigger])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = useWatch({ control, name: 'items' })
  const watchedDiscount = Number(useWatch({ control, name: 'discount_amount' })) || 0
  const watchedTaxRate = Number(useWatch({ control, name: 'tax_rate' })) || 0
  const watchedPaymentMode = useWatch({ control, name: 'payment_mode' })
  const watchedCustomerName = useWatch({ control, name: 'customer_name' }) ?? ''
  const watchedCustomerPhone = useWatch({ control, name: 'customer_phone' }) ?? ''
  const watchedCustomerEmail = useWatch({ control, name: 'customer_email' }) ?? ''

  const applyCustomer = (selected: CustomerSuggestion) => {
    const values = customerToFormValues(selected)
    setValue('customer_name', values.name, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('customer_phone', values.phone, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('customer_email', values.email, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('customer_address', values.address, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('customer_tax_id', values.tax_id, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('customer_notes', values.notes, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('customer_id', selected.id, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setSelectedCustomerId(selected.id)
    setDuplicate(null)
  }

  const autocomplete = useCustomerAutocomplete({
    enabled: true,
    getFieldValue: (field) => {
      if (field === 'name') return watchedCustomerName
      if (field === 'phone') return watchedCustomerPhone
      return watchedCustomerEmail
    },
    onSelect: applyCustomer,
  })

  const totals = useMemo(
    () =>
      calculateInvoiceTotals(
        (watchedItems ?? []).map((item) => ({
          description: item.description ?? '',
          product_type: item.product_type ?? '',
          quantity: Number(item.quantity) || 0,
          unit_price: Number(item.unit_price) || 0,
        })),
        watchedDiscount,
        watchedTaxRate,
      ),
    [watchedItems, watchedDiscount, watchedTaxRate],
  )

  const currency = invoice?.currency ?? defaults?.currency ?? 'USD'
  const submitting =
    isSubmitting || createBill.isPending || updateInvoice.isPending
  const canSubmit = isValid && !submitting

  const runCreateOrUpdate = async (values: InvoiceFormValues) => {
    const invoiceFields = {
      invoice_number: values.invoice_number.trim(),
      issue_date: values.issue_date,
      due_date: values.due_date,
      status: isEdit ? values.status : 'paid',
      discount_amount: Number(values.discount_amount) || 0,
      tax_rate: Number(values.tax_rate) || 0,
      notes: values.notes.trim(),
      payment_mode: values.payment_mode,
      payment_mode_other: values.payment_mode_other.trim(),
      model: invoice?.model ?? '',
      place: invoice?.place ?? '',
      employee_name: values.employee_name.trim(),
      items: values.items.map((item) => ({
        description: item.description.trim(),
        product_type: item.product_type.trim(),
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
        unit_price: Number(item.unit_price),
      })),
    }

    if (invoice) {
      const payload: InvoiceInput = {
        ...invoiceFields,
        customer_id: values.customer_id || selectedCustomerId || '',
      }
      if (!payload.customer_id) {
        throw new Error('Select a customer for this invoice.')
      }
      await updateInvoice.mutateAsync({ id: invoice.id, input: payload })
      toast('Saved successfully.', 'success')
      navigate(paths.invoiceDetail(invoice.id))
      return
    }

    setCreatePhase('saving')
    setStatusMessage('Saving customer and invoice…')
    const id = await createBill.mutateAsync({
      existingCustomerId: selectedCustomerId ?? undefined,
      customer: {
        name: values.customer_name.trim(),
        phone: values.customer_phone.trim(),
        email: values.customer_email.trim(),
        company_name: '',
        address: values.customer_address.trim(),
        tax_id: values.customer_tax_id.trim(),
        notes: values.customer_notes.trim(),
      },
      invoice: invoiceFields,
    })

    let delivery: InvoiceDeliveryResult

    if (!company) {
      delivery = {
        status: 'failed',
        message:
          'Bill created, but company settings were unavailable for PDF/email.',
      }
    } else {
      setCreatePhase('delivering')
      setStatusMessage('Generating PDF and sending email…')
      try {
        delivery = await deliverNewInvoice(id, company)
      } catch (deliveryError) {
        delivery = {
          status: 'failed',
          message:
            deliveryError instanceof Error
              ? deliveryError.message
              : 'Bill created, but PDF/email delivery failed.',
        }
      }
    }

    toast('Saved successfully.', 'success')
    navigate(paths.invoiceDetail(id), {
      replace: true,
      state: { delivery },
    })
  }

  const onSubmit = handleSubmit(async (values) => {
    setError(null)
    setStatusMessage(null)

    try {
      if (!isEdit) {
        const match = await findExactCustomerDuplicate({
          name: values.customer_name,
          phone: values.customer_phone,
          email: values.customer_email,
          excludeId: selectedCustomerId ?? undefined,
        })
        if (match && match.id !== selectedCustomerId) {
          setDuplicate(match)
          setPendingSubmit(values)
          return
        }
      }

      await runCreateOrUpdate(values)
    } catch (err) {
      setCreatePhase(null)
      setStatusMessage(null)
      setError(toFriendlyError(err, 'Unable to create bill.'))
    }
  })

  const nameA11y = autocomplete.getInputA11y('name')
  const phoneA11y = autocomplete.getInputA11y('phone')
  const emailA11y = autocomplete.getInputA11y('email')

  if (isEdit && !invoice) {
    return (
      <Card className="flex items-center justify-center gap-3 py-16">
        <Spinner className="h-6 w-6" />
        <span className="text-sm text-surface-500">Loading invoice form…</span>
      </Card>
    )
  }

  if (!isEdit && createPhase) {
    const activeIndex = CREATE_PHASES.findIndex((step) => step.id === createPhase)

    return (
      <Card
        className="flex flex-col items-center px-6 py-16 text-center sm:px-10"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner className="h-10 w-10" />
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
            {createPhase === 'saving' ? 'Creating your bill…' : 'Finishing up…'}
          </h3>
          <p className="max-w-md text-sm text-surface-500 dark:text-surface-400">
            {statusMessage ??
              'Please wait while we save the bill and send the email.'}
          </p>
        </div>

        <ol className="mt-8 w-full max-w-sm space-y-3 text-left">
          {CREATE_PHASES.map((step, index) => {
            const done = index < activeIndex
            const active = index === activeIndex
            const Icon = step.icon

            return (
              <li
                key={step.id}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                  active
                    ? 'border-brand-200 bg-brand-50/80 dark:border-brand-800 dark:bg-brand-950/40'
                    : done
                      ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30'
                      : 'border-surface-100 bg-surface-50/60 dark:border-surface-800 dark:bg-surface-900/40'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                        ? 'bg-brand-600 text-white'
                        : 'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                  }`}
                >
                  {done ? (
                    <Check className="h-4 w-4" aria-hidden />
                  ) : active ? (
                    <Spinner className="h-4 w-4 border-white/30 border-t-white" />
                  ) : (
                    <Icon className="h-4 w-4" aria-hidden />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-surface-900 dark:text-surface-50">
                    {step.label}
                  </span>
                  <span className="block text-xs text-surface-500 dark:text-surface-400">
                    {step.description}
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
      </Card>
    )
  }

  return (
    <>
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      {error ? <Alert>{error}</Alert> : null}
      {statusMessage ? <Alert variant="info">{statusMessage}</Alert> : null}

      {!isEdit ? (
        <Card className="space-y-4">
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-50">
              Customer details
            </h3>
            <p className="text-sm text-surface-500">
              Start typing to find an existing customer, or create a new one.
            </p>
          </div>

          <div className="relative">
            <Input
              label="Name"
              placeholder="Customer name"
              disabled={submitting}
              error={errors.customer_name?.message}
              success={showFieldSuccess({
                dirty: dirtyFields.customer_name,
                touched: touchedFields.customer_name,
                invalid: Boolean(errors.customer_name),
                value: watchedCustomerName,
              })}
              role={nameA11y.role}
              aria-expanded={nameA11y['aria-expanded']}
              aria-controls={nameA11y['aria-controls']}
              aria-autocomplete={nameA11y['aria-autocomplete']}
              aria-activedescendant={nameA11y['aria-activedescendant']}
              autoComplete="off"
              {...register('customer_name', {
                onChange: () => {
                  setSelectedCustomerId(null)
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
                disabled={submitting}
                error={errors.customer_phone?.message}
                success={showFieldSuccess({
                  dirty: dirtyFields.customer_phone,
                  touched: touchedFields.customer_phone,
                  invalid: Boolean(errors.customer_phone),
                  value: watchedCustomerPhone,
                })}
                role={phoneA11y.role}
                aria-expanded={phoneA11y['aria-expanded']}
                aria-controls={phoneA11y['aria-controls']}
                aria-autocomplete={phoneA11y['aria-autocomplete']}
                aria-activedescendant={phoneA11y['aria-activedescendant']}
                autoComplete="off"
                {...register('customer_phone', {
                  onChange: () => {
                    setSelectedCustomerId(null)
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
                disabled={submitting}
                error={errors.customer_email?.message}
                success={showFieldSuccess({
                  dirty: dirtyFields.customer_email,
                  touched: touchedFields.customer_email,
                  invalid: Boolean(errors.customer_email),
                  value: watchedCustomerEmail,
                })}
                role={emailA11y.role}
                aria-expanded={emailA11y['aria-expanded']}
                aria-controls={emailA11y['aria-controls']}
                aria-autocomplete={emailA11y['aria-autocomplete']}
                aria-activedescendant={emailA11y['aria-activedescendant']}
                autoComplete="off"
                {...register('customer_email', {
                  onChange: () => {
                    setSelectedCustomerId(null)
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
            disabled={submitting}
            error={errors.customer_address?.message}
            className="min-h-20"
            {...register('customer_address')}
          />

          <Input
            label="GST number"
            placeholder="Optional"
            disabled={submitting}
            error={errors.customer_tax_id?.message}
            {...register('customer_tax_id')}
          />

          <Textarea
            label="Customer notes"
            placeholder="Internal notes about this customer"
            disabled={submitting}
            error={errors.customer_notes?.message}
            {...register('customer_notes')}
          />
        </Card>
      ) : (
        <Card className="space-y-4">
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-50">
              Customer
            </h3>
            <p className="text-sm text-surface-500">
              Search by name, phone, or email to switch customer.
            </p>
          </div>
          <div className="relative">
            <Input
              label="Customer name"
              placeholder="Search customers…"
              disabled={submitting}
              error={errors.customer_id?.message}
              role={nameA11y.role}
              aria-expanded={nameA11y['aria-expanded']}
              aria-controls={nameA11y['aria-controls']}
              aria-autocomplete={nameA11y['aria-autocomplete']}
              aria-activedescendant={nameA11y['aria-activedescendant']}
              autoComplete="off"
              {...register('customer_name', {
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
          <input type="hidden" {...register('customer_id')} />
          {(watchedCustomerPhone || watchedCustomerEmail) && (
            <p className="text-sm text-surface-500">
              {[watchedCustomerPhone, watchedCustomerEmail]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </Card>
      )}

      <Card>
        <div className="mb-4">
          <h3 className="font-semibold text-surface-900 dark:text-surface-50">
            Bill details
          </h3>
          <p className="text-sm text-surface-500">
            Billing date, payment, and employee.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Invoice number"
            disabled={submitting}
            error={errors.invoice_number?.message}
            {...register('invoice_number')}
          />
          <Input
            label="Billing date"
            type="date"
            disabled={submitting}
            error={errors.issue_date?.message}
            success={showFieldSuccess({
              dirty: dirtyFields.issue_date,
              touched: touchedFields.issue_date,
              invalid: Boolean(errors.issue_date),
              value: true,
              requireValue: false,
            })}
            {...register('issue_date')}
          />
          <Input
            label="Due date"
            type="date"
            disabled={submitting}
            error={errors.due_date?.message}
            success={showFieldSuccess({
              dirty: dirtyFields.due_date,
              touched: touchedFields.due_date,
              invalid: Boolean(errors.due_date),
              value: true,
              requireValue: false,
            })}
            {...register('due_date')}
          />
          {isEdit ? (
            <Select
              label="Status"
              disabled={submitting}
              error={errors.status?.message}
              options={statusOptions}
              {...register('status')}
            />
          ) : null}
          <Input
            label="Employee name"
            placeholder="Optional"
            disabled={submitting}
            error={errors.employee_name?.message}
            {...register('employee_name')}
          />
          <Select
            label="Payment mode"
            disabled={submitting}
            error={errors.payment_mode?.message}
            options={paymentModeOptions}
            {...register('payment_mode')}
          />
          {watchedPaymentMode === 'other' ? (
            <Input
              label="Other payment mode"
              placeholder="Describe payment mode"
              disabled={submitting}
              error={errors.payment_mode_other?.message}
              {...register('payment_mode_other')}
            />
          ) : null}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-surface-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-surface-800">
          <div className="min-w-0">
            <h3 className="font-semibold text-surface-900 dark:text-surface-50">
              Line items
            </h3>
            <p className="text-sm text-surface-500">
              Product, type, quantity, and amount for each line.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            disabled={submitting}
            onClick={() =>
              append({
                description: '',
                product_type: '',
                quantity: 1,
                unit_price: 0,
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {typeof errors.items?.message === 'string' ? (
            <Alert>{errors.items.message}</Alert>
          ) : null}
          {fields.map((field, index) => {
            const qty = Number(watchedItems?.[index]?.quantity) || 0
            const price = Number(watchedItems?.[index]?.unit_price) || 0
            const amount = lineAmount(qty, price)

            return (
              <div
                key={field.id}
                className="grid gap-3 rounded-xl border border-surface-100 p-3 sm:grid-cols-2 lg:grid-cols-12 dark:border-surface-800"
              >
                <div className="sm:col-span-2 lg:col-span-3">
                  <Input
                    label="Product"
                    placeholder="Product or service"
                    disabled={submitting}
                    error={errors.items?.[index]?.description?.message}
                    {...register(`items.${index}.description`)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Input
                    label="Product type"
                    placeholder="Type"
                    disabled={submitting}
                    error={errors.items?.[index]?.product_type?.message}
                    {...register(`items.${index}.product_type`)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Controller
                    control={control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <QuantityStepper
                        label="Qty"
                        value={Math.max(1, Math.floor(Number(field.value) || 1))}
                        min={1}
                        disabled={submitting}
                        error={errors.items?.[index]?.quantity?.message}
                        onChange={(next) => field.onChange(next)}
                      />
                    )}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    disabled={submitting}
                    error={errors.items?.[index]?.unit_price?.message}
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                  />
                </div>
                <div className="flex items-end justify-between gap-2 sm:col-span-2 lg:col-span-3">
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-sm font-medium text-surface-700 dark:text-surface-200">
                      Total amount
                    </p>
                    <div className="flex h-10 items-center rounded-lg border border-surface-200 bg-surface-50 px-3 text-sm font-medium tabular-nums dark:border-surface-700 dark:bg-surface-950">
                      {formatCurrency(amount, currency)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 shrink-0 px-0 text-red-600 dark:text-red-400"
                    disabled={submitting || fields.length === 1}
                    onClick={() => remove(index)}
                    aria-label="Remove line"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Discount"
              type="number"
              step="0.01"
              min="0"
              disabled={submitting}
              error={errors.discount_amount?.message}
              {...register('discount_amount', { valueAsNumber: true })}
            />
            <Input
              label="Tax (%)"
              type="number"
              step="0.01"
              min="0"
              disabled={submitting}
              error={errors.tax_rate?.message}
              {...register('tax_rate', { valueAsNumber: true })}
            />
          </div>
          <Textarea
            label="Comments"
            placeholder="Optional comments for this bill"
            disabled={submitting}
            {...register('notes')}
          />
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold text-surface-900 dark:text-surface-50">
            Totals
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-surface-500">Subtotal</dt>
              <dd className="font-medium">
                {formatCurrency(totals.subtotal, currency)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-surface-500">Discount</dt>
              <dd className="font-medium">
                −{formatCurrency(totals.discountAmount, currency)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-surface-500">Tax ({watchedTaxRate}%)</dt>
              <dd className="font-medium">
                {formatCurrency(totals.taxAmount, currency)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-surface-100 pt-3 text-base dark:border-surface-800">
              <dt className="font-semibold">Total amount</dt>
              <dd className="font-semibold">
                {formatCurrency(totals.total, currency)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link
          to={invoice ? paths.invoiceDetail(invoice.id) : paths.invoices}
          className="w-full sm:w-auto"
        >
          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={!canSubmit} className="w-full sm:w-auto">
          {submitting ? (
            <Spinner className="h-4 w-4 border-white/30 border-t-white" />
          ) : null}
          {submitting
            ? isEdit
              ? 'Saving…'
              : statusMessage?.includes('email')
                ? 'Sending…'
                : 'Creating bill…'
            : isEdit
              ? 'Save changes'
              : 'Create bill'}
        </Button>
      </div>
    </form>

      <CustomerDuplicateDialog
        open={Boolean(duplicate)}
        customer={duplicate}
        onCancel={() => {
          setDuplicate(null)
          setPendingSubmit(null)
        }}
        onUseExisting={() => {
          if (!duplicate) return
          applyCustomer(duplicate)
          const values = pendingSubmit ?? getValues()
          setPendingSubmit(null)
          void (async () => {
            try {
              await runCreateOrUpdate({
                ...values,
                customer_name: duplicate.name,
                customer_phone: duplicate.phone ?? '',
                customer_email: duplicate.email ?? '',
                customer_address: duplicate.address_line1 ?? '',
                customer_tax_id: duplicate.tax_id ?? '',
                customer_notes: duplicate.notes ?? '',
                customer_id: duplicate.id,
              })
            } catch (err) {
              setCreatePhase(null)
              setStatusMessage(null)
              setError(toFriendlyError(err, 'Unable to create bill.'))
            }
          })()
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
