import type { ReportsData } from '@/services/reports/types'
import { APP_NAME } from '@/utils'

function fileStamp() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function escapeCsv(value: string | number | null | undefined) {
  const raw = value == null ? '' : String(value)
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`
  }
  return raw
}

function rowsToCsv(headers: string[], rows: Array<Array<string | number | null>>) {
  const lines = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ]
  return lines.join('\n')
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

/** Builds a multi-section CSV report from aggregated chart data. */
export function downloadReportsCsv(data: ReportsData) {
  const stamp = fileStamp()
  const sections: string[] = []

  sections.push(`# ${APP_NAME} Reports · Generated ${stamp}`)
  sections.push('')

  sections.push('## Revenue Summary')
  sections.push(
    rowsToCsv(
      [
        'Total Revenue',
        'This Month',
        'Last Month',
        'Outstanding',
        'Paid Invoices',
        'All Invoices',
        'Currency',
        "Today's Sales",
      ],
      [
        [
          data.revenue.totalRevenue,
          data.revenue.thisMonthRevenue,
          data.revenue.lastMonthRevenue,
          data.revenue.outstanding,
          data.revenue.paidCount,
          data.revenue.invoiceCount,
          data.revenue.currency,
          data.revenue.todaysSales,
        ],
      ],
    ),
  )
  sections.push('')

  sections.push('## Daily Sales (Last 30 Days)')
  sections.push(
    rowsToCsv(
      ['Date', 'Label', 'Total', 'Invoice Count'],
      data.dailySales.map((row) => [
        row.date,
        row.label,
        row.total,
        row.count,
      ]),
    ),
  )
  sections.push('')

  sections.push('## Monthly Sales (Last 12 Months)')
  sections.push(
    rowsToCsv(
      ['Month', 'Label', 'Total', 'Invoice Count'],
      data.monthlySales.map((row) => [
        row.month,
        row.label,
        row.total,
        row.count,
      ]),
    ),
  )
  sections.push('')

  sections.push('## Invoices by Status')
  sections.push(
    rowsToCsv(
      ['Status', 'Count', 'Total Amount'],
      data.invoicesByStatus.map((row) => [
        row.label,
        row.count,
        row.total,
      ]),
    ),
  )
  sections.push('')

  sections.push('## Top Customers')
  sections.push(
    rowsToCsv(
      ['Customer', 'Email', 'Revenue', 'Paid Invoices'],
      data.topCustomers.map((row) => [
        row.name,
        row.email,
        row.total,
        row.invoiceCount,
      ]),
    ),
  )

  downloadTextFile(
    `${APP_NAME}-reports-${stamp}.csv`,
    sections.join('\n'),
  )
}
