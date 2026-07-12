import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type SendInvoiceEmailResult = {
  ok: true
  id: string | null
  to: string
  subject: string
}

async function messageFromFunctionsError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const payload = await error.context.json()
      if (payload && typeof payload === 'object') {
        const body = payload as Record<string, unknown>
        if (typeof body.error === 'string' && body.error.trim()) {
          return body.error
        }
        if (typeof body.message === 'string' && body.message.trim()) {
          return body.message
        }
      }
    } catch {
      // fall through
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return 'Unable to send invoice email.'
}

/**
 * Production transport: invokes the Supabase Edge Function (Resend).
 * Prefer `EmailService.sendInvoiceEmail` from app code so development mode is respected.
 */
export async function invokeSendInvoiceEmail(
  invoiceId: string,
): Promise<SendInvoiceEmailResult> {
  const { data, error } = await supabase.functions.invoke('send-invoice-email', {
    body: { invoiceId },
  })

  if (error) {
    throw new Error(await messageFromFunctionsError(error))
  }

  if (data?.success === false && data?.message) {
    throw new Error(String(data.message))
  }

  if (data?.error) {
    throw new Error(String(data.error))
  }

  return data as SendInvoiceEmailResult
}

/** @deprecated Use EmailService.sendInvoiceEmail — kept for compatibility. */
export async function sendInvoiceEmail(
  invoiceId: string,
): Promise<SendInvoiceEmailResult> {
  const { EmailService } = await import('@/services/email/EmailService')
  const result = await EmailService.sendInvoiceEmail(invoiceId)

  return {
    ok: true,
    id: result.id ?? null,
    to: result.to ?? '',
    subject: result.subject ?? '',
  }
}
