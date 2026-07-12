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
 * Invokes the Supabase Edge Function that emails the invoice PDF via Resend.
 * Requires RESEND_API_KEY + RESEND_FROM_EMAIL as function secrets (not VITE_ vars).
 */
export async function sendInvoiceEmail(
  invoiceId: string,
): Promise<SendInvoiceEmailResult> {
  const { data, error } = await supabase.functions.invoke('send-invoice-email', {
    body: { invoiceId },
  })

  if (error) {
    throw new Error(await messageFromFunctionsError(error))
  }

  if (data?.error) {
    throw new Error(String(data.error))
  }

  return data as SendInvoiceEmailResult
}
