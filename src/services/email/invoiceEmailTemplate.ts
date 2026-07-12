import type { BuildInvoiceEmailInput } from '@/services/email/types'

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(Number(amount) || 0)
  } catch {
    return `${currency} ${Number(amount || 0).toFixed(2)}`
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** Shared HTML template used by Preview Email and (mirrored by) the Edge Function. */
export function buildInvoiceEmailHtml(input: BuildInvoiceEmailInput): string {
  const {
    companyName,
    companyEmail,
    companyPhone,
    customerName,
    invoiceNumber,
    issueDate,
    currency,
    subtotal,
    discount,
    taxRate,
    taxAmount,
    total,
    brandColor,
    appUrl,
  } = input

  const safeCompany = escapeHtml(companyName)
  const safeCustomer = escapeHtml(customerName)
  const safeInvoice = escapeHtml(invoiceNumber)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${safeInvoice}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="height:6px;background:${escapeHtml(brandColor)};"></td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Invoice</p>
              <h1 style="margin:8px 0 0 0;font-size:24px;line-height:1.3;color:#0f172a;">${safeInvoice}</h1>
              <p style="margin:8px 0 0 0;font-size:15px;color:#475569;">From <strong style="color:#0f172a;">${safeCompany}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px 32px;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">
                Hi ${safeCustomer},
              </p>
              <p style="margin:12px 0 0 0;font-size:15px;line-height:1.6;color:#334155;">
                Please find your invoice attached as a PDF. A summary is included below for your records.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:16px 18px;font-size:13px;color:#64748b;width:50%;">Billing date</td>
                  <td style="padding:16px 18px;font-size:13px;color:#0f172a;text-align:right;font-weight:600;">${escapeHtml(issueDate)}</td>
                </tr>
                <tr>
                  <td style="padding:0 18px 12px 18px;font-size:13px;color:#64748b;">Subtotal</td>
                  <td style="padding:0 18px 12px 18px;font-size:13px;color:#0f172a;text-align:right;">${escapeHtml(formatMoney(subtotal, currency))}</td>
                </tr>
                ${
                  discount > 0
                    ? `<tr>
                  <td style="padding:0 18px 12px 18px;font-size:13px;color:#64748b;">Discount</td>
                  <td style="padding:0 18px 12px 18px;font-size:13px;color:#0f172a;text-align:right;">−${escapeHtml(formatMoney(discount, currency))}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding:0 18px 12px 18px;font-size:13px;color:#64748b;">GST (${escapeHtml(String(taxRate))}%)</td>
                  <td style="padding:0 18px 12px 18px;font-size:13px;color:#0f172a;text-align:right;">${escapeHtml(formatMoney(taxAmount, currency))}</td>
                </tr>
                <tr>
                  <td style="padding:8px 18px 16px 18px;font-size:15px;color:#0f172a;font-weight:700;border-top:1px solid #e2e8f0;">Grand total</td>
                  <td style="padding:8px 18px 16px 18px;font-size:15px;color:${escapeHtml(brandColor)};text-align:right;font-weight:700;border-top:1px solid #e2e8f0;">${escapeHtml(formatMoney(total, currency))}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px 32px;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
                The full invoice PDF is attached to this email. If you have any questions, reply to this message or contact ${safeCompany}${companyEmail ? ` at ${escapeHtml(companyEmail)}` : ''}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Sent by ${safeCompany} via <a href="${escapeHtml(appUrl)}" style="color:#64748b;text-decoration:none;">ReceiptFlow</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildInvoiceEmailSubject(companyName: string): string {
  return `Invoice from ${companyName || 'Company'}`
}
