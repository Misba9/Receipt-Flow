import { useMemo, useState } from 'react'
import {
  ToolField,
  ToolPanel,
  ToolResultCard,
  formatInr,
  parseAmount,
  toolInputClass,
  toolSelectClass,
} from '@/components/tools/tool-ui'

const GST_PRESETS = ['0', '5', '12', '18', '28'] as const

export function GstCalculatorTool() {
  const [amount, setAmount] = useState('1000')
  const [rateOption, setRateOption] = useState<string>('18')
  const [customRate, setCustomRate] = useState('18')
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive')
  const [supply, setSupply] = useState<'intra' | 'inter'>('intra')

  const isCustom = rateOption === 'custom'
  const effectiveRate = parseAmount(isCustom ? customRate : rateOption)

  const result = useMemo(() => {
    const input = parseAmount(amount)
    const r = effectiveRate / 100
    let taxable = 0
    let gst = 0
    let total = 0

    if (mode === 'exclusive') {
      taxable = input
      gst = taxable * r
      total = taxable + gst
    } else {
      total = input
      taxable = r > 0 ? total / (1 + r) : total
      gst = total - taxable
    }

    const half = gst / 2
    return {
      taxable,
      gst,
      total,
      cgst: supply === 'intra' ? half : 0,
      sgst: supply === 'intra' ? half : 0,
      igst: supply === 'inter' ? gst : 0,
    }
  }, [amount, effectiveRate, mode, supply])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolPanel title="Inputs">
        <div className="grid gap-4">
          <ToolField label="Amount (₹)">
            <input
              className={toolInputClass}
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </ToolField>
          <ToolField label="GST rate">
            <select
              className={toolSelectClass}
              value={rateOption}
              onChange={(e) => setRateOption(e.target.value)}
            >
              {GST_PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}%
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </ToolField>
          {isCustom ? (
            <ToolField label="Custom rate (%)">
              <input
                className={toolInputClass}
                inputMode="decimal"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
              />
            </ToolField>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <ToolField label="Tax mode">
              <select
                className={toolSelectClass}
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as 'exclusive' | 'inclusive')
                }
              >
                <option value="exclusive">Tax exclusive</option>
                <option value="inclusive">Tax inclusive</option>
              </select>
            </ToolField>
            <ToolField label="Supply type">
              <select
                className={toolSelectClass}
                value={supply}
                onChange={(e) =>
                  setSupply(e.target.value as 'intra' | 'inter')
                }
              >
                <option value="intra">Intra-state (CGST + SGST)</option>
                <option value="inter">Inter-state (IGST)</option>
              </select>
            </ToolField>
          </div>
        </div>
      </ToolPanel>

      <ToolPanel title="GST breakup">
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolResultCard label="Taxable value" value={formatInr(result.taxable)} />
          <ToolResultCard label="Total GST" value={formatInr(result.gst)} />
          {supply === 'intra' ? (
            <>
              <ToolResultCard label="CGST" value={formatInr(result.cgst)} />
              <ToolResultCard label="SGST" value={formatInr(result.sgst)} />
            </>
          ) : (
            <ToolResultCard label="IGST" value={formatInr(result.igst)} />
          )}
          <ToolResultCard
            label="Invoice total"
            value={formatInr(result.total)}
            emphasize
          />
        </div>
      </ToolPanel>
    </div>
  )
}
