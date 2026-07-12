import { supabase } from '@/lib/supabase'

export type SendInvoiceEmailResult = {
  ok: true
  id: string | null
  to: string
  subject: string
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
    throw new Error(error.message || 'Unable to send invoice email.')
  }

  if (data?.error) {
    throw new Error(String(data.error))
  }

  return data as SendInvoiceEmailResult
}
