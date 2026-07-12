import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ChartCard } from '@/components/reports/ChartCard'
import {
  STATUS_CHART_COLORS,
  useChartTheme,
} from '@/components/reports/chartTheme'
import type { InvoiceStatusPoint } from '@/services/reports/types'
import { formatNumber } from '@/lib/format'

type InvoicesChartProps = {
  data: InvoiceStatusPoint[]
  loading?: boolean
}

export function InvoicesChart({ data, loading = false }: InvoicesChartProps) {
  const theme = useChartTheme()
  const total = data.reduce((sum, point) => sum + point.count, 0)

  return (
    <ChartCard
      title="Invoices"
      description="Breakdown of invoices by status."
      loading={loading}
      empty={total === 0}
      emptyMessage="No invoices yet."
    >
      <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-48 min-w-0 flex-1 sm:h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_CHART_COLORS[entry.status] ?? '#64748b'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: theme.tooltipBg,
                  border: `1px solid ${theme.tooltipBorder}`,
                  borderRadius: 12,
                  color: theme.tooltipText,
                  fontSize: 12,
                }}
                formatter={(value, _name, item) => {
                  const point = item?.payload as InvoiceStatusPoint | undefined
                  const count = Number(value ?? 0)
                  const pct =
                    total > 0 ? Math.round((count / total) * 100) : 0
                  return [
                    `${formatNumber(count)} (${pct}%)`,
                    point?.label ?? 'Invoices',
                  ]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="grid shrink-0 grid-cols-2 gap-x-4 gap-y-2 px-3 pb-2 sm:w-40 sm:grid-cols-1">
          {data.map((entry) => (
            <li key={entry.status} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    STATUS_CHART_COLORS[entry.status] ?? '#64748b',
                }}
              />
              <span className="truncate text-surface-600 dark:text-surface-300">
                {entry.label}
              </span>
              <span className="ml-auto font-medium text-surface-900 dark:text-surface-50">
                {entry.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}
