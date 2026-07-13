import { useMemo, useState } from 'react'
import {
  ToolField,
  ToolPanel,
  ToolResultCard,
  formatInr,
  formatPct,
  parseAmount,
  toolInputClass,
  toolSelectClass,
} from '@/components/tools/tool-ui'

export function MarginCalculatorTool() {
  const [mode, setMode] = useState<'from-price' | 'from-margin'>('from-price')
  const [cost, setCost] = useState('800')
  const [selling, setSelling] = useState('1000')
  const [targetMargin, setTargetMargin] = useState('20')

  const result = useMemo(() => {
    const c = parseAmount(cost)
    if (mode === 'from-margin') {
      const m = parseAmount(targetMargin) / 100
      const price = m < 1 ? c / (1 - m) : c
      const profit = price - c
      const markup = c > 0 ? (profit / c) * 100 : 0
      return {
        cost: c,
        selling: price,
        profit,
        margin: parseAmount(targetMargin),
        markup,
      }
    }

    const s = parseAmount(selling)
    const profit = s - c
    const margin = s > 0 ? (profit / s) * 100 : 0
    const markup = c > 0 ? (profit / c) * 100 : 0
    return { cost: c, selling: s, profit, margin, markup }
  }, [mode, cost, selling, targetMargin])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolPanel title="Inputs">
        <div className="grid gap-4">
          <ToolField label="Calculate">
            <select
              className={toolSelectClass}
              value={mode}
              onChange={(e) =>
                setMode(e.target.value as 'from-price' | 'from-margin')
              }
            >
              <option value="from-price">Margin from cost & price</option>
              <option value="from-margin">Price from target margin</option>
            </select>
          </ToolField>
          <ToolField label="Cost (₹)">
            <input
              className={toolInputClass}
              inputMode="decimal"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </ToolField>
          {mode === 'from-price' ? (
            <ToolField label="Selling price (₹)">
              <input
                className={toolInputClass}
                inputMode="decimal"
                value={selling}
                onChange={(e) => setSelling(e.target.value)}
              />
            </ToolField>
          ) : (
            <ToolField label="Target margin (%)">
              <input
                className={toolInputClass}
                inputMode="decimal"
                value={targetMargin}
                onChange={(e) => setTargetMargin(e.target.value)}
              />
            </ToolField>
          )}
        </div>
      </ToolPanel>
      <ToolPanel title="Results">
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolResultCard label="Selling price" value={formatInr(result.selling)} emphasize />
          <ToolResultCard label="Profit" value={formatInr(result.profit)} />
          <ToolResultCard label="Margin" value={formatPct(result.margin)} />
          <ToolResultCard label="Markup" value={formatPct(result.markup)} />
        </div>
      </ToolPanel>
    </div>
  )
}
