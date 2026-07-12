import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import type { InvoiceStatus } from '@/services/invoices/types'
import type {
  DailySalesPoint,
  MonthlySalesPoint,
  InvoiceStatusPoint,
  ReportsData,
  TopCustomerPoint,
} from '@/services/reports/types'

type RawInvoice = {
  id: string
  customer_id: string
  status: InvoiceStatus
  issue_date: string
  paid_at: string | null
  total: number
  currency: string
  customer: { id: string; name: string; email: string | null } | null
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
  void: 'Void',
}

const STATUS_ORDER: InvoiceStatus[] = [
  'paid',
  'sent',
  'overdue',
  'draft',
  'cancelled',
  'void',
]

function toDateKey(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function toMonthKey(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}`
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatDayLabel(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatMonthLabel(monthKey: string) {
  const date = new Date(`${monthKey}-01T12:00:00`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: '2-digit',
  }).format(date)
}

/** Prefer paid_at date; fall back to issue_date for paid invoices. */
function saleDateKey(invoice: RawInvoice) {
  if (invoice.paid_at) return toDateKey(invoice.paid_at)
  return toDateKey(invoice.issue_date)
}

async function fetchAllInvoices(companyId: string): Promise<RawInvoice[]> {
  const rows: RawInvoice[] = []
  const pageSize = 500
  let from = 0

  while (true) {
    const to = from + pageSize - 1
    const { data, error } = await supabase
      .from('invoices')
      .select(
        `
        id,
        customer_id,
        status,
        issue_date,
        paid_at,
        total,
        currency,
        customer:customers(id, name, email)
      `,
      )
      .eq('company_id', companyId)
      .order('issue_date', { ascending: true })
      .range(from, to)

    if (error) throw error

    const batch = (data ?? []).map((row) => {
      const customerRaw = Array.isArray(row.customer)
        ? row.customer[0]
        : row.customer

      return {
        id: String(row.id),
        customer_id: String(row.customer_id),
        status: row.status as InvoiceStatus,
        issue_date: String(row.issue_date),
        paid_at: (row.paid_at as string | null) ?? null,
        total: Number(row.total ?? 0),
        currency: String(row.currency ?? 'USD'),
        customer: customerRaw
          ? {
              id: String(customerRaw.id),
              name: String(customerRaw.name),
              email: (customerRaw.email as string | null) ?? null,
            }
          : null,
      } satisfies RawInvoice
    })

    rows.push(...batch)
    if (batch.length < pageSize) break
    from += pageSize
  }

  return rows
}

function buildDailySales(paid: RawInvoice[]): DailySalesPoint[] {
  const today = startOfDay(new Date())
  const start = addDays(today, -29)
  const totals = new Map<string, { total: number; count: number }>()

  for (let i = 0; i < 30; i += 1) {
    const key = toDateKey(addDays(start, i))
    if (key) totals.set(key, { total: 0, count: 0 })
  }

  for (const invoice of paid) {
    const key = saleDateKey(invoice)
    if (!key || !totals.has(key)) continue
    const entry = totals.get(key)!
    entry.total += invoice.total
    entry.count += 1
  }

  return [...totals.entries()].map(([date, value]) => ({
    date,
    label: formatDayLabel(date),
    total: value.total,
    count: value.count,
  }))
}

function buildMonthlySales(paid: RawInvoice[]): MonthlySalesPoint[] {
  const now = new Date()
  const totals = new Map<string, { total: number; count: number }>()

  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = toMonthKey(date)
    if (key) totals.set(key, { total: 0, count: 0 })
  }

  for (const invoice of paid) {
    const key = invoice.paid_at
      ? toMonthKey(invoice.paid_at)
      : toMonthKey(invoice.issue_date)
    if (!key || !totals.has(key)) continue
    const entry = totals.get(key)!
    entry.total += invoice.total
    entry.count += 1
  }

  return [...totals.entries()].map(([month, value]) => ({
    month,
    label: formatMonthLabel(month),
    total: value.total,
    count: value.count,
  }))
}

function buildInvoicesByStatus(invoices: RawInvoice[]): InvoiceStatusPoint[] {
  const map = new Map<InvoiceStatus, { count: number; total: number }>()

  for (const status of STATUS_ORDER) {
    map.set(status, { count: 0, total: 0 })
  }

  for (const invoice of invoices) {
    const entry = map.get(invoice.status) ?? { count: 0, total: 0 }
    entry.count += 1
    entry.total += invoice.total
    map.set(invoice.status, entry)
  }

  return STATUS_ORDER.map((status) => {
    const entry = map.get(status)!
    return {
      status,
      label: STATUS_LABELS[status],
      count: entry.count,
      total: entry.total,
    }
  }).filter((point) => point.count > 0)
}

function buildTopCustomers(paid: RawInvoice[], limit = 8): TopCustomerPoint[] {
  const map = new Map<
    string,
    { name: string; email: string | null; total: number; invoiceCount: number }
  >()

  for (const invoice of paid) {
    const id = invoice.customer_id
    const existing = map.get(id) ?? {
      name: invoice.customer?.name ?? 'Unknown customer',
      email: invoice.customer?.email ?? null,
      total: 0,
      invoiceCount: 0,
    }
    existing.total += invoice.total
    existing.invoiceCount += 1
    if (invoice.customer?.name) existing.name = invoice.customer.name
    if (invoice.customer?.email) existing.email = invoice.customer.email
    map.set(id, existing)
  }

  return [...map.entries()]
    .map(([customerId, value]) => ({
      customerId,
      name: value.name,
      email: value.email,
      total: value.total,
      invoiceCount: value.invoiceCount,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}

function buildRevenue(
  invoices: RawInvoice[],
  paid: RawInvoice[],
  currency: string,
): ReportsData['revenue'] {
  const now = new Date()
  const thisMonthKey = toMonthKey(now)!
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthKey = toMonthKey(lastMonthDate)!

  let thisMonthRevenue = 0
  let lastMonthRevenue = 0
  let totalRevenue = 0

  for (const invoice of paid) {
    totalRevenue += invoice.total
    const key = invoice.paid_at
      ? toMonthKey(invoice.paid_at)
      : toMonthKey(invoice.issue_date)
    if (key === thisMonthKey) thisMonthRevenue += invoice.total
    if (key === lastMonthKey) lastMonthRevenue += invoice.total
  }

  const outstanding = invoices
    .filter((invoice) =>
      ['sent', 'overdue', 'draft'].includes(invoice.status),
    )
    .reduce((sum, invoice) => sum + invoice.total, 0)

  return {
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    outstanding,
    paidCount: paid.length,
    invoiceCount: invoices.length,
    currency,
  }
}

export async function fetchReportsData(): Promise<ReportsData> {
  const companyId = await getCurrentCompanyId()

  const [{ data: settings }, invoices] = await Promise.all([
    supabase
      .from('settings')
      .select('default_currency')
      .eq('company_id', companyId)
      .maybeSingle(),
    fetchAllInvoices(companyId),
  ])

  const currency = settings?.default_currency ?? 'USD'
  const paid = invoices.filter((invoice) => invoice.status === 'paid')

  return {
    dailySales: buildDailySales(paid),
    monthlySales: buildMonthlySales(paid),
    invoicesByStatus: buildInvoicesByStatus(invoices),
    topCustomers: buildTopCustomers(paid),
    revenue: buildRevenue(invoices, paid, currency),
  }
}
