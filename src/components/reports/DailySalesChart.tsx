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
import type { DailySalesPoint } from '@/services/reports/types'
import { formatCurrency } from '@/lib/format'

type DailySalesChartProps = {
  data: DailySalesPoint[]
  currency: string
  loading?: boolean
}

export function DailySalesChart({
  data,
  currency,
  loading = false,
}: DailySalesChartProps) {
  const theme = useChartTheme()
  const hasSales = data.some((point) => point.total > 0)

  return (
    <ChartCard
      title="Daily Sales"
      description="Paid invoice totals for the last 30 days."
      loading={loading}
      empty={!hasSales}
      emptyMessage="No paid sales in the last 30 days."
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="dailySalesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.brand} stopOpacity={0.35} />
              <stop offset="100%" stopColor={CHART_COLORS.brand} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: theme.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
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
            formatter={(value) => [
              formatCurrency(Number(value ?? 0), currency),
              'Sales',
            ]}
            labelFormatter={(_, payload) => {
              const point = payload?.[0]?.payload as DailySalesPoint | undefined
              return point
                ? `${point.label} · ${point.count} invoice${point.count === 1 ? '' : 's'}`
                : ''
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke={CHART_COLORS.brand}
            strokeWidth={2}
            fill="url(#dailySalesFill)"
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
