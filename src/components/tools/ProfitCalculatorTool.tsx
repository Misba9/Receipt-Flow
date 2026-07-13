import { useMemo, useState } from 'react'
import {
  ToolField,
  ToolPanel,
  ToolResultCard,
  formatInr,
  formatPct,
  parseAmount,
  toolInputClass,
} from '@/components/tools/tool-ui'

export function ProfitCalculatorTool() {
  const [revenue, setRevenue] = useState('50000')
  const [cost, setCost] = useState('32000')

  const result = useMemo(() => {
    const rev = parseAmount(revenue)
    const c = parseAmount(cost)
    const profit = rev - c
    const margin = rev > 0 ? (profit / rev) * 100 : 0
    return { profit, margin }
  }, [revenue, cost])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolPanel title="Inputs">
        <div className="grid gap-4">
          <ToolField label="Revenue / selling price (₹)">
            <input
              className={toolInputClass}
              inputMode="decimal"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </ToolField>
          <ToolField label="Total cost (₹)">
            <input
              className={toolInputClass}
              inputMode="decimal"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </ToolField>
        </div>
      </ToolPanel>
      <ToolPanel title="Results">
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolResultCard
            label="Profit"
            value={formatInr(result.profit)}
            emphasize
          />
          <ToolResultCard label="Profit margin" value={formatPct(result.margin)} />
        </div>
      </ToolPanel>
    </div>
  )
}
