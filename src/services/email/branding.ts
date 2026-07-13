/**
 * Helpers for platform invoice email From headers.
 * Mailbox is always the global verified domain; display name is the company name.
 */

const PLATFORM_DISPLAY_NAME = 'ReceiptFlow'
const DEFAULT_PLATFORM_FROM = 'noreply@velonerp.com'

/** Build a RFC-safe From header: "Company Name" <noreply@velonerp.com> */
export function formatInvoiceFromAddress(
  companyName: string,
  fromEmail: string = DEFAULT_PLATFORM_FROM,
): string {
  const name = companyName.trim() || PLATFORM_DISPLAY_NAME
  const email = fromEmail.trim().toLowerCase() || DEFAULT_PLATFORM_FROM
  const escaped = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `"${escaped}" <${email}>`
}

export function getPlatformFromEmail(): string {
  return (
    (import.meta.env.VITE_EMAIL_FROM as string | undefined)?.trim() ||
    DEFAULT_PLATFORM_FROM
  )
}
