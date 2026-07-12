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
import type { TopCustomerPoint } from '@/services/reports/types'
import { formatCurrency } from '@/lib/format'

type TopCustomersChartProps = {
  data: TopCustomerPoint[]
  currency: string
  loading?: boolean
}

export function TopCustomersChart({
  data,
  currency,
  loading = false,
}: TopCustomersChartProps) {
  const theme = useChartTheme()
  const chartData = data.map((row) => ({
    ...row,
    shortName:
      row.name.length > 16 ? `${row.name.slice(0, 14)}…` : row.name,
  }))

  return (
    <ChartCard
      title="Top Customers"
      description="Highest revenue from paid invoices."
      loading={loading}
      empty={data.length === 0}
      emptyMessage="No paid customer revenue yet."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
        >
          <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: theme.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) =>
              value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value)
            }
          />
          <YAxis
            type="category"
            dataKey="shortName"
            width={96}
            tick={{ fill: theme.axis, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
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
              'Revenue',
            ]}
            labelFormatter={(_, payload) => {
              const point = payload?.[0]?.payload as TopCustomerPoint | undefined
              if (!point) return ''
              return `${point.name} · ${point.invoiceCount} paid`
            }}
          />
          <Bar
            dataKey="total"
            fill={CHART_COLORS.emerald}
            radius={[0, 6, 6, 0]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
