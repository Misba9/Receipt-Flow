import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type InvoiceEmailSendMode = 'automatic' | 'manual'

export type InvokeSendInvoiceEmailOptions = {
  /** automatic = content fingerprint (create-bill); manual = fresh UUID per click */
  sendMode?: InvoiceEmailSendMode
  /** For manual sends: pass a new UUID every click. Generated if omitted. */
  idempotencyKey?: string
}

export type SendInvoiceEmailResult = {
  ok: true
  id: string | null
  to: string
  subject: string
  from?: string
}

const FRIENDLY_SEND_ERROR = 'Unable to send email. Please try again later.'

function isIdempotencyConflictMessage(message: string) {
  const lower = message.toLowerCase()
  return (
    lower.includes('idempotency') ||
    lower.includes("doesn't match the original request") ||
    lower.includes('does not match the original request')
  )
}

function toClientEmailError(message: string) {
  if (isIdempotencyConflictMessage(message)) {
    return FRIENDLY_SEND_ERROR
  }
  return message.trim() || FRIENDLY_SEND_ERROR
}

async function messageFromFunctionsError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const payload = await error.context.json()
      if (payload && typeof payload === 'object') {
        const body = payload as Record<string, unknown>
        if (typeof body.error === 'string' && body.error.trim()) {
          return toClientEmailError(body.error)
        }
        if (typeof body.message === 'string' && body.message.trim()) {
          return toClientEmailError(body.message)
        }
      }
    } catch {
      // fall through
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return toClientEmailError(error.message)
  }

  return FRIENDLY_SEND_ERROR
}

function createManualIdempotencyKey() {
  return `rf-manual-${crypto.randomUUID()}`
}

/**
 * Production transport: invokes the Supabase Edge Function (Resend).
 * Prefer `EmailService.sendInvoiceEmail` from app code so development mode is respected.
 */
export async function invokeSendInvoiceEmail(
  invoiceId: string,
  options: InvokeSendInvoiceEmailOptions = {},
): Promise<SendInvoiceEmailResult> {
  const sendMode = options.sendMode ?? 'automatic'
  const idempotencyKey =
    sendMode === 'manual'
      ? options.idempotencyKey?.trim() || createManualIdempotencyKey()
      : options.idempotencyKey?.trim() || undefined

  const { data, error } = await supabase.functions.invoke('send-invoice-email', {
    body: {
      invoiceId,
      sendMode,
      ...(idempotencyKey ? { idempotencyKey } : {}),
    },
  })

  if (error) {
    console.error('[email] send-invoice-email invoke failed', error)
    throw new Error(await messageFromFunctionsError(error))
  }

  if (data?.success === false && data?.message) {
    console.error('[email] send-invoice-email rejected', data)
    throw new Error(toClientEmailError(String(data.message)))
  }

  if (data?.error) {
    console.error('[email] send-invoice-email error payload', data)
    throw new Error(toClientEmailError(String(data.error)))
  }

  return data as SendInvoiceEmailResult
}

/** @deprecated Use EmailService.sendInvoiceEmail — kept for compatibility. */
export async function sendInvoiceEmail(
  invoiceId: string,
  options?: InvokeSendInvoiceEmailOptions,
): Promise<SendInvoiceEmailResult> {
  const { EmailService } = await import('@/services/email/EmailService')
  const result = await EmailService.sendInvoiceEmail(invoiceId, options)

  return {
    ok: true,
    id: result.id ?? null,
    to: result.to ?? '',
    subject: result.subject ?? '',
  }
}
