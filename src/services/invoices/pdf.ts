import {
  downloadStoredInvoicePdf,
  uploadInvoicePdf,
} from '@/services/invoices/api'
import type { InvoiceDetail, PaymentMode } from '@/services/invoices/types'
import { PAYMENT_MODE_LABELS } from '@/services/invoices/types'
import type { CompanySettings } from '@/services/settings/types'
import { formatDate } from '@/lib/format'

const PAGE_WIDTH = 595.28 // A4
const PAGE_HEIGHT = 841.89
const MARGIN = 48
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

type PdfLib = typeof import('pdf-lib')
type PDFDocument = Awaited<ReturnType<PdfLib['PDFDocument']['create']>>
type PDFFont = Awaited<ReturnType<PDFDocument['embedFont']>>
type PDFImage = Awaited<ReturnType<PDFDocument['embedPng']>>
type PDFPage = ReturnType<PDFDocument['addPage']>
type RGB = ReturnType<PdfLib['rgb']>

type PdfColors = {
  brand: RGB
  text: RGB
  muted: RGB
  line: RGB
  headerBg: RGB
}

/** Helvetica uses WinAnsi — replace symbols that cannot be encoded (e.g. ₹). */
function toPdfSafeText(value: string) {
  const text = value
    .replaceAll('₹', 'Rs.')
    .replaceAll('€', 'EUR ')
    .replaceAll('₩', 'KRW ')
    .replaceAll('₪', 'ILS ')
    .replaceAll('₴', 'UAH ')
    .replaceAll('₦', 'NGN ')
    .replaceAll('₽', 'RUB ')
    .replaceAll('₫', 'VND ')
    .replaceAll('฿', 'THB ')
    .replaceAll('₱', 'PHP ')
    .replaceAll('−', '-') // U+2212 minus
    .replaceAll('–', '-') // en dash
    .replaceAll('—', '-') // em dash

  // Drop characters outside Latin-1 (WinAnsi-compatible set for Helvetica)
  let safe = ''
  for (const char of text) {
    const code = char.charCodeAt(0)
    if (code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 255)) {
      safe += char
    } else {
      safe += '?'
    }
  }
  return safe
}

function hexToRgb(pdfLib: PdfLib, hex: string): RGB {
  const cleaned = hex.replace('#', '').trim()
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned.padEnd(6, '0').slice(0, 6)

  const value = Number.parseInt(full, 16)
  if (Number.isNaN(value)) return pdfLib.rgb(0.1, 0.45, 0.96)

  return pdfLib.rgb(
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  )
}

/** ASCII-safe money for PDF (avoids ₹ and other non-WinAnsi currency glyphs). */
function formatMoney(amount: number, currency: string) {
  const code = currency.trim().toUpperCase() || 'USD'
  const number = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)

  const prefixByCode: Record<string, string> = {
    USD: '$',
    CAD: 'CA$',
    AUD: 'A$',
    NZD: 'NZ$',
    GBP: '£',
    INR: 'Rs.',
    EUR: 'EUR ',
    JPY: 'JPY ',
    CNY: 'CNY ',
    AED: 'AED ',
    SAR: 'SAR ',
  }

  const prefix = prefixByCode[code] ?? `${code} `
  return toPdfSafeText(`${prefix}${number}`)
}

function formatPaymentModeLabel(
  mode: PaymentMode | null | undefined,
  other?: string | null,
) {
  if (!mode) return null
  if (mode === 'other') {
    const custom = other?.trim()
    return custom || 'Other'
  }
  return PAYMENT_MODE_LABELS[mode]
}

function companyAddressLines(company: CompanySettings) {
  const lines: string[] = []
  if (company.addressLine1) lines.push(company.addressLine1)
  if (company.addressLine2) lines.push(company.addressLine2)

  const cityLine = [company.city, company.state, company.postalCode]
    .filter(Boolean)
    .join(', ')
  if (cityLine) lines.push(cityLine)
  if (company.country) lines.push(company.country)

  return lines
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = toPdfSafeText(text).split(/\s+/).filter(Boolean)
  if (words.length === 0) return ['']

  const lines: string[] = []
  let current = words[0]

  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next
    } else {
      lines.push(current)
      current = words[i]
    }
  }

  lines.push(current)
  return lines
}

async function embedLogo(
  pdf: PDFDocument,
  logoUrl: string | null,
): Promise<PDFImage | null> {
  if (!logoUrl) return null

  try {
    const response = await fetch(logoUrl)
    if (!response.ok) return null

    const bytes = await response.arrayBuffer()
    const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
    const lowerUrl = logoUrl.toLowerCase()

    if (contentType.includes('png') || lowerUrl.includes('.png')) {
      return pdf.embedPng(bytes)
    }

    if (
      contentType.includes('jpeg') ||
      contentType.includes('jpg') ||
      lowerUrl.includes('.jpg') ||
      lowerUrl.includes('.jpeg')
    ) {
      return pdf.embedJpg(bytes)
    }

    try {
      return await pdf.embedPng(bytes)
    } catch {
      return await pdf.embedJpg(bytes)
    }
  } catch {
    return null
  }
}

function drawRightText(
  page: PDFPage,
  text: string,
  xRight: number,
  y: number,
  font: PDFFont,
  size: number,
  color: RGB,
) {
  const safe = toPdfSafeText(text)
  const width = font.widthOfTextAtSize(safe, size)
  page.drawText(safe, {
    x: xRight - width,
    y,
    size,
    font,
    color,
  })
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color: RGB,
  maxWidth: number,
  lineHeight = size + 4,
) {
  const lines = wrapText(toPdfSafeText(text), font, size, maxWidth)
  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * lineHeight,
      size,
      font,
      color,
    })
  })
  return lines.length * lineHeight
}

function drawContinuationHeader(
  page: PDFPage,
  fontBold: PDFFont,
  colors: PdfColors,
  invoiceNumber: string,
) {
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 6,
    width: PAGE_WIDTH,
    height: 6,
    color: colors.brand,
  })
  page.drawText(`Invoice ${invoiceNumber} (continued)`, {
    x: MARGIN,
    y: PAGE_HEIGHT - MARGIN,
    size: 10,
    font: fontBold,
    color: colors.muted,
  })
}

function drawFooter(
  page: PDFPage,
  font: PDFFont,
  colors: PdfColors,
  company: CompanySettings,
  invoice: InvoiceDetail,
) {
  const footer =
    invoice.footer?.trim() ||
    company.invoiceFooter?.trim() ||
    'Thank you for your business.'

  page.drawRectangle({
    x: MARGIN,
    y: MARGIN + 28,
    width: CONTENT_WIDTH,
    height: 0.75,
    color: colors.line,
  })

  const lines = wrapText(footer, font, 8, CONTENT_WIDTH)
  lines.slice(0, 3).forEach((line, index) => {
    page.drawText(line, {
      x: MARGIN,
      y: MARGIN + 14 - index * 10,
      size: 8,
      font,
      color: colors.muted,
    })
  })
}

/**
 * Generates a professional A4 invoice PDF and returns it as a Blob.
 */
export async function generateInvoicePdf(
  invoice: InvoiceDetail,
  company: CompanySettings,
): Promise<Blob> {
  const pdfLib = await import('pdf-lib')
  const { PDFDocument, StandardFonts, rgb } = pdfLib

  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = await embedLogo(pdf, company.logoUrl)

  const colors: PdfColors = {
    brand: hexToRgb(pdfLib, company.primaryColor || '#1a73f5'),
    text: rgb(0.09, 0.11, 0.16),
    muted: rgb(0.39, 0.45, 0.55),
    line: rgb(0.89, 0.91, 0.94),
    headerBg: rgb(0.96, 0.97, 0.98),
  }

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN + 60) {
      drawFooter(page, font, colors, company, invoice)
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      y = PAGE_HEIGHT - MARGIN
      drawContinuationHeader(page, fontBold, colors, invoice.invoice_number)
      y -= 36
    }
  }

  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 8,
    width: PAGE_WIDTH,
    height: 8,
    color: colors.brand,
  })

  const logoSize = 56
  let companyTextX = MARGIN

  if (logo) {
    const scale = Math.min(logoSize / logo.width, logoSize / logo.height)
    const w = logo.width * scale
    const h = logo.height * scale
    page.drawImage(logo, {
      x: MARGIN,
      y: y - h,
      width: w,
      height: h,
    })
    companyTextX = MARGIN + w + 14
  }

  page.drawText(toPdfSafeText(company.name || 'Company'), {
    x: companyTextX,
    y: y - 14,
    size: 16,
    font: fontBold,
    color: colors.text,
  })

  let companyY = y - 32
  const detailLines = [
    ...companyAddressLines(company),
    company.phone ? `Phone: ${company.phone}` : '',
    company.email ? `Email: ${company.email}` : '',
    company.website ? `Web: ${company.website}` : '',
    company.taxId ? `GST / Tax ID: ${company.taxId}` : '',
  ].filter(Boolean)

  detailLines.forEach((line) => {
    page.drawText(line, {
      x: companyTextX,
      y: companyY,
      size: 9,
      font,
      color: colors.muted,
    })
    companyY -= 12
  })

  const metaRight = PAGE_WIDTH - MARGIN
  page.drawText('INVOICE', {
    x: metaRight - fontBold.widthOfTextAtSize('INVOICE', 22),
    y: y - 16,
    size: 22,
    font: fontBold,
    color: colors.brand,
  })

  drawRightText(
    page,
    invoice.invoice_number,
    metaRight,
    y - 36,
    fontBold,
    11,
    colors.text,
  )
  drawRightText(
    page,
    `Billing date: ${formatDate(invoice.issue_date, undefined, company.timezone)}`,
    metaRight,
    y - 52,
    font,
    9,
    colors.muted,
  )
  const paymentLabel = formatPaymentModeLabel(
    invoice.payment_mode,
    invoice.payment_mode_other,
  )
  let metaY = y - 66
  if (paymentLabel) {
    drawRightText(
      page,
      `Payment mode: ${paymentLabel}`,
      metaRight,
      metaY,
      font,
      9,
      colors.muted,
    )
    metaY -= 14
  }
  drawRightText(
    page,
    `Status: ${invoice.status.toUpperCase()}`,
    metaRight,
    metaY,
    font,
    9,
    colors.muted,
  )

  y = Math.min(companyY, metaY - 16) - 12

  page.drawRectangle({
    x: MARGIN,
    y,
    width: CONTENT_WIDTH,
    height: 1.5,
    color: colors.brand,
  })
  y -= 24

  page.drawText('BILL TO', {
    x: MARGIN,
    y,
    size: 8,
    font: fontBold,
    color: colors.brand,
  })
  y -= 16

  page.drawText(toPdfSafeText(invoice.customer?.name ?? 'Customer'), {
    x: MARGIN,
    y,
    size: 12,
    font: fontBold,
    color: colors.text,
  })
  y -= 14

  const customerLines = [
    invoice.customer?.address_line1,
    invoice.customer?.email,
    invoice.customer?.phone,
  ].filter(Boolean) as string[]

  customerLines.forEach((line) => {
    const wrapped = wrapText(line, font, 9, CONTENT_WIDTH * 0.55)
    wrapped.forEach((part) => {
      page.drawText(part, {
        x: MARGIN,
        y,
        size: 9,
        font,
        color: colors.muted,
      })
      y -= 12
    })
  })

  y -= 10
  const billMeta = [
    invoice.employee_name ? `Employee: ${invoice.employee_name}` : '',
  ].filter(Boolean)

  billMeta.forEach((line) => {
    const wrapped = wrapText(line, font, 9, CONTENT_WIDTH * 0.55)
    wrapped.forEach((part) => {
      page.drawText(part, {
        x: MARGIN,
        y,
        size: 9,
        font,
        color: colors.muted,
      })
      y -= 12
    })
  })

  y -= 18

  const col = {
    no: MARGIN,
    product: MARGIN + 28,
    qty: MARGIN + 320,
    price: MARGIN + 380,
    amount: PAGE_WIDTH - MARGIN,
  }
  const productWidth = col.qty - col.product - 12
  const rowHeight = 22

  const drawTableHeader = () => {
    page.drawRectangle({
      x: MARGIN,
      y: y - 6,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: colors.headerBg,
    })
    page.drawText('#', {
      x: col.no,
      y,
      size: 8,
      font: fontBold,
      color: colors.muted,
    })
    page.drawText('PRODUCT', {
      x: col.product,
      y,
      size: 8,
      font: fontBold,
      color: colors.muted,
    })
    drawRightText(page, 'QTY', col.qty + 30, y, fontBold, 8, colors.muted)
    drawRightText(page, 'AMOUNT', col.price + 40, y, fontBold, 8, colors.muted)
    drawRightText(page, 'TOTAL', col.amount, y, fontBold, 8, colors.muted)
    y -= rowHeight
  }

  drawTableHeader()

  invoice.items.forEach((item, index) => {
    const productLabel = item.product_type
      ? `${item.description} (${item.product_type})`
      : item.description
    const descriptionLines = wrapText(productLabel, font, 9, productWidth)
    const blockHeight = Math.max(rowHeight, descriptionLines.length * 12 + 8)

    ensureSpace(blockHeight + 8)

    if (index % 2 === 1) {
      page.drawRectangle({
        x: MARGIN,
        y: y - blockHeight + 10,
        width: CONTENT_WIDTH,
        height: blockHeight,
        color: rgb(0.99, 0.99, 1),
      })
    }

    page.drawText(String(index + 1), {
      x: col.no,
      y: y - 2,
      size: 9,
      font,
      color: colors.muted,
    })

    descriptionLines.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: col.product,
        y: y - 2 - lineIndex * 12,
        size: 9,
        font,
        color: colors.text,
      })
    })

    drawRightText(
      page,
      String(item.quantity),
      col.qty + 30,
      y - 2,
      font,
      9,
      colors.text,
    )
    drawRightText(
      page,
      formatMoney(item.unit_price, invoice.currency),
      col.price + 40,
      y - 2,
      font,
      9,
      colors.text,
    )
    drawRightText(
      page,
      formatMoney(item.amount, invoice.currency),
      col.amount,
      y - 2,
      fontBold,
      9,
      colors.text,
    )

    y -= blockHeight
    page.drawRectangle({
      x: MARGIN,
      y: y + 4,
      width: CONTENT_WIDTH,
      height: 0.5,
      color: colors.line,
    })
  })

  y -= 16

  const totalRows: Array<{ label: string; value: string }> = [
      {
        label: 'Subtotal',
        value: formatMoney(invoice.subtotal, invoice.currency),
      },
    ]
  if (invoice.discount_amount > 0) {
    totalRows.push({
      label: 'Discount',
      value: `-${formatMoney(invoice.discount_amount, invoice.currency)}`,
    })
  }
  totalRows.push({
    label: `GST (${invoice.tax_rate}%)`,
    value: formatMoney(invoice.tax_amount, invoice.currency),
  })

  const totalsRowGap = 18
  const grandSize = 11
  const grandPadX = 10
  const grandPadY = 8
  const grandBoxHeight = grandSize + grandPadY * 2
  const totalsNeeded =
    totalRows.length * totalsRowGap + grandBoxHeight + 28
  ensureSpace(totalsNeeded)

  const maxValueWidth = Math.max(
    ...totalRows.map((row) =>
      font.widthOfTextAtSize(toPdfSafeText(row.value), 10),
    ),
    fontBold.widthOfTextAtSize(
      toPdfSafeText(formatMoney(invoice.total, invoice.currency)),
      grandSize,
    ),
  )
  const maxLabelWidth = Math.max(
    ...totalRows.map((row) =>
      font.widthOfTextAtSize(toPdfSafeText(row.label), 10),
    ),
    fontBold.widthOfTextAtSize('Grand Total', grandSize),
  )
  const totalsInnerGap = 16
  const totalsBoxWidth = Math.min(
    CONTENT_WIDTH * 0.48,
    Math.ceil(maxLabelWidth + totalsInnerGap + maxValueWidth + grandPadX * 2),
  )
  const totalsBoxRight = PAGE_WIDTH - MARGIN
  const totalsBoxLeft = totalsBoxRight - totalsBoxWidth
  const totalsLabelX = totalsBoxLeft + grandPadX
  const totalsValueX = totalsBoxRight - grandPadX

  for (const row of totalRows) {
    page.drawText(toPdfSafeText(row.label), {
      x: totalsLabelX,
      y,
      size: 10,
      font,
      color: colors.muted,
    })
    drawRightText(
      page,
      row.value,
      totalsValueX,
      y,
      font,
      10,
      colors.text,
    )
    y -= totalsRowGap
  }

  // Clear gap so the Grand Total chip never overlaps GST / Discount lines
  y -= 6
  const grandBoxBottom = y - grandBoxHeight
  page.drawRectangle({
    x: totalsBoxLeft,
    y: grandBoxBottom,
    width: totalsBoxWidth,
    height: grandBoxHeight,
    color: colors.headerBg,
  })

  const grandTextY = grandBoxBottom + grandPadY
  page.drawText(toPdfSafeText('Grand Total'), {
    x: totalsLabelX,
    y: grandTextY,
    size: grandSize,
    font: fontBold,
    color: colors.brand,
  })
  drawRightText(
    page,
    formatMoney(invoice.total, invoice.currency),
    totalsValueX,
    grandTextY,
    fontBold,
    grandSize,
    colors.brand,
  )
  y = grandBoxBottom - 10

  if (invoice.notes?.trim()) {
    y -= 8
    ensureSpace(60)
    page.drawText('COMMENTS', {
      x: MARGIN,
      y,
      size: 8,
      font: fontBold,
      color: colors.brand,
    })
    y -= 14
    const notesHeight = drawWrappedText(
      page,
      invoice.notes.trim(),
      MARGIN,
      y,
      font,
      9,
      colors.muted,
      Math.min(CONTENT_WIDTH * 0.55, totalsBoxLeft - MARGIN - 12),
    )
    y -= notesHeight
  }

  drawFooter(page, font, colors, company, invoice)

  const pdfBytes = await pdf.save()
  const buffer = new ArrayBuffer(pdfBytes.byteLength)
  new Uint8Array(buffer).set(pdfBytes)
  return new Blob([buffer], { type: 'application/pdf' })
}

/**
 * Triggers a browser download for the given PDF blob.
 */
export function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export type DownloadInvoicePdfResult = {
  blob: Blob
  pdfUrl: string | null
  fromStorage: boolean
}

/**
 * Downloads an invoice PDF.
 * - If a stored PDF exists in Supabase Storage, downloads that file.
 * - Otherwise generates a new PDF, uploads it, stores the path on the invoice, then downloads.
 */
export async function downloadInvoicePdf(
  invoice: InvoiceDetail,
  company: CompanySettings,
  options?: { regenerate?: boolean },
): Promise<DownloadInvoicePdfResult> {
  if (invoice.pdf_url && !options?.regenerate) {
    try {
      const blob = await downloadStoredInvoicePdf(invoice.pdf_url)
      downloadPdfBlob(blob, `${invoice.invoice_number}.pdf`)
      return { blob, pdfUrl: invoice.pdf_url, fromStorage: true }
    } catch {
      // Fall through and regenerate if the stored object is missing
    }
  }

  const blob = await generateInvoicePdf(invoice, company)
  const pdfUrl = await uploadInvoicePdf(invoice, blob)
  downloadPdfBlob(blob, `${invoice.invoice_number}.pdf`)
  return { blob, pdfUrl, fromStorage: false }
}
