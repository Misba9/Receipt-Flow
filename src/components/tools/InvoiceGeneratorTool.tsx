import { useMemo, useState } from 'react'
import {
  ToolField,
  ToolPanel,
  formatInr,
  parseAmount,
  toolInputClass,
} from '@/components/tools/tool-ui'

type LineItem = {
  id: string
  description: string
  qty: string
  rate: string
}

function newItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    qty: '1',
    rate: '',
  }
}

export function InvoiceGeneratorTool() {
  const [business, setBusiness] = useState('Your Business Name')
  const [businessAddress, setBusinessAddress] = useState('City, State')
  const [customer, setCustomer] = useState('Customer Name')
  const [invoiceNo, setInvoiceNo] = useState('INV-1001')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [taxRate, setTaxRate] = useState('18')
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Consulting services', qty: '1', rate: '5000' },
  ])

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseAmount(item.qty) * parseAmount(item.rate),
      0,
    )
    const tax = subtotal * (parseAmount(taxRate) / 100)
    return { subtotal, tax, total: subtotal + tax }
  }, [items, taxRate])

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolPanel title="Invoice details">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolField label="Business name">
              <input
                className={toolInputClass}
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
              />
            </ToolField>
            <ToolField label="Invoice number">
              <input
                className={toolInputClass}
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </ToolField>
          </div>
          <ToolField label="Business address">
            <input
              className={toolInputClass}
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />
          </ToolField>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolField label="Bill to">
              <input
                className={toolInputClass}
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </ToolField>
            <ToolField label="Date">
              <input
                type="date"
                className={toolInputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </ToolField>
          </div>
          <ToolField label="Tax rate (%)">
            <input
              className={toolInputClass}
              inputMode="decimal"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
          </ToolField>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-surface-700">Line items</p>
              <button
                type="button"
                className="text-sm font-medium text-brand-700 hover:underline"
                onClick={() => setItems((prev) => [...prev, newItem()])}
              >
                Add item
              </button>
            </div>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid gap-2 rounded-xl border border-surface-100 bg-surface-50 p-3 sm:grid-cols-[1fr_72px_100px_auto]"
                >
                  <input
                    className={toolInputClass}
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                  />
                  <input
                    className={toolInputClass}
                    placeholder="Qty"
                    inputMode="decimal"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, { qty: e.target.value })}
                  />
                  <input
                    className={toolInputClass}
                    placeholder="Rate"
                    inputMode="decimal"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(item.id, { rate: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="text-sm text-surface-500 hover:text-red-600"
                    onClick={() =>
                      setItems((prev) =>
                        prev.length > 1
                          ? prev.filter((row) => row.id !== item.id)
                          : prev,
                      )
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ToolPanel>

      <ToolPanel
        title="Preview"
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 print:hidden"
          >
            Print / Save PDF
          </button>
        }
      >
        <div
          id="invoice-print-area"
          className="rounded-xl border border-surface-200 bg-white p-5 text-sm text-surface-800"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-lg font-semibold text-surface-950">
                {business || 'Business'}
              </p>
              <p className="mt-1 text-surface-500">{businessAddress}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-surface-950">INVOICE</p>
              <p className="text-surface-500">{invoiceNo}</p>
              <p className="text-surface-500">{date}</p>
            </div>
          </div>
          <p className="mt-6 text-surface-500">Bill to</p>
          <p className="font-medium text-surface-900">{customer || 'Customer'}</p>
          <table className="mt-6 w-full text-left">
            <thead>
              <tr className="border-b border-surface-200 text-xs tracking-wide text-surface-500 uppercase">
                <th className="py-2 font-medium">Item</th>
                <th className="py-2 font-medium">Qty</th>
                <th className="py-2 font-medium">Rate</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const amount =
                  parseAmount(item.qty) * parseAmount(item.rate)
                return (
                  <tr key={item.id} className="border-b border-surface-100">
                    <td className="py-2">{item.description || '—'}</td>
                    <td className="py-2">{item.qty || '0'}</td>
                    <td className="py-2">{formatInr(parseAmount(item.rate))}</td>
                    <td className="py-2 text-right">{formatInr(amount)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatInr(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({taxRate || 0}%)</span>
              <span>{formatInr(totals.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-surface-200 pt-2 font-semibold text-surface-950">
              <span>Total</span>
              <span>{formatInr(totals.total)}</span>
            </div>
          </div>
        </div>
      </ToolPanel>
    </div>
  )
}
