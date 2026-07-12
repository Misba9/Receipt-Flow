import {
  Bar,
  BarChart,
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

type MonthlySalesChartProps = {
  data: MonthlySalesPoint[]
  currency: string
  loading?: boolean
}

export function MonthlySalesChart({
  data,
  currency,
  loading = false,
}: MonthlySalesChartProps) {
  const theme = useChartTheme()
  const hasSales = data.some((point) => point.total > 0)

  return (
    <ChartCard
      title="Monthly Sales"
      description="Paid revenue by month for the last 12 months."
      loading={loading}
      empty={!hasSales}
      emptyMessage="No paid sales in the last 12 months."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            cursor={{ fill: theme.cursor }}
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
              const point = payload?.[0]?.payload as MonthlySalesPoint | undefined
              return point
                ? `${point.label} · ${point.count} invoice${point.count === 1 ? '' : 's'}`
                : ''
            }}
          />
          <Bar
            dataKey="total"
            fill={CHART_COLORS.brand}
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
