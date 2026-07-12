import {
  downloadStoredInvoicePdf,
  uploadInvoicePdf,
} from '@/services/invoices/api'
import type { InvoiceDetail } from '@/services/invoices/types'
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
  if (invoice.due_date) {
    drawRightText(
      page,
      `Due: ${formatDate(invoice.due_date, undefined, company.timezone)}`,
      metaRight,
      y - 66,
      font,
      9,
      colors.muted,
    )
  }
  drawRightText(
    page,
    `Status: ${invoice.status.toUpperCase()}`,
    metaRight,
    y - 80,
    font,
    9,
    colors.muted,
  )

  y = Math.min(companyY, y - 96) - 12

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
    page.drawText(toPdfSafeText(line), {
      x: MARGIN,
      y,
      size: 9,
      font,
      color: colors.muted,
    })
    y -= 12
  })

  y -= 10
  const billMeta = [
    invoice.model ? `Model: ${invoice.model}` : '',
    invoice.place ? `Place: ${invoice.place}` : '',
    invoice.employee_name ? `Employee: ${invoice.employee_name}` : '',
    invoice.payment_mode
      ? `Payment: ${
          invoice.payment_mode === 'other'
            ? invoice.payment_mode_other || 'Other'
            : invoice.payment_mode.replaceAll('_', ' ')
        }`
      : '',
  ].filter(Boolean)

  billMeta.forEach((line) => {
    page.drawText(toPdfSafeText(line), {
      x: MARGIN,
      y,
      size: 9,
      font,
      color: colors.muted,
    })
    y -= 12
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
  ensureSpace(150)

  const totalsBoxWidth = 200
  const totalsXLabel = PAGE_WIDTH - MARGIN - totalsBoxWidth
  const totalsXValue = PAGE_WIDTH - MARGIN
  const totalsPadX = 8

  const drawTotalRow = (
    label: string,
    value: string,
    options?: { bold?: boolean; brand?: boolean; size?: number; gap?: number },
  ) => {
    const size = options?.size ?? 10
    const gap = options?.gap ?? Math.max(16, Math.ceil(size * 1.6))
    const rowFont = options?.bold ? fontBold : font
    const color = options?.brand ? colors.brand : colors.text

    page.drawText(toPdfSafeText(label), {
      x: totalsXLabel,
      y,
      size,
      font: rowFont,
      color: options?.brand ? colors.brand : colors.muted,
    })
    drawRightText(
      page,
      toPdfSafeText(value),
      totalsXValue,
      y,
      rowFont,
      size,
      color,
    )
    y -= gap
  }

  drawTotalRow('Subtotal', formatMoney(invoice.subtotal, invoice.currency))
  if (invoice.discount_amount > 0) {
    drawTotalRow(
      'Discount',
      `-${formatMoney(invoice.discount_amount, invoice.currency)}`,
    )
  }
  drawTotalRow(
    `GST (${invoice.tax_rate}%)`,
    formatMoney(invoice.tax_amount, invoice.currency),
  )

  y -= 6
  const grandSize = 12
  const grandPadY = 10
  const grandRowHeight = grandSize + grandPadY * 2
  ensureSpace(grandRowHeight + 20)

  page.drawRectangle({
    x: totalsXLabel - totalsPadX,
    y: y - grandPadY,
    width: totalsBoxWidth + totalsPadX,
    height: grandRowHeight,
    color: colors.headerBg,
  })

  page.drawText(toPdfSafeText('Grand Total'), {
    x: totalsXLabel,
    y,
    size: grandSize,
    font: fontBold,
    color: colors.brand,
  })
  drawRightText(
    page,
    formatMoney(invoice.total, invoice.currency),
    totalsXValue,
    y,
    fontBold,
    grandSize,
    colors.brand,
  )
  y -= grandRowHeight + 4

  if (invoice.notes?.trim()) {
    y -= 12
    ensureSpace(60)
    page.drawText('NOTES', {
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
      CONTENT_WIDTH * 0.55,
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
