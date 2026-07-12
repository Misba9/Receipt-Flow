/**
 * Sends an invoice email via Resend using the platform SaaS sender.
 *
 * Platform secrets only (never per-tenant keys):
 *   RESEND_API_KEY            — global Resend account
 *   RESEND_FROM_EMAIL         — SaaS From, e.g. "ReceiptFlow <billing@yourdomain.com>"
 *   APP_URL
 *
 * Idempotency:
 *   automatic — content fingerprint (safe retries of the same payload)
 *   manual    — fresh UUID per Send Email click
 *   On Resend key/body conflict — one retry with a new UUID, then a friendly error.
 *
 * Reply-To uses the company's business email when set.
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
  pdf_generated_at: string | null
  updated_at: string | null
  status: string
  customer: {
    name: string
    email: string | null
  } | null
}

type SendMode = 'automatic' | 'manual'

type SendInvoiceEmailRequest = {
  invoiceId?: string
  /** automatic = content fingerprint; manual = one-shot UUID per click */
  sendMode?: SendMode
  /** Required for manual sends; ignored for automatic */
  idempotencyKey?: string
}

const FRIENDLY_SEND_ERROR = 'Unable to send email. Please try again later.'


type CompanyEmailRow = {
  name: string
  email: string | null
  phone: string | null
  website: string | null
  tax_id: string | null
}

function parsePlatformFrom(raw: string): { fromAddress: string; fromEmail: string } {
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error('RESEND_FROM_EMAIL is empty.')
  }

  const angled = trimmed.match(/^(.+?)\s*<([^>]+)>$/)
  if (angled) {
    const email = angled[2].trim().toLowerCase()
    if (!isValidEmail(email)) {
      throw new Error('RESEND_FROM_EMAIL contains an invalid email.')
    }
    return {
      fromAddress: `${angled[1].trim()} <${email}>`,
      fromEmail: email,
    }
  }

  const email = trimmed.toLowerCase()
  if (!isValidEmail(email)) {
    throw new Error('RESEND_FROM_EMAIL is invalid.')
  }
  return { fromAddress: email, fromEmail: email }
}

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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
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
              <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">Hi ${safeCustomer},</p>
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
                The full invoice PDF is attached. Contact ${safeCompany}${companyEmail ? ` at ${escapeHtml(companyEmail)}` : ''}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Sent by ${safeCompany}${appUrl ? ` · <a href="${escapeHtml(appUrl)}" style="color:#64748b;text-decoration:none;">Open app</a>` : ''}
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

function resendErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== 'object') return fallback
  const row = body as Record<string, unknown>
  if (typeof row.message === 'string' && row.message.trim()) return row.message
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

function isIdempotencyConflict(message: string) {
  const lower = message.toLowerCase()
  return (
    lower.includes('idempotency') ||
    lower.includes("doesn't match the original request") ||
    lower.includes('does not match the original request')
  )
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/** Content fingerprint — changes when invoice totals or stored PDF change. */
async function buildAutomaticIdempotencyKey(row: InvoiceRow) {
  const fingerprint = [
    row.id,
    row.invoice_number,
    row.pdf_url ?? '',
    row.pdf_generated_at ?? '',
    row.updated_at ?? '',
    String(row.subtotal),
    String(row.discount_amount),
    String(row.tax_amount),
    String(row.total),
    row.currency,
    row.customer?.email?.trim().toLowerCase() ?? '',
  ].join('|')

  const hash = await sha256Hex(fingerprint)
  return `rf-auto-${hash}`.slice(0, 256)
}

function newManualIdempotencyKey() {
  return `rf-manual-${crypto.randomUUID()}`.slice(0, 256)
}

function resolveClientIdempotencyKey(
  sendMode: SendMode,
  provided: string | undefined,
  automaticKey: string,
) {
  if (sendMode === 'manual') {
    const trimmed = provided?.trim()
    if (trimmed) return trimmed.slice(0, 256)
    return newManualIdempotencyKey()
  }
  return automaticKey
}

type ResendSendResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: number; message: string; body: unknown; raw: string }

async function postResendEmail(
  resendApiKey: string,
  payload: Record<string, unknown>,
  idempotencyKey: string,
): Promise<ResendSendResult> {
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  })

  const resendRaw = await resendResponse.text()
  let resendBody: unknown = null
  try {
    resendBody = resendRaw ? JSON.parse(resendRaw) : null
  } catch {
    resendBody = { raw: resendRaw }
  }

  if (!resendResponse.ok) {
    const message = resendErrorMessage(
      resendBody,
      `Failed to send invoice email via Resend (HTTP ${resendResponse.status}).`,
    )
    return {
      ok: false,
      status: resendResponse.status,
      message,
      body: resendBody,
      raw: resendRaw,
    }
  }

  return {
    ok: true,
    body: (resendBody ?? {}) as Record<string, unknown>,
  }
}

/**
 * Send via Resend with idempotency.
 * On key/body conflict, retry once with a fresh UUID (Resend best practice for changed payloads).
 */
async function sendWithIdempotency(
  resendApiKey: string,
  payload: Record<string, unknown>,
  primaryKey: string,
) {
  const first = await postResendEmail(resendApiKey, payload, primaryKey)
  if (first.ok) return first

  if (!isIdempotencyConflict(first.message)) {
    return first
  }

  console.error('Resend idempotency conflict — retrying once with a fresh key', {
    status: first.status,
    message: first.message,
    body: first.body,
    previousKeyPrefix: primaryKey.slice(0, 24),
  })

  const retryKey = newManualIdempotencyKey()
  return postResendEmail(resendApiKey, payload, retryKey)
}

function fail(message: string, status: number) {
  return jsonResponse({ success: false, message, error: message }, status)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest()
  }

  if (req.method !== 'POST') {
    return fail('Method not allowed', 405)
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const resendFromEmail = Deno.env.get('RESEND_FROM_EMAIL')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const appUrl = Deno.env.get('APP_URL') ?? ''

    if (!resendApiKey) {
      return fail('Email is not configured. Set RESEND_API_KEY secret.', 500)
    }

    if (!resendFromEmail?.trim()) {
      return fail(
        'Email sender is not configured. Set RESEND_FROM_EMAIL secret.',
        500,
      )
    }

    let platformFrom: { fromAddress: string; fromEmail: string }
    try {
      platformFrom = parsePlatformFrom(resendFromEmail)
    } catch (error) {
      return fail(
        error instanceof Error ? error.message : 'Invalid RESEND_FROM_EMAIL.',
        500,
      )
    }

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return fail('Supabase environment is missing.', 500)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return fail('Missing authorization header.', 401)
    }

    const body = (await req.json()) as SendInvoiceEmailRequest
    const invoiceId = body.invoiceId
    const sendMode: SendMode =
      body.sendMode === 'manual' ? 'manual' : 'automatic'

    if (!invoiceId) {
      return fail('invoiceId is required.', 400)
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
      return fail('Unauthorized.', 401)
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile?.company_id) {
      return fail('Company profile not found.', 403)
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
        pdf_generated_at,
        updated_at,
        status,
        customer:customers(name, email)
      `,
      )
      .eq('id', invoiceId)
      .eq('company_id', callerCompanyId)
      .maybeSingle()

    if (invoiceError || !invoice) {
      return fail(invoiceError?.message ?? 'Invoice not found.', 404)
    }

    const row = invoice as unknown as InvoiceRow
    if (String(row.company_id) !== callerCompanyId) {
      return fail('Invoice not found.', 404)
    }

    const customerEmail = row.customer?.email?.trim()
    if (!customerEmail) {
      return fail('Customer does not have an email address.', 422)
    }

    if (!row.pdf_url) {
      return fail(
        'Invoice PDF has not been generated yet. Generate and upload the PDF first.',
        422,
      )
    }

    if (!row.pdf_url.startsWith(`${callerCompanyId}/`)) {
      return fail('Invalid invoice PDF path.', 422)
    }

    const [{ data: company, error: companyError }, { data: settings }] =
      await Promise.all([
        supabase
          .from('companies')
          .select('name, email, phone, website, tax_id')
          .eq('id', callerCompanyId)
          .maybeSingle(),
        supabase
          .from('settings')
          .select('primary_color')
          .eq('company_id', callerCompanyId)
          .maybeSingle(),
      ])

    if (companyError || !company) {
      return fail(companyError?.message ?? 'Company not found.', 404)
    }

    const companyRow = company as CompanyEmailRow
    const companyName = (companyRow.name ?? '').trim()
    if (!companyName) {
      return fail('Company name is missing. Update company settings.', 422)
    }

    const replyToRaw = (companyRow.email ?? '').trim().toLowerCase()
    if (replyToRaw && !isValidEmail(replyToRaw)) {
      return fail('Company email is invalid.', 422)
    }

    const brandColor = settings?.primary_color ?? '#1a73f5'
    const fromAddress = platformFrom.fromAddress
    const subject = `Invoice from ${companyName}`

    const { data: pdfFile, error: pdfError } = await admin.storage
      .from('invoice-pdfs')
      .download(row.pdf_url)

    if (pdfError || !pdfFile) {
      return fail(pdfError?.message ?? 'Unable to download invoice PDF.', 500)
    }

    const pdfBase64 = arrayBufferToBase64(await pdfFile.arrayBuffer())
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

    const automaticKey = await buildAutomaticIdempotencyKey(row)
    const idempotencyKey = resolveClientIdempotencyKey(
      sendMode,
      body.idempotencyKey,
      automaticKey,
    )

    const resendPayload: Record<string, unknown> = {
      from: fromAddress,
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
        { name: 'send_mode', value: sendMode },
      ],
    }

    if (replyToRaw) {
      resendPayload.reply_to = [replyToRaw]
    }

    const sendResult = await sendWithIdempotency(
      resendApiKey,
      resendPayload,
      idempotencyKey,
    )

    if (!sendResult.ok) {
      console.error('Resend API error — complete response:', {
        status: sendResult.status,
        message: sendResult.message,
        body: sendResult.body,
        raw: sendResult.raw,
        sendMode,
      })

      const clientMessage = isIdempotencyConflict(sendResult.message)
        ? FRIENDLY_SEND_ERROR
        : sendResult.message

      return fail(clientMessage, sendResult.status >= 500 ? 502 : 400)
    }

    const sent = sendResult.body

    return jsonResponse({
      success: true,
      ok: true,
      id: sent.id ?? null,
      to: customerEmail,
      subject,
      from: fromAddress,
    })
  } catch (error) {
    console.error('send-invoice-email failed', error)
    return fail(
      error instanceof Error ? error.message : 'Unexpected email failure.',
      500,
    )
  }
})

export { corsHeaders }
