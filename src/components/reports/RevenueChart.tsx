import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartCard } from '@/components/reports/ChartCard'
import { CHART_COLORS, useChartTheme } from '@/components/reports/chartTheme'
import type { MonthlySalesPoint } from '@/services/reports/types'
import { formatCurrency } from '@/lib/format'

type RevenueChartProps = {
  monthlySales: MonthlySalesPoint[]
  currency: string
  loading?: boolean
}

export function RevenueChart({
  monthlySales,
  currency,
  loading = false,
}: RevenueChartProps) {
  const theme = useChartTheme()

  const data = monthlySales.reduce<
    Array<{
      label: string
      month: string
      total: number
      cumulative: number
    }>
  >((acc, point) => {
    const previous = acc[acc.length - 1]?.cumulative ?? 0
    acc.push({
      label: point.label,
      month: point.month,
      total: point.total,
      cumulative: previous + point.total,
    })
    return acc
  }, [])

  const hasRevenue = data.some((point) => point.cumulative > 0)

  return (
    <ChartCard
      title="Revenue"
      description="Cumulative paid revenue over the last 12 months."
      loading={loading}
      empty={!hasRevenue}
      emptyMessage="No revenue to chart yet."
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.violet} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.violet} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: theme.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={48}
          />
          <YAxis
            tick={{ fill: theme.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(value: number) =>
              value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value)
            }
          />
          <Tooltip
            cursor={{ stroke: theme.cursor, strokeWidth: 24 }}
            contentStyle={{
              background: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: 12,
              color: theme.tooltipText,
              fontSize: 12,
            }}
            formatter={(value, name) => [
              formatCurrency(Number(value ?? 0), currency),
              name === 'cumulative' ? 'Cumulative' : 'Month',
            ]}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke={CHART_COLORS.violet}
            strokeWidth={2}
            fill="url(#revenueFill)"
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
