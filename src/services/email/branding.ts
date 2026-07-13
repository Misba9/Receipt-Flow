/**
 * Helpers for multi-tenant invoice email branding.
 * Mailbox comes from the platform; display name / reply-to from the company.
 */

/** Build a RFC-safe From header: "Display Name" <mailbox@domain> */
export function formatInvoiceFromAddress(
  senderName: string,
  fromEmail: string,
): string {
  const name = senderName.trim()
  const email = fromEmail.trim().toLowerCase()
  const escaped = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `"${escaped}" <${email}>`
}

export function buildInvoiceEmailSubject(companyName: string): string {
  const name = companyName.trim()
  if (!name) throw new Error('Company name is required for the email subject.')
  return `Invoice from ${name}`
}
