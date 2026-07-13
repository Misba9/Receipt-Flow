export type SeoToolFaq = {
  question: string
  answer: string
}

export type SeoToolId =
  | 'invoice-generator'
  | 'gst-calculator'
  | 'profit-calculator'
  | 'margin-calculator'
  | 'qr-generator'
  | 'receipt-generator'

export type SeoToolConfig = {
  id: SeoToolId
  path: string
  title: string
  description: string
  eyebrow: string
  h1: string
  heroSupport: string
  howHeading: string
  howSteps: string[]
  faqHeading: string
  faqs: SeoToolFaq[]
  ctaHeading: string
  ctaSupport: string
  primaryCta: string
  related: Array<{ label: string; path: string }>
  /** schema.org WebApplication applicationCategory */
  applicationCategory: string
}

export const SEO_TOOLS: SeoToolConfig[] = [
  {
    id: 'invoice-generator',
    path: '/invoice-generator',
    title: 'Free Invoice Generator Online | ReceiptFlow',
    description:
      'Free online invoice generator — add business details, line items, tax, and download or print a clean invoice PDF-ready layout.',
    eyebrow: 'Free tool',
    h1: 'Invoice generator',
    heroSupport:
      'Create a professional invoice in your browser. Fill in seller and buyer details, add line items, apply tax, then print or save as PDF.',
    howHeading: 'How to use this invoice generator',
    howSteps: [
      'Enter your business name, address, and invoice number.',
      'Add the customer and one or more line items with quantity and rate.',
      'Set a tax rate if needed, then review the live preview.',
      'Print or save as PDF — or create a ReceiptFlow account to email branded invoices.',
    ],
    faqHeading: 'Invoice generator FAQ',
    faqs: [
      {
        question: 'Is this invoice generator free?',
        answer:
          'Yes. You can create and print invoices in the browser at no cost. Create a ReceiptFlow account if you want saved customers, email delivery, and GST-ready branding.',
      },
      {
        question: 'Can I download the invoice as a PDF?',
        answer:
          'Use your browser’s Print dialog and choose “Save as PDF”. ReceiptFlow workspaces generate branded PDFs you can email directly.',
      },
      {
        question: 'Does the invoice generator support GST?',
        answer:
          'You can add a tax percentage on the total. For full GST invoicing with GSTIN fields and customer history, use ReceiptFlow GST billing.',
      },
      {
        question: 'Is my invoice data stored on your servers?',
        answer:
          'This free tool runs in your browser session. Nothing is saved to an account unless you sign up and create invoices inside ReceiptFlow.',
      },
    ],
    ctaHeading: 'Need invoices you can email and track?',
    ctaSupport:
      'ReceiptFlow saves customers, applies GST, emails PDF invoices, and tracks payment status — beyond a one-off generator.',
    primaryCta: 'Start invoicing free',
    related: [
      { label: 'GST calculator', path: '/gst-calculator' },
      { label: 'Receipt generator', path: '/receipt-generator' },
      { label: 'Invoice software', path: '/invoice-software' },
    ],
    applicationCategory: 'BusinessApplication',
  },
  {
    id: 'gst-calculator',
    path: '/gst-calculator',
    title: 'Free GST Calculator Online | ReceiptFlow',
    description:
      'Free GST calculator for India — compute CGST, SGST, or IGST from taxable amount and GST rate. Inclusive and exclusive modes.',
    eyebrow: 'Free tool',
    h1: 'GST calculator',
    heroSupport:
      'Calculate GST instantly. Enter the amount and rate, choose tax-exclusive or inclusive, and see CGST/SGST or IGST breakup.',
    howHeading: 'How to use this GST calculator',
    howSteps: [
      'Enter the base amount (or the final amount if tax is inclusive).',
      'Pick a GST rate such as 5%, 12%, 18%, or 28% — or enter a custom rate.',
      'Choose exclusive (tax on top) or inclusive (tax inside the amount).',
      'Toggle intra-state (CGST+SGST) or inter-state (IGST) to match your supply.',
    ],
    faqHeading: 'GST calculator FAQ',
    faqs: [
      {
        question: 'How does the GST calculator work?',
        answer:
          'For tax-exclusive mode, GST = amount × rate. For inclusive mode, taxable value = amount ÷ (1 + rate). CGST and SGST each take half of GST for intra-state; IGST equals full GST for inter-state.',
      },
      {
        question: 'Can I calculate CGST and SGST separately?',
        answer:
          'Yes. Select intra-state supply and the calculator splits GST equally into CGST and SGST.',
      },
      {
        question: 'Is this GST calculator accurate for filing returns?',
        answer:
          'It is a quick estimate for invoices and quotes. Always confirm place of supply, HSN rates, and exemptions with your CA before filing.',
      },
      {
        question: 'Does ReceiptFlow create GST invoices too?',
        answer:
          'Yes. After you calculate tax here, use ReceiptFlow to issue branded GST invoices with customer GSTIN and PDF email.',
      },
    ],
    ctaHeading: 'Turn GST math into real invoices',
    ctaSupport:
      'ReceiptFlow applies tax on invoices, stores GSTIN details, and emails GST-ready PDFs from one workspace.',
    primaryCta: 'Try GST billing free',
    related: [
      { label: 'Invoice generator', path: '/invoice-generator' },
      { label: 'GST billing software', path: '/gst-billing-software' },
      { label: 'How to create a GST invoice', path: '/article/how-to-create-gst-invoice' },
    ],
    applicationCategory: 'FinanceApplication',
  },
  {
    id: 'profit-calculator',
    path: '/profit-calculator',
    title: 'Free Profit Calculator Online | ReceiptFlow',
    description:
      'Free profit calculator — enter revenue and costs to see profit, profit margin, and markup for your small business.',
    eyebrow: 'Free tool',
    h1: 'Profit calculator',
    heroSupport:
      'See how much you actually make. Enter revenue (or selling price) and total costs to calculate profit and margin percentage.',
    howHeading: 'How to use this profit calculator',
    howSteps: [
      'Enter total revenue or the selling price of a job.',
      'Enter total costs (materials, labor, fees).',
      'Review profit amount and profit margin instantly.',
      'Adjust inputs to test pricing before you send the next invoice.',
    ],
    faqHeading: 'Profit calculator FAQ',
    faqs: [
      {
        question: 'How is profit calculated?',
        answer:
          'Profit = revenue − cost. Profit margin (%) = (profit ÷ revenue) × 100 when revenue is greater than zero.',
      },
      {
        question: 'What costs should I include?',
        answer:
          'Include direct costs for the sale — materials, subcontracting, shipping, and payment fees. For full P&L, add overhead with your accountant.',
      },
      {
        question: 'Can I use this for service businesses?',
        answer:
          'Yes. Treat billable fees as revenue and time/tools/subcontractors as cost.',
      },
      {
        question: 'How does this relate to invoicing?',
        answer:
          'Healthy pricing starts with profit math. ReceiptFlow then helps you invoice that price and track whether customers paid.',
      },
    ],
    ctaHeading: 'Invoice profitable work — then track payment',
    ctaSupport:
      'Create branded invoices in ReceiptFlow and see which bills are still unpaid.',
    primaryCta: 'Start free invoicing',
    related: [
      { label: 'Margin calculator', path: '/margin-calculator' },
      { label: 'Payment tracking', path: '/payment-tracking' },
      { label: 'Sales reports', path: '/reports' },
    ],
    applicationCategory: 'FinanceApplication',
  },
  {
    id: 'margin-calculator',
    path: '/margin-calculator',
    title: 'Free Margin Calculator Online | ReceiptFlow',
    description:
      'Free margin calculator — compute profit margin and markup from cost and selling price for retail and wholesale pricing.',
    eyebrow: 'Free tool',
    h1: 'Margin calculator',
    heroSupport:
      'Price with confidence. Enter cost and selling price to see margin %, markup %, and profit per unit.',
    howHeading: 'How to use this margin calculator',
    howSteps: [
      'Enter your product or job cost.',
      'Enter the selling price you plan to charge.',
      'Read margin percentage, markup percentage, and profit.',
      'Use the reverse mode to find selling price from a target margin.',
    ],
    faqHeading: 'Margin calculator FAQ',
    faqs: [
      {
        question: 'What is the difference between margin and markup?',
        answer:
          'Margin is profit ÷ selling price. Markup is profit ÷ cost. A 50% markup is not the same as a 50% margin.',
      },
      {
        question: 'How do I calculate selling price from a target margin?',
        answer:
          'Selling price = cost ÷ (1 − target margin). Example: cost ₹100 at 20% margin → ₹125.',
      },
      {
        question: 'Should wholesale use markup or margin?',
        answer:
          'Many traders quote markup; finance teams often track margin. This tool shows both so conversations stay aligned.',
      },
      {
        question: 'Can ReceiptFlow help after I set prices?',
        answer:
          'Yes. Invoice at your priced rates, apply discounts carefully, and review sales reports in your workspace.',
      },
    ],
    ctaHeading: 'Price it, then bill it',
    ctaSupport:
      'Once margins look right, send professional invoices from ReceiptFlow with tax and payment tracking.',
    primaryCta: 'Create your workspace',
    related: [
      { label: 'Profit calculator', path: '/profit-calculator' },
      { label: 'Invoice generator', path: '/invoice-generator' },
      { label: 'Billing for wholesale', path: '/billing-software-for-wholesale-businesses' },
    ],
    applicationCategory: 'FinanceApplication',
  },
  {
    id: 'qr-generator',
    path: '/qr-generator',
    title: 'Free QR Code Generator Online | ReceiptFlow',
    description:
      'Free QR code generator — create QR codes for UPI payment links, invoice URLs, or plain text and download the image.',
    eyebrow: 'Free tool',
    h1: 'QR code generator',
    heroSupport:
      'Generate a QR code for a UPI link, website, or invoice note. Preview instantly and download the PNG for print or WhatsApp.',
    howHeading: 'How to use this QR generator',
    howSteps: [
      'Paste text, a URL, or a UPI payment string.',
      'Preview the QR code on the right.',
      'Download the image or open it in a new tab.',
      'Add payment QRs to invoices in ReceiptFlow for faster collections.',
    ],
    faqHeading: 'QR generator FAQ',
    faqs: [
      {
        question: 'What can I encode in the QR code?',
        answer:
          'Any text up to a practical length — website URLs, UPI payment links (upi://pay?…), or short invoice references.',
      },
      {
        question: 'Is the QR code generated on your servers?',
        answer:
          'The preview uses a public QR image service from your browser. Do not encode highly sensitive secrets in a public QR.',
      },
      {
        question: 'Can I use this for UPI payments on invoices?',
        answer:
          'Yes. Encode your UPI intent URL, download the QR, and place it on printed bills — or collect via emailed ReceiptFlow invoices.',
      },
      {
        question: 'What size should I print?',
        answer:
          'For counter stickers, print at least 2–3 cm wide. Test-scan with a phone before mass printing.',
      },
    ],
    ctaHeading: 'Pair QR payments with proper invoices',
    ctaSupport:
      'ReceiptFlow helps you send branded PDF invoices and track which ones are still unpaid.',
    primaryCta: 'Start billing free',
    related: [
      { label: 'Receipt generator', path: '/receipt-generator' },
      { label: 'Payment tracking', path: '/payment-tracking' },
      { label: 'Email invoices', path: '/email-invoices' },
    ],
    applicationCategory: 'UtilitiesApplication',
  },
  {
    id: 'receipt-generator',
    path: '/receipt-generator',
    title: 'Free Receipt Generator Online | ReceiptFlow',
    description:
      'Free online receipt generator — create a simple sales receipt with items, tax, and totals, then print or save as PDF.',
    eyebrow: 'Free tool',
    h1: 'Receipt generator',
    heroSupport:
      'Build a clean sales receipt for walk-in customers. Add items, tax, and payment mode, then print a thermal-style or A4 receipt.',
    howHeading: 'How to use this receipt generator',
    howSteps: [
      'Enter shop name and optional receipt number.',
      'Add purchased items with quantity and price.',
      'Set tax and payment mode (cash, UPI, card).',
      'Print the receipt preview — or upgrade to ReceiptFlow for saved history.',
    ],
    faqHeading: 'Receipt generator FAQ',
    faqs: [
      {
        question: 'What is the difference between a receipt and an invoice?',
        answer:
          'A receipt usually confirms payment for a completed sale. An invoice often requests payment and may include due dates and GST fields for B2B.',
      },
      {
        question: 'Can I print receipts for my shop?',
        answer:
          'Yes. Use Print on the preview. For ongoing billing with customer history, use ReceiptFlow invoices.',
      },
      {
        question: 'Does this receipt generator support GST?',
        answer:
          'You can add a tax percentage. For formal GST tax invoices with GSTIN, use the invoice generator or ReceiptFlow GST billing.',
      },
      {
        question: 'Is receipt data saved?',
        answer:
          'Not in this free tool. Sign up for ReceiptFlow if you need searchable sales history and payment status.',
      },
    ],
    ctaHeading: 'Keep every sale searchable',
    ctaSupport:
      'ReceiptFlow stores customers and invoices so you are not reprinting from memory next week.',
    primaryCta: 'Create free account',
    related: [
      { label: 'Invoice generator', path: '/invoice-generator' },
      { label: 'QR generator', path: '/qr-generator' },
      { label: 'Billing software for grocery stores', path: '/billing-software-for-grocery-stores' },
    ],
    applicationCategory: 'BusinessApplication',
  },
]

export const SEO_TOOL_BY_ID = Object.fromEntries(
  SEO_TOOLS.map((tool) => [tool.id, tool]),
) as Record<SeoToolId, SeoToolConfig>

export const SEO_TOOL_BY_PATH = Object.fromEntries(
  SEO_TOOLS.map((tool) => [tool.path, tool]),
) as Record<string, SeoToolConfig>

export function getSeoTool(idOrPath: string): SeoToolConfig | undefined {
  if (idOrPath.startsWith('/')) return SEO_TOOL_BY_PATH[idOrPath]
  return SEO_TOOL_BY_ID[idOrPath as SeoToolId]
}

export const TOOLS_INDEX_PATH = '/tools'
