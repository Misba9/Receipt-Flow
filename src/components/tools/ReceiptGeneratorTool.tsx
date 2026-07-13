import { useMemo, useState } from 'react'
import {
  ToolField,
  ToolPanel,
  formatInr,
  parseAmount,
  toolInputClass,
  toolSelectClass,
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

export function ReceiptGeneratorTool() {
  const [shop, setShop] = useState('Your Shop')
  const [receiptNo, setReceiptNo] = useState('R-204')
  const [paymentMode, setPaymentMode] = useState('UPI')
  const [taxRate, setTaxRate] = useState('5')
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Item A', qty: '2', rate: '120' },
    { id: '2', description: 'Item B', qty: '1', rate: '80' },
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
      <ToolPanel title="Receipt details">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolField label="Shop name">
              <input
                className={toolInputClass}
                value={shop}
                onChange={(e) => setShop(e.target.value)}
              />
            </ToolField>
            <ToolField label="Receipt number">
              <input
                className={toolInputClass}
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
              />
            </ToolField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolField label="Payment mode">
              <select
                className={toolSelectClass}
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
              </select>
            </ToolField>
            <ToolField label="Tax rate (%)">
              <input
                className={toolInputClass}
                inputMode="decimal"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </ToolField>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-surface-700">Items</p>
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
                    placeholder="Item"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                  />
                  <input
                    className={toolInputClass}
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, { qty: e.target.value })}
                  />
                  <input
                    className={toolInputClass}
                    placeholder="Rate"
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
        <div className="mx-auto max-w-xs rounded-xl border border-dashed border-surface-300 bg-white px-4 py-5 font-mono text-xs text-surface-800">
          <p className="text-center text-sm font-bold tracking-wide uppercase">
            {shop || 'Shop'}
          </p>
          <p className="mt-1 text-center text-surface-500">TAX RECEIPT</p>
          <p className="mt-3 text-surface-500">No: {receiptNo}</p>
          <p className="text-surface-500">
            {new Date().toLocaleString('en-IN')}
          </p>
          <div className="my-3 border-t border-dashed border-surface-300" />
          {items.map((item) => (
            <div key={item.id} className="mb-2 flex justify-between gap-2">
              <span>
                {item.description || 'Item'} × {item.qty || 0}
              </span>
              <span>
                {formatInr(parseAmount(item.qty) * parseAmount(item.rate))}
              </span>
            </div>
          ))}
          <div className="my-3 border-t border-dashed border-surface-300" />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatInr(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatInr(totals.tax)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm font-bold">
            <span>TOTAL</span>
            <span>{formatInr(totals.total)}</span>
          </div>
          <p className="mt-3 text-center text-surface-500">
            Paid via {paymentMode}
          </p>
          <p className="mt-2 text-center text-surface-400">Thank you!</p>
        </div>
      </ToolPanel>
    </div>
  )
}
