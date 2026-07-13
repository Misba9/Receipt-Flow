import { useMemo, useState } from 'react'
import {
  ToolField,
  ToolPanel,
  toolInputClass,
} from '@/components/tools/tool-ui'

export function QrGeneratorTool() {
  const [text, setText] = useState(
    'upi://pay?pa=merchant@upi&pn=Your%20Shop&am=500&cu=INR',
  )

  const qrUrl = useMemo(() => {
    const data = text.trim() || ' '
    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(data)}`
  }, [text])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ToolPanel title="QR content">
        <div className="grid gap-4">
          <ToolField label="Text, URL, or UPI link">
            <textarea
              className={`${toolInputClass} h-32 resize-y py-2`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://… or upi://pay?…"
            />
          </ToolField>
          <p className="text-xs leading-relaxed text-surface-500">
            Tip: paste a UPI intent URL to create a payment QR for printed bills.
            Avoid encoding passwords or private keys.
          </p>
        </div>
      </ToolPanel>
      <ToolPanel
        title="Preview"
        actions={
          <a
            href={qrUrl}
            download="qr-code.png"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Open / download
          </a>
        }
      >
        <div className="flex flex-col items-center gap-4 rounded-xl border border-surface-100 bg-surface-50 p-6">
          <img
            src={qrUrl}
            alt={`QR code for: ${text.trim().slice(0, 80) || 'empty content'}`}
            width={280}
            height={280}
            loading="lazy"
            decoding="async"
            className="rounded-lg bg-white p-2 shadow-sm"
          />
          <p className="max-w-sm break-all text-center text-xs text-surface-500">
            {text.trim() || 'Enter content to generate a QR code'}
          </p>
        </div>
      </ToolPanel>
    </div>
  )
}
