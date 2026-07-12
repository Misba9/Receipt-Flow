import { useMemo, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { Alert, Button, Card, Input, Select, Spinner, Textarea } from '@/components/ui'
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
  useInvoiceCustomerOptions,
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
import { useCompanySettings } from '@/services/settings/hooks'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/lib/paths'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type InvoiceFormValues = {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  customer_notes: string
  invoice_number: string
  customer_id: string
  issue_date: string
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

function todayIso() {
  return new Date().toISOString().slice(0, 10)
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
      customer_notes: '',
      invoice_number: invoice.invoice_number,
      customer_id: invoice.customer_id,
      issue_date: invoice.issue_date,
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
    customer_notes: '',
    invoice_number: defaults?.invoice_number ?? '',
    customer_id: '',
    issue_date: todayIso(),
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
  const { data: customers = [], isLoading: customersLoading } =
    useInvoiceCustomerOptions()
  const { data: company } = useCompanySettings()

  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    defaultValues: buildDefaultValues(invoice, defaults),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = useWatch({ control, name: 'items' })
  const watchedDiscount = Number(useWatch({ control, name: 'discount_amount' })) || 0
  const watchedTaxRate = Number(useWatch({ control, name: 'tax_rate' })) || 0
  const watchedPaymentMode = useWatch({ control, name: 'payment_mode' })

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

  const onSubmit = handleSubmit(async (values) => {
    setError(null)
    setStatusMessage(null)

    const invoiceFields = {
      invoice_number: values.invoice_number.trim(),
      issue_date: values.issue_date,
      // Create-bill requires payment → completed sale is paid.
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
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
      })),
    }

    try {
      if (invoice) {
        const payload: InvoiceInput = {
          ...invoiceFields,
          customer_id: values.customer_id,
        }
        await updateInvoice.mutateAsync({ id: invoice.id, input: payload })
        navigate(paths.invoiceDetail(invoice.id))
        return
      }

      setStatusMessage('Saving customer and invoice…')
      const id = await createBill.mutateAsync({
        customer: {
          name: values.customer_name.trim(),
          phone: values.customer_phone.trim(),
          email: values.customer_email.trim(),
          company_name: '',
          address: values.customer_address.trim(),
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

      navigate(paths.invoiceDetail(id), {
        replace: true,
        state: { delivery },
      })
    } catch (err) {
      setStatusMessage(null)
      setError(err instanceof Error ? err.message : 'Unable to create bill.')
    }
  })

  if (isEdit && customersLoading) {
    return (
      <Card className="flex items-center justify-center gap-3 py-16">
        <Spinner className="h-6 w-6" />
        <span className="text-sm text-surface-500">Loading invoice form…</span>
      </Card>
    )
  }

  return (
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
              Saved to Customers when you create the bill.
            </p>
          </div>

          <Input
            label="Name"
            placeholder="Customer name"
            autoComplete="name"
            disabled={submitting}
            error={errors.customer_name?.message}
            {...register('customer_name', {
              required: 'Customer name is required',
              minLength: { value: 2, message: 'Enter at least 2 characters' },
              maxLength: { value: 120, message: 'Name is too long' },
            })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone number"
              type="tel"
              placeholder="+1 555 0100"
              autoComplete="tel"
              disabled={submitting}
              error={errors.customer_phone?.message}
              {...register('customer_phone', {
                required: 'Phone number is required',
                maxLength: { value: 40, message: 'Phone is too long' },
              })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="customer@email.com"
              autoComplete="email"
              disabled={submitting}
              error={errors.customer_email?.message}
              {...register('customer_email', {
                required: 'Email is required',
                pattern: {
                  value: EMAIL_PATTERN,
                  message: 'Enter a valid email address',
                },
                maxLength: { value: 160, message: 'Email is too long' },
              })}
            />
          </div>

          <Textarea
            label="Address / place"
            placeholder="Street, city, state, postal code"
            disabled={submitting}
            error={errors.customer_address?.message}
            className="min-h-20"
            {...register('customer_address', {
              maxLength: { value: 500, message: 'Address is too long' },
            })}
          />

          <Textarea
            label="Customer notes"
            placeholder="Internal notes about this customer"
            disabled={submitting}
            error={errors.customer_notes?.message}
            {...register('customer_notes', {
              maxLength: { value: 2000, message: 'Notes are too long' },
            })}
          />
        </Card>
      ) : null}

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
            {...register('invoice_number', {
              required: 'Invoice number is required',
            })}
          />
          {isEdit ? (
            <Select
              label="Customer"
              placeholder="Select customer"
              disabled={submitting || customers.length === 0}
              error={errors.customer_id?.message}
              options={customers.map((customer) => ({
                value: customer.id,
                label: customer.name,
              }))}
              {...register('customer_id', { required: 'Customer is required' })}
            />
          ) : null}
          <Input
            label="Billing date"
            type="date"
            disabled={submitting}
            error={errors.issue_date?.message}
            {...register('issue_date', { required: 'Billing date is required' })}
          />
          {isEdit ? (
            <Select
              label="Status"
              disabled={submitting}
              error={errors.status?.message}
              options={statusOptions}
              {...register('status', { required: 'Status is required' })}
            />
          ) : null}
          <Input
            label="Employee name"
            placeholder="Optional"
            disabled={submitting}
            error={errors.employee_name?.message}
            {...register('employee_name', {
              maxLength: { value: 120, message: 'Name is too long' },
            })}
          />
          <Select
            label="Payment mode"
            disabled={submitting}
            error={errors.payment_mode?.message}
            options={paymentModeOptions}
            {...register('payment_mode', {
              required: 'Payment mode is required',
            })}
          />
          {watchedPaymentMode === 'other' ? (
            <Input
              label="Other payment mode"
              placeholder="Describe payment mode"
              disabled={submitting}
              error={errors.payment_mode_other?.message}
              {...register('payment_mode_other', {
                required: 'Describe the payment mode',
                maxLength: { value: 80, message: 'Too long' },
              })}
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
                    {...register(`items.${index}.description`, {
                      required: 'Product is required',
                    })}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Input
                    label="Product type"
                    placeholder="Type"
                    disabled={submitting}
                    error={errors.items?.[index]?.product_type?.message}
                    {...register(`items.${index}.product_type`, {
                      required: 'Product type is required',
                    })}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Input
                    label="Qty"
                    type="number"
                    step="0.01"
                    min="0.01"
                    disabled={submitting}
                    error={errors.items?.[index]?.quantity?.message}
                    {...register(`items.${index}.quantity`, {
                      required: 'Required',
                      valueAsNumber: true,
                      min: { value: 0.01, message: 'Must be > 0' },
                    })}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Input
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={submitting}
                    error={errors.items?.[index]?.unit_price?.message}
                    {...register(`items.${index}.unit_price`, {
                      required: 'Required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Must be ≥ 0' },
                    })}
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
              {...register('discount_amount', {
                required: 'Discount is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Must be ≥ 0' },
              })}
            />
            <Input
              label="Tax (%)"
              type="number"
              step="0.01"
              min="0"
              disabled={submitting}
              error={errors.tax_rate?.message}
              {...register('tax_rate', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be ≥ 0' },
              })}
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
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
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
  )
}
