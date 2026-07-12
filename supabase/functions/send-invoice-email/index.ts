/**
 * Sends an invoice email via Resend with the stored PDF attached.
 *
 * Secrets (never hardcode):
 *   RESEND_API_KEY
 *   RESEND_FROM_EMAIL          e.g. "ReceiptFlow <noreply@velonerp.com>"
 *   RESEND_VERIFIED_DOMAIN     e.g. "velonerp.com"
 *   APP_URL
 *
 * Deploy:
 *   supabase functions deploy send-invoice-email
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import {
  corsHeaders,
  handleCorsPreflightRequest,
  jsonResponse,
} from '../_shared/cors.ts'

type InvoiceRow = {
  id: string
  company_id: string
  invoice_number: string
  issue_date: string
  due_date: string | null
  currency: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_amount: number
  total: number
  pdf_url: string | null
  status: string
  customer: {
    name: string
    email: string | null
  } | null
}

type CompanyRow = {
  name: string
  email: string | null
  phone: string | null
  tax_id: string | null
  primary_color?: string
}

/** Default production sender for the verified velonerp.com domain. */
const DEFAULT_FROM = 'ReceiptFlow <noreply@velonerp.com>'
const DEFAULT_VERIFIED_DOMAIN = 'velonerp.com'

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

function buildInvoiceEmailHtml(params: {
  companyName: string
  companyEmail: string | null
  companyPhone: string | null
  customerName: string
  invoiceNumber: string
  issueDate: string
  dueDate: string | null
  currency: string
  subtotal: number
  discount: number
  taxRate: number
  taxAmount: number
  total: number
  brandColor: string
  appUrl: string
}) {
  const {
    companyName,
    companyEmail,
    companyPhone,
    customerName,
    invoiceNumber,
    issueDate,
    dueDate,
    currency,
    subtotal,
    discount,
    taxRate,
    taxAmount,
    total,
    brandColor,
    appUrl,
  } = params

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
                  <td style="padding:16px 18px;font-size:13px;color:#64748b;width:50%;">Issue date</td>
                  <td style="padding:16px 18px;font-size:13px;color:#0f172a;text-align:right;font-weight:600;">${escapeHtml(issueDate)}</td>
                </tr>
                ${
                  dueDate
                    ? `<tr>
                  <td style="padding:0 18px 16px 18px;font-size:13px;color:#64748b;">Due date</td>
                  <td style="padding:0 18px 16px 18px;font-size:13px;color:#0f172a;text-align:right;font-weight:600;">${escapeHtml(dueDate)}</td>
                </tr>`
                    : ''
                }
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

function buildInvoiceEmailText(params: {
  companyName: string
  customerName: string
  invoiceNumber: string
  total: number
  currency: string
}) {
  return [
    `Hi ${params.customerName},`,
    '',
    `Please find invoice ${params.invoiceNumber} from ${params.companyName} attached as a PDF.`,
    `Grand total: ${formatMoney(params.total, params.currency)}`,
    '',
    'Thank you.',
  ].join('\n')
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

/** Extracts bare email from `Name <email@domain>` or plain `email@domain`. */
function extractEmailAddress(from: string): string | null {
  const angled = from.match(/<([^>]+)>/)
  const candidate = (angled?.[1] ?? from).trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) return null
  return candidate
}

function extractDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? ''
}

/**
 * Ensures the configured sender uses the verified production domain
 * (or a subdomain of it).
 */
function isSenderDomainVerified(
  fromAddress: string,
  verifiedDomain: string,
): boolean {
  const email = extractEmailAddress(fromAddress)
  if (!email) return false

  const senderDomain = extractDomain(email)
  const allowed = verifiedDomain.trim().toLowerCase().replace(/^\.+/, '')
  if (!allowed || !senderDomain) return false

  return senderDomain === allowed || senderDomain.endsWith(`.${allowed}`)
}

function resendErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== 'object') return fallback
  const row = body as Record<string, unknown>
  if (typeof row.message === 'string' && row.message.trim()) return row.message
  if (typeof row.name === 'string' && typeof row.message === 'string') {
    return row.message
  }
  if (typeof row.error === 'string' && row.error.trim()) return row.error
  if (row.error && typeof row.error === 'object') {
    const nested = row.error as Record<string, unknown>
    if (typeof nested.message === 'string' && nested.message.trim()) {
      return nested.message
    }
  }
  try {
    return JSON.stringify(body)
  } catch {
    return fallback
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest()
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const resendFromEmail =
      Deno.env.get('RESEND_FROM_EMAIL')?.trim() || DEFAULT_FROM
    const verifiedDomain =
      Deno.env.get('RESEND_VERIFIED_DOMAIN')?.trim() || DEFAULT_VERIFIED_DOMAIN
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'

    if (!resendApiKey) {
      return jsonResponse(
        {
          success: false,
          message: 'Email is not configured. Set RESEND_API_KEY secret.',
          error: 'Email is not configured. Set RESEND_API_KEY secret.',
        },
        500,
      )
    }

    if (!isSenderDomainVerified(resendFromEmail, verifiedDomain)) {
      console.error('Invalid sender domain', {
        from: resendFromEmail,
        verifiedDomain,
      })
      return jsonResponse(
        {
          success: false,
          message: 'Sender domain is not verified.',
          error: 'Sender domain is not verified.',
        },
        400,
      )
    }

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return jsonResponse(
        {
          success: false,
          message: 'Supabase environment is missing.',
          error: 'Supabase environment is missing.',
        },
        500,
      )
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing authorization header.',
          error: 'Missing authorization header.',
        },
        401,
      )
    }

    const { invoiceId } = (await req.json()) as { invoiceId?: string }
    if (!invoiceId) {
      return jsonResponse(
        {
          success: false,
          message: 'invoiceId is required.',
          error: 'invoiceId is required.',
        },
        400,
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const admin = createClient(supabaseUrl, serviceRoleKey)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return jsonResponse(
        {
          success: false,
          message: 'Unauthorized.',
          error: 'Unauthorized.',
        },
        401,
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile?.company_id) {
      return jsonResponse(
        {
          success: false,
          message: 'Company profile not found.',
          error: 'Company profile not found.',
        },
        403,
      )
    }

    const callerCompanyId = String(profile.company_id)

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(
        `
        id,
        company_id,
        invoice_number,
        issue_date,
        due_date,
        currency,
        subtotal,
        tax_rate,
        tax_amount,
        discount_amount,
        total,
        pdf_url,
        status,
        customer:customers(name, email)
      `,
      )
      .eq('id', invoiceId)
      .eq('company_id', callerCompanyId)
      .maybeSingle()

    if (invoiceError || !invoice) {
      const message = invoiceError?.message ?? 'Invoice not found.'
      return jsonResponse(
        { success: false, message, error: message },
        404,
      )
    }

    const row = invoice as unknown as InvoiceRow

    if (String(row.company_id) !== callerCompanyId) {
      return jsonResponse(
        {
          success: false,
          message: 'Invoice not found.',
          error: 'Invoice not found.',
        },
        404,
      )
    }

    const customerEmail = row.customer?.email?.trim()

    if (!customerEmail) {
      return jsonResponse(
        {
          success: false,
          message: 'Customer does not have an email address.',
          error: 'Customer does not have an email address.',
        },
        422,
      )
    }

    if (!row.pdf_url) {
      const message =
        'Invoice PDF has not been generated yet. Generate and upload the PDF first.'
      return jsonResponse({ success: false, message, error: message }, 422)
    }

    if (!row.pdf_url.startsWith(`${callerCompanyId}/`)) {
      return jsonResponse(
        {
          success: false,
          message: 'Invalid invoice PDF path.',
          error: 'Invalid invoice PDF path.',
        },
        422,
      )
    }

    const [{ data: company, error: companyError }, { data: settings }] =
      await Promise.all([
        supabase
          .from('companies')
          .select('name, email, phone, tax_id')
          .eq('id', callerCompanyId)
          .maybeSingle(),
        supabase
          .from('settings')
          .select('primary_color')
          .eq('company_id', callerCompanyId)
          .maybeSingle(),
      ])

    if (companyError || !company) {
      const message = companyError?.message ?? 'Company not found.'
      return jsonResponse(
        { success: false, message, error: message },
        404,
      )
    }

    const companyRow = company as CompanyRow
    const brandColor = settings?.primary_color ?? '#1a73f5'

    const { data: pdfFile, error: pdfError } = await admin.storage
      .from('invoice-pdfs')
      .download(row.pdf_url)

    if (pdfError || !pdfFile) {
      const message = pdfError?.message ?? 'Unable to download invoice PDF.'
      return jsonResponse(
        { success: false, message, error: message },
        500,
      )
    }

    const pdfBase64 = arrayBufferToBase64(await pdfFile.arrayBuffer())
    const companyName = companyRow.name || 'Company'
    const subject = `Invoice from ${companyName}`
    const attachmentName = `${row.invoice_number}.pdf`

    const html = buildInvoiceEmailHtml({
      companyName,
      companyEmail: companyRow.email,
      companyPhone: companyRow.phone,
      customerName: row.customer?.name ?? 'Customer',
      invoiceNumber: row.invoice_number,
      issueDate: row.issue_date,
      dueDate: row.due_date,
      currency: row.currency,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount_amount),
      taxRate: Number(row.tax_rate),
      taxAmount: Number(row.tax_amount),
      total: Number(row.total),
      brandColor,
      appUrl,
    })

    const text = buildInvoiceEmailText({
      companyName,
      customerName: row.customer?.name ?? 'Customer',
      invoiceNumber: row.invoice_number,
      total: Number(row.total),
      currency: row.currency,
    })

    const idempotencyKey = `invoice-email:${invoiceId}:${row.invoice_number}`

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        // Prevent duplicate sends on retries (Resend best practice)
        'Idempotency-Key': idempotencyKey.slice(0, 256),
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [customerEmail],
        subject,
        html,
        text,
        attachments: [
          {
            filename: attachmentName,
            content: pdfBase64,
            content_type: 'application/pdf',
          },
        ],
        tags: [
          { name: 'category', value: 'invoice' },
          { name: 'invoice_id', value: invoiceId },
        ],
      }),
    })

    const resendRaw = await resendResponse.text()
    let resendBody: unknown = null
    try {
      resendBody = resendRaw ? JSON.parse(resendRaw) : null
    } catch {
      resendBody = { raw: resendRaw }
    }

    if (!resendResponse.ok) {
      console.error('Resend API error — complete response:', {
        status: resendResponse.status,
        statusText: resendResponse.statusText,
        body: resendBody,
        raw: resendRaw,
      })

      const message = resendErrorMessage(
        resendBody,
        `Failed to send invoice email via Resend (HTTP ${resendResponse.status}).`,
      )

      return jsonResponse(
        {
          success: false,
          message,
          error: message,
        },
        400,
      )
    }

    const sent = (resendBody ?? {}) as Record<string, unknown>

    return jsonResponse({
      success: true,
      ok: true,
      id: sent.id ?? null,
      to: customerEmail,
      subject,
      from: resendFromEmail,
    })
  } catch (error) {
    console.error('send-invoice-email failed', error)
    const message =
      error instanceof Error ? error.message : 'Unexpected email failure.'
    return jsonResponse(
      {
        success: false,
        message,
        error: message,
      },
      500,
    )
  }
})

export { corsHeaders }
