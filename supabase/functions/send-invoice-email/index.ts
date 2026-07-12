/**
 * Sends an invoice email via Resend with the stored PDF attached.
 *
 * Secrets (supabase secrets set ...):
 *   RESEND_API_KEY
 *   RESEND_FROM_EMAIL   e.g. "ReceiptFlow <billing@yourdomain.com>"
 *
 * Deploy:
 *   supabase functions deploy send-invoice-email
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
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

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const resendFromEmail = Deno.env.get('RESEND_FROM_EMAIL')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:5173'

    if (!resendApiKey || !resendFromEmail) {
      return jsonResponse(
        {
          error:
            'Email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL secrets.',
        },
        500,
      )
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ error: 'Supabase environment is missing.' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ error: 'Missing authorization header.' }, 401)
    }

    const { invoiceId } = (await req.json()) as { invoiceId?: string }
    if (!invoiceId) {
      return jsonResponse({ error: 'invoiceId is required.' }, 400)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return jsonResponse({ error: 'Unauthorized.' }, 401)
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.company_id) {
      return jsonResponse({ error: 'Company profile not found.' }, 403)
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
      .single()

    if (invoiceError || !invoice) {
      return jsonResponse(
        { error: invoiceError?.message ?? 'Invoice not found.' },
        404,
      )
    }

    const row = invoice as unknown as InvoiceRow

    if (String(row.company_id) !== callerCompanyId) {
      return jsonResponse({ error: 'Invoice not found.' }, 404)
    }

    const customerEmail = row.customer?.email?.trim()

    if (!customerEmail) {
      return jsonResponse(
        { error: 'Customer does not have an email address.' },
        422,
      )
    }

    if (!row.pdf_url) {
      return jsonResponse(
        {
          error:
            'Invoice PDF has not been generated yet. Generate and upload the PDF first.',
        },
        422,
      )
    }

    if (!row.pdf_url.startsWith(`${callerCompanyId}/`)) {
      return jsonResponse({ error: 'Invalid invoice PDF path.' }, 422)
    }

    const [{ data: company, error: companyError }, { data: settings }] =
      await Promise.all([
        supabase
          .from('companies')
          .select('name, email, phone, tax_id')
          .eq('id', callerCompanyId)
          .single(),
        supabase
          .from('settings')
          .select('primary_color')
          .eq('company_id', callerCompanyId)
          .maybeSingle(),
      ])

    if (companyError || !company) {
      return jsonResponse(
        { error: companyError?.message ?? 'Company not found.' },
        404,
      )
    }

    const companyRow = company as CompanyRow
    const brandColor = settings?.primary_color ?? '#1a73f5'

    const { data: pdfFile, error: pdfError } = await supabase.storage
      .from('invoice-pdfs')
      .download(row.pdf_url)

    if (pdfError || !pdfFile) {
      return jsonResponse(
        { error: pdfError?.message ?? 'Unable to download invoice PDF.' },
        500,
      )
    }

    const pdfBase64 = arrayBufferToBase64(await pdfFile.arrayBuffer())
    const companyName = companyRow.name || 'Company'
    const subject = `Invoice from ${companyName}`

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

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [customerEmail],
        subject,
        html,
        attachments: [
          {
            filename: `${row.invoice_number}.pdf`,
            content: pdfBase64,
          },
        ],
      }),
    })

    const resendBody = await resendResponse.json()

    if (!resendResponse.ok) {
      return jsonResponse(
        {
          error:
            resendBody?.message ??
            resendBody?.error ??
            'Failed to send invoice email via Resend.',
        },
        502,
      )
    }

    return jsonResponse({
      ok: true,
      id: resendBody.id ?? null,
      to: customerEmail,
      subject,
    })
  } catch (error) {
    return jsonResponse(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected email failure.',
      },
      500,
    )
  }
})
