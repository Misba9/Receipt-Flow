/**
 * Shared financial statistics for Dashboard and Reports.
 * Invoice table is the single source of truth; all queries are company-scoped.
 */
import { supabase } from '@/lib/supabase'
import { getCurrentCompanyId } from '@/lib/tenant'
import { finalizeDraftSalesWithPayment } from '@/services/invoices/api'
import type { InvoiceStatus } from '@/services/invoices/types'
import type {
  DashboardInvoice,
  DashboardStats,
} from '@/services/dashboard/types'
import type {
  DailySalesPoint,
  InvoiceStatusPoint,
  MonthlySalesPoint,
  ReportsData,
  RevenueSummary,
  TopCustomerPoint,
} from '@/services/reports/types'

export type StatsInvoice = {
  id: string
  customer_id: string
  invoice_number: string
  status: InvoiceStatus
  issue_date: string
  paid_at: string | null
  total: number
  amount_paid: number
  currency: string
  created_at: string
  customer: { id: string; name: string; email: string | null } | null
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  partially_paid: 'Partially Paid',
  cancelled: 'Cancelled',
  void: 'Void',
}

const STATUS_ORDER: InvoiceStatus[] = [
  'paid',
  'partially_paid',
  'sent',
  'overdue',
  'draft',
  'cancelled',
  'void',
]

/** Cancelled / void invoices are ignored in all financial metrics. */
export function isIgnoredStatus(status: InvoiceStatus) {
  return status === 'cancelled' || status === 'void'
}

/** Revenue contribution from a single invoice. */
export function revenueAmount(invoice: Pick<StatsInvoice, 'status' | 'total' | 'amount_paid'>) {
  if (isIgnoredStatus(invoice.status)) return 0
  if (invoice.status === 'paid') return Number(invoice.total) || 0
  if (invoice.status === 'partially_paid') {
    const paid = Number(invoice.amount_paid) || 0
    const total = Number(invoice.total) || 0
    return Math.min(Math.max(paid, 0), total)
  }
  return 0
}

/** Outstanding / remaining balance from a single invoice. */
export function outstandingAmount(
  invoice: Pick<StatsInvoice, 'status' | 'total' | 'amount_paid'>,
) {
  if (isIgnoredStatus(invoice.status)) return 0
  if (invoice.status === 'sent' || invoice.status === 'overdue') {
    return Number(invoice.total) || 0
  }
  if (invoice.status === 'partially_paid') {
    const total = Number(invoice.total) || 0
    const paid = Number(invoice.amount_paid) || 0
    return Math.max(total - paid, 0)
  }
  // draft / paid — not outstanding
  return 0
}

/** Local calendar date key YYYY-MM-DD. */
export function toDateKey(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function toMonthKey(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}`
}

/**
 * Payment date for revenue timing.
 * Prefer paid_at; fall back to issue_date for paid / partially paid rows.
 */
export function paymentDateKey(
  invoice: Pick<StatsInvoice, 'status' | 'paid_at' | 'issue_date'>,
) {
  if (invoice.status !== 'paid' && invoice.status !== 'partially_paid') {
    return null
  }
  if (invoice.paid_at) return toDateKey(invoice.paid_at)
  return toDateKey(invoice.issue_date)
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

function mapStatsInvoice(row: Record<string, unknown>): StatsInvoice {
  const customerRaw = row.customer
  const customerObj = Array.isArray(customerRaw) ? customerRaw[0] : customerRaw
  const customer =
    customerObj && typeof customerObj === 'object'
      ? {
          id: String((customerObj as Record<string, unknown>).id ?? ''),
          name: String((customerObj as Record<string, unknown>).name ?? ''),
          email:
            ((customerObj as Record<string, unknown>).email as string | null) ??
            null,
        }
      : null

  const status = row.status as InvoiceStatus
  const total = Number(row.total ?? 0)
  let amountPaid = Number(row.amount_paid ?? 0)
  if (status === 'paid' && amountPaid <= 0) amountPaid = total

  return {
    id: String(row.id),
    customer_id: String(row.customer_id),
    invoice_number: String(row.invoice_number ?? ''),
    status,
    issue_date: String(row.issue_date),
    paid_at: (row.paid_at as string | null) ?? null,
    total,
    amount_paid: amountPaid,
    currency: String(row.currency ?? 'USD'),
    created_at: String(row.created_at ?? ''),
    customer,
  }
}

/** Paginated fetch of all company invoices used for stats. */
export async function fetchCompanyInvoicesForStats(
  companyId: string,
): Promise<StatsInvoice[]> {
  const rows: StatsInvoice[] = []
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
        invoice_number,
        status,
        issue_date,
        paid_at,
        total,
        amount_paid,
        currency,
        created_at,
        customer:customers(id, name, email)
      `,
      )
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      // amount_paid may be missing before migration — retry without it
      if (error.message?.includes('amount_paid')) {
        const fallback = await supabase
          .from('invoices')
          .select(
            `
            id,
            customer_id,
            invoice_number,
            status,
            issue_date,
            paid_at,
            total,
            currency,
            created_at,
            customer:customers(id, name, email)
          `,
          )
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })
          .range(from, to)

        if (fallback.error) throw fallback.error

        const batch = (fallback.data ?? []).map((row) =>
          mapStatsInvoice(row as Record<string, unknown>),
        )
        rows.push(...batch)
        if (batch.length < pageSize) break
        from += pageSize
        continue
      }
      throw error
    }

    const batch = (data ?? []).map((row) =>
      mapStatsInvoice(row as Record<string, unknown>),
    )
    rows.push(...batch)
    if (batch.length < pageSize) break
    from += pageSize
  }

  return rows
}

async function fetchDefaultCurrency(companyId: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('default_currency')
    .eq('company_id', companyId)
    .maybeSingle()

  if (error) throw error
  return data?.default_currency ?? 'USD'
}

/** Active customer count for the current company (aggregate count). */
export async function fetchCustomerCount(companyId: string): Promise<number> {
  const { count, error } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .eq('is_active', true)

  if (error) throw error
  return count ?? 0
}

/** Total invoice count for the current company (aggregate count). */
export async function fetchInvoiceCount(companyId: string): Promise<number> {
  const { count, error } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)

  if (error) throw error
  return count ?? 0
}

export function computeRevenueSummary(
  invoices: StatsInvoice[],
  currency: string,
): RevenueSummary {
  const now = new Date()
  const todayKey = toDateKey(now)!
  const thisMonthKey = toMonthKey(now)!
  const lastMonthKey = toMonthKey(
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
  )!

  let totalRevenue = 0
  let thisMonthRevenue = 0
  let lastMonthRevenue = 0
  let outstanding = 0
  let paidCount = 0
  let todaysSales = 0

  for (const invoice of invoices) {
    if (isIgnoredStatus(invoice.status)) continue

    outstanding += outstandingAmount(invoice)

    const rev = revenueAmount(invoice)
    if (rev <= 0) continue

    totalRevenue += rev

    if (invoice.status === 'paid') paidCount += 1

    const payKey = paymentDateKey(invoice)
    const monthKey = payKey ? payKey.slice(0, 7) : null

    if (monthKey === thisMonthKey) thisMonthRevenue += rev
    if (monthKey === lastMonthKey) lastMonthRevenue += rev

    // Today's sales: fully paid invoices with payment date today
    if (invoice.status === 'paid' && payKey === todayKey) {
      todaysSales += rev
    }
  }

  return {
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    outstanding,
    paidCount,
    invoiceCount: invoices.length,
    currency,
    todaysSales,
  }
}

export function buildDailySales(invoices: StatsInvoice[]): DailySalesPoint[] {
  const today = startOfDay(new Date())
  const start = addDays(today, -29)
  const totals = new Map<string, { total: number; count: number }>()

  for (let i = 0; i < 30; i += 1) {
    const key = toDateKey(addDays(start, i))
    if (key) totals.set(key, { total: 0, count: 0 })
  }

  for (const invoice of invoices) {
    if (isIgnoredStatus(invoice.status)) continue
    const rev = revenueAmount(invoice)
    if (rev <= 0) continue

    const key = paymentDateKey(invoice)
    if (!key || !totals.has(key)) continue

    const entry = totals.get(key)!
    entry.total += rev
    entry.count += 1
  }

  return [...totals.entries()].map(([date, value]) => ({
    date,
    label: formatDayLabel(date),
    total: value.total,
    count: value.count,
  }))
}

export function buildMonthlySales(invoices: StatsInvoice[]): MonthlySalesPoint[] {
  const now = new Date()
  const totals = new Map<string, { total: number; count: number }>()

  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = toMonthKey(date)
    if (key) totals.set(key, { total: 0, count: 0 })
  }

  for (const invoice of invoices) {
    if (isIgnoredStatus(invoice.status)) continue
    const rev = revenueAmount(invoice)
    if (rev <= 0) continue

    const dateKey = paymentDateKey(invoice)
    const key = dateKey ? dateKey.slice(0, 7) : null
    if (!key || !totals.has(key)) continue

    const entry = totals.get(key)!
    entry.total += rev
    entry.count += 1
  }

  return [...totals.entries()].map(([month, value]) => ({
    month,
    label: formatMonthLabel(month),
    total: value.total,
    count: value.count,
  }))
}

export function buildInvoicesByStatus(
  invoices: StatsInvoice[],
): InvoiceStatusPoint[] {
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

/** Top customers by total paid / partially paid revenue. */
export function buildTopCustomers(
  invoices: StatsInvoice[],
  limit = 8,
): TopCustomerPoint[] {
  const map = new Map<
    string,
    { name: string; email: string | null; total: number; invoiceCount: number }
  >()

  for (const invoice of invoices) {
    const rev = revenueAmount(invoice)
    if (rev <= 0) continue

    const id = invoice.customer_id
    const existing = map.get(id) ?? {
      name: invoice.customer?.name ?? 'Unknown customer',
      email: invoice.customer?.email ?? null,
      total: 0,
      invoiceCount: 0,
    }
    existing.total += rev
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

export type CompanyStatsBundle = {
  invoices: StatsInvoice[]
  currency: string
  customerCount: number
  invoiceCount: number
  revenue: RevenueSummary
  dailySales: DailySalesPoint[]
  monthlySales: MonthlySalesPoint[]
  invoicesByStatus: InvoiceStatusPoint[]
  topCustomers: TopCustomerPoint[]
}

/** Single fetch used by both Dashboard and Reports. */
export async function fetchCompanyStats(): Promise<CompanyStatsBundle> {
  const companyId = await getCurrentCompanyId()

  // One-time repair for bills incorrectly saved as draft despite payment.
  await finalizeDraftSalesWithPayment(companyId)

  const [invoices, currency, customerCount, invoiceCount] = await Promise.all([
    fetchCompanyInvoicesForStats(companyId),
    fetchDefaultCurrency(companyId),
    fetchCustomerCount(companyId),
    fetchInvoiceCount(companyId),
  ])

  const revenue = computeRevenueSummary(invoices, currency)

  return {
    invoices,
    currency,
    customerCount,
    invoiceCount,
    revenue: {
      ...revenue,
      invoiceCount,
    },
    dailySales: buildDailySales(invoices),
    monthlySales: buildMonthlySales(invoices),
    invoicesByStatus: buildInvoicesByStatus(invoices),
    topCustomers: buildTopCustomers(invoices),
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const stats = await fetchCompanyStats()
  return {
    todaysSales: stats.revenue.todaysSales,
    totalCustomers: stats.customerCount,
    totalInvoices: stats.invoiceCount,
    revenue: stats.revenue.totalRevenue,
    outstanding: stats.revenue.outstanding,
    currency: stats.currency,
  }
}

export async function fetchReportsData(): Promise<ReportsData> {
  const stats = await fetchCompanyStats()
  return {
    dailySales: stats.dailySales,
    monthlySales: stats.monthlySales,
    invoicesByStatus: stats.invoicesByStatus,
    topCustomers: stats.topCustomers,
    revenue: stats.revenue,
  }
}

export async function fetchRecentInvoices(
  limit = 5,
): Promise<DashboardInvoice[]> {
  const companyId = await getCurrentCompanyId()
  await finalizeDraftSalesWithPayment(companyId)

  const { data, error } = await supabase
    .from('invoices')
    .select(
      'id, invoice_number, status, total, currency, issue_date, created_at, customer:customers(name)',
    )
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? []).map((row) => {
    const customer = Array.isArray(row.customer)
      ? row.customer[0]
      : row.customer

    return {
      id: row.id,
      invoice_number: row.invoice_number,
      status: row.status as InvoiceStatus,
      total: Number(row.total ?? 0),
      currency: row.currency,
      issue_date: row.issue_date,
      customer: customer ? { name: customer.name } : null,
    }
  })
}
