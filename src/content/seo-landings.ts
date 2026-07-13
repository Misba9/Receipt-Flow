import { paths } from '@/lib/paths'
import type { SeoLandingPageConfig } from '@/content/marketing-landing-types'

export type { SeoLandingFaq, SeoLandingPageConfig } from '@/content/marketing-landing-types'

/**
 * Public SEO landing pages.
 * App reports live at `/app/reports` so `/reports` can be the public SEO page.
 */
export const SEO_LANDING_PAGES: SeoLandingPageConfig[] = [
  {
    slug: 'invoice-software',
    path: '/invoice-software',
    title: 'Invoice Software for Small Businesses | ReceiptFlow',
    description:
      'ReceiptFlow invoice software helps small businesses create branded invoices, add tax and discounts, email PDFs, and track payment status in one workspace.',
    eyebrow: 'Invoice software',
    h1: 'Invoice software built for small businesses',
    heroSupport:
      'Create professional invoices with line items, tax, and discounts — then download or email a branded PDF without leaving ReceiptFlow.',
    primaryCta: 'Start invoicing free',
    benefitsHeading: 'Why teams choose ReceiptFlow invoice software',
    benefits: [
      {
        title: 'Brand-ready invoices',
        body: 'Apply your logo, colors, and footer so every invoice matches your company.',
      },
      {
        title: 'Faster billing cycles',
        body: 'Reuse customers, add products quickly, and send invoices the same day you finish the work.',
      },
      {
        title: 'Clear payment status',
        body: 'See draft, sent, paid, and overdue invoices without digging through email threads.',
      },
    ],
    featuresHeading: 'Invoice software features',
    features: [
      {
        title: 'Line items & totals',
        body: 'Add products or services, quantities, prices, discounts, and tax in a clean editor.',
      },
      {
        title: 'Customer autofill',
        body: 'Search existing customers by name, phone, or email while you create a bill.',
      },
      {
        title: 'PDF download',
        body: 'Generate a print-ready invoice PDF with your branding applied automatically.',
      },
      {
        title: 'Email delivery',
        body: 'Send the invoice PDF to your customer and keep a record in your workspace.',
      },
    ],
    faqHeading: 'Invoice software FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow invoice software free to try?',
        answer:
          'Yes. Create an account, set up your company, and start creating invoices in minutes.',
      },
      {
        question: 'Can I customize invoice branding?',
        answer:
          'Yes. Upload a logo, choose a brand color, and set an invoice footer in company settings.',
      },
      {
        question: 'Does invoice software include tax and discounts?',
        answer:
          'Yes. Add tax rates and discounts per invoice so totals stay accurate for your customer.',
      },
    ],
    ctaHeading: 'Start using invoice software today',
    ctaSupport:
      'Create your ReceiptFlow workspace and send your first branded invoice in minutes.',
    related: [
      { label: 'PDF invoices', path: '/pdf-invoices' },
      { label: 'Email invoices', path: '/email-invoices' },
      { label: 'GST billing software', path: '/gst-billing-software' },
    ],
  },
  {
    slug: 'gst-billing-software',
    path: '/gst-billing-software',
    title: 'GST Billing Software for Small Businesses | ReceiptFlow',
    description:
      'GST billing software from ReceiptFlow lets you store GSTIN details, apply tax on invoices, and send GST-ready PDF bills to customers online.',
    eyebrow: 'GST billing software',
    h1: 'GST billing software for growing teams',
    heroSupport:
      'Keep company and customer GST details in one place, apply tax on every invoice, and send clear GST-ready PDFs.',
    primaryCta: 'Set up GST billing',
    benefitsHeading: 'Benefits of GST-ready online billing',
    benefits: [
      {
        title: 'GST on every invoice',
        body: 'Add tax rates while billing so customers see accurate GST-inclusive totals.',
      },
      {
        title: 'Store GSTIN once',
        body: 'Save your company GST number in settings and reuse it across invoices and PDFs.',
      },
      {
        title: 'Customer tax IDs',
        body: 'Capture customer GST details in your customer book for faster repeat billing.',
      },
    ],
    featuresHeading: 'GST billing software features',
    features: [
      {
        title: 'Company GST profile',
        body: 'Add GSTIN, address, and branding so invoices stay compliant and on-brand.',
      },
      {
        title: 'Tax on line items',
        body: 'Apply tax percentage to invoice totals and preview the tax amount before sending.',
      },
      {
        title: 'PDF with tax breakdown',
        body: 'Generated PDFs include tax so customers and accountants get a clear record.',
      },
      {
        title: 'Secure multi-tenant data',
        body: 'Each company’s GST and invoice data stays isolated with Row Level Security.',
      },
    ],
    faqHeading: 'GST billing software FAQ',
    faqs: [
      {
        question: 'Does ReceiptFlow work as GST billing software?',
        answer:
          'Yes. Store GST details on your company and customers, apply tax on invoices, and email GST-ready PDFs.',
      },
      {
        question: 'Can I show GST on PDF invoices?',
        answer:
          'Yes. Tax rates and amounts are included when you generate and send invoice PDFs.',
      },
      {
        question: 'Is GST billing available for multiple companies?',
        answer:
          'Yes. Each workspace has its own GST settings and invoices, kept private from other tenants.',
      },
    ],
    ctaHeading: 'Run GST billing online with ReceiptFlow',
    ctaSupport:
      'Configure GST details once, then create tax-ready invoices for every customer.',
    related: [
      { label: 'Invoice software', path: '/invoice-software' },
      { label: 'PDF invoices', path: '/pdf-invoices' },
      { label: 'Customer management', path: '/customer-management' },
    ],
  },
  {
    slug: 'customer-management',
    path: '/customer-management',
    title: 'Customer Management Software for Billing | ReceiptFlow',
    description:
      'Customer management software in ReceiptFlow stores contacts, phones, emails, and GST IDs — then autofills them when you create invoices.',
    eyebrow: 'Customer management software',
    h1: 'Customer management software for faster billing',
    heroSupport:
      'Keep a searchable customer book with contact details and notes, then reuse them instantly when you create the next invoice.',
    primaryCta: 'Organize customers free',
    benefitsHeading: 'Why customer management belongs next to billing',
    benefits: [
      {
        title: 'One customer book',
        body: 'Stop hunting spreadsheets — names, phones, emails, and GST IDs live in your workspace.',
      },
      {
        title: 'Less retyping',
        body: 'Autocomplete pulls the right customer while you create invoices, including GST fields.',
      },
      {
        title: 'Cleaner follow-ups',
        body: 'Internal notes help your team remember context before the next bill or email.',
      },
    ],
    featuresHeading: 'Customer management features',
    features: [
      {
        title: 'Contact profiles',
        body: 'Save name, phone, email, address, GST number, and comments for each customer.',
      },
      {
        title: 'Live search',
        body: 'Find customers by name, phone, or email as you type — on the customers page or invoice form.',
      },
      {
        title: 'Duplicate prevention',
        body: 'Spot exact matches on name, phone, and email so you do not create the same customer twice.',
      },
      {
        title: 'Invoice reuse',
        body: 'Select an existing customer and bill them again without re-entering details.',
      },
    ],
    faqHeading: 'Customer management FAQ',
    faqs: [
      {
        question: 'Is this customer management software or a simple contact list?',
        answer:
          'It is customer management built for billing — contacts, GST IDs, notes, search, and invoice autofill in one place.',
      },
      {
        question: 'Can I search customers while creating an invoice?',
        answer:
          'Yes. Start typing a name, phone, or email and select an existing customer to fill the form.',
      },
      {
        question: 'Are customers private to my company?',
        answer:
          'Yes. Customer records are scoped to your workspace and protected with Row Level Security.',
      },
    ],
    ctaHeading: 'Manage customers and invoices together',
    ctaSupport:
      'Build your customer book in ReceiptFlow and create the next invoice in fewer clicks.',
    related: [
      { label: 'Invoice software', path: '/invoice-software' },
      { label: 'Email invoices', path: '/email-invoices' },
      { label: 'Payment tracking', path: '/payment-tracking' },
    ],
  },
  {
    slug: 'pdf-invoices',
    path: '/pdf-invoices',
    title: 'PDF Invoices for Small Businesses | ReceiptFlow',
    description:
      'Generate branded PDF invoices with ReceiptFlow. Download print-ready receipts with your logo, GST details, line items, and totals.',
    eyebrow: 'PDF invoices',
    h1: 'Branded PDF invoices in one click',
    heroSupport:
      'Turn every bill into a professional PDF with your branding, tax breakdown, and clear totals — ready to download or email.',
    primaryCta: 'Create a PDF invoice',
    benefitsHeading: 'Benefits of PDF invoicing',
    benefits: [
      {
        title: 'Always on-brand',
        body: 'PDFs use your logo, brand color, and footer so customers recognize your business.',
      },
      {
        title: 'Accountant-friendly',
        body: 'Line items, tax, discounts, and totals are laid out for easy review and record-keeping.',
      },
      {
        title: 'Share anywhere',
        body: 'Download the PDF or email it directly — no desktop publisher required.',
      },
    ],
    featuresHeading: 'PDF invoice features',
    features: [
      {
        title: 'One-click PDF generation',
        body: 'Create a PDF from any invoice without exporting to another tool.',
      },
      {
        title: 'Brand kit applied',
        body: 'Company logo, colors, address, and GST details are pulled from settings automatically.',
      },
      {
        title: 'Secure storage',
        body: 'Generated PDFs are stored securely so you can resend or download later.',
      },
      {
        title: 'Works with email invoices',
        body: 'Attach the same PDF when you send the invoice to your customer.',
      },
    ],
    faqHeading: 'PDF invoices FAQ',
    faqs: [
      {
        question: 'Can I download PDF invoices anytime?',
        answer:
          'Yes. Generate and download branded PDF invoices from your ReceiptFlow workspace.',
      },
      {
        question: 'Do PDF invoices include GST and discounts?',
        answer:
          'Yes. Tax, discounts, and totals from the invoice are included in the PDF layout.',
      },
      {
        question: 'Can I email the PDF after downloading?',
        answer:
          'Yes. You can email the invoice with the PDF attached in the same workflow.',
      },
    ],
    ctaHeading: 'Send polished PDF invoices',
    ctaSupport:
      'Set your branding once, then generate PDF invoices for every customer.',
    related: [
      { label: 'Email invoices', path: '/email-invoices' },
      { label: 'Invoice software', path: '/invoice-software' },
      { label: 'GST billing software', path: '/gst-billing-software' },
    ],
  },
  {
    slug: 'email-invoices',
    path: '/email-invoices',
    title: 'Email Invoices with PDF Attachments | ReceiptFlow',
    description:
      'Email invoices from ReceiptFlow with branded PDF attachments. Send receipts to customers and keep delivery in your billing workspace.',
    eyebrow: 'Email invoices',
    h1: 'Email invoices with PDF attachments',
    heroSupport:
      'Send professional invoice emails from your workspace — with a branded PDF attached and your company details on the message.',
    primaryCta: 'Email your first invoice',
    benefitsHeading: 'Benefits of emailing invoices from ReceiptFlow',
    benefits: [
      {
        title: 'No inbox juggling',
        body: 'Create, generate, and email the invoice without copying files between apps.',
      },
      {
        title: 'Professional delivery',
        body: 'Customers receive a clear email with a PDF they can open, print, or forward.',
      },
      {
        title: 'Workspace history',
        body: 'Keep invoice status and documents together so your team knows what was sent.',
      },
    ],
    featuresHeading: 'Email invoice features',
    features: [
      {
        title: 'PDF attached automatically',
        body: 'Generate the branded PDF and include it when you send the invoice email.',
      },
      {
        title: 'Customer email autofill',
        body: 'Pull the customer email from your customer book or invoice form.',
      },
      {
        title: 'Company reply context',
        body: 'Use your company profile so customers know who the invoice is from.',
      },
      {
        title: 'Resend when needed',
        body: 'Return to an invoice later to download or send the PDF again.',
      },
    ],
    faqHeading: 'Email invoices FAQ',
    faqs: [
      {
        question: 'Can I email invoices with a PDF attached?',
        answer:
          'Yes. ReceiptFlow generates a branded PDF and sends it to your customer from the invoice workflow.',
      },
      {
        question: 'Do I need my own SMTP server?',
        answer:
          'No. Invoice email is sent through the ReceiptFlow platform email service for your workspace.',
      },
      {
        question: 'Can customers reply to invoice emails?',
        answer:
          'When your company email is set, it can be used as Reply-To so customers reach your team directly.',
      },
    ],
    ctaHeading: 'Email invoices without the busywork',
    ctaSupport:
      'Create the bill, generate the PDF, and email your customer in one flow.',
    related: [
      { label: 'PDF invoices', path: '/pdf-invoices' },
      { label: 'Payment tracking', path: '/payment-tracking' },
      { label: 'Customer management', path: '/customer-management' },
    ],
  },
  {
    slug: 'sales-dashboard',
    path: '/sales-dashboard',
    title: 'Sales Dashboard for Small Businesses | ReceiptFlow',
    description:
      'The ReceiptFlow sales dashboard shows today’s sales, recent invoices, revenue trends, and customer activity so small businesses stay on top of billing.',
    eyebrow: 'Sales dashboard',
    h1: 'Sales dashboard for busy billing teams',
    heroSupport:
      'See today’s performance, latest invoices, and revenue trends in one dashboard — so you know what got paid and what still needs attention.',
    primaryCta: 'Open your dashboard',
    benefitsHeading: 'Benefits of a billing-focused sales dashboard',
    benefits: [
      {
        title: 'Day-one clarity',
        body: 'Spot today’s sales and recent invoices without exporting a spreadsheet first.',
      },
      {
        title: 'Faster follow-ups',
        body: 'Jump from dashboard cards into invoices and customers when something looks off.',
      },
      {
        title: 'Team-ready overview',
        body: 'Give owners and operators the same live view of billing health.',
      },
    ],
    featuresHeading: 'Sales dashboard features',
    features: [
      {
        title: 'Key billing stats',
        body: 'Track sales, invoice counts, and payment signals from your workspace home.',
      },
      {
        title: 'Recent activity',
        body: 'Review the latest invoices and customers without leaving the dashboard.',
      },
      {
        title: 'Profile completion tips',
        body: 'Finish company branding and GST details so invoices look complete.',
      },
      {
        title: 'Links to reports',
        body: 'Move from the dashboard into deeper sales reports when you need trends.',
      },
    ],
    faqHeading: 'Sales dashboard FAQ',
    faqs: [
      {
        question: 'What does the ReceiptFlow sales dashboard show?',
        answer:
          'It highlights sales activity, recent invoices, and workspace health so you can act quickly.',
      },
      {
        question: 'Is the dashboard separate from reports?',
        answer:
          'Yes. The dashboard is your daily overview; reports provide deeper charts and exports.',
      },
      {
        question: 'Can multiple users see the same dashboard?',
        answer:
          'Users in your company workspace share the same billing data for that tenant.',
      },
    ],
    ctaHeading: 'See your sales dashboard live',
    ctaSupport:
      'Create a ReceiptFlow account and get a clear view of invoices and sales activity.',
    related: [
      { label: 'Sales reports', path: '/reports' },
      { label: 'Payment tracking', path: '/payment-tracking' },
      { label: 'Invoice software', path: '/invoice-software' },
    ],
  },
  {
    slug: 'reports',
    path: '/reports',
    title: 'Sales Reports & Invoice Analytics | ReceiptFlow',
    description:
      'Sales reports in ReceiptFlow cover daily and monthly revenue, invoice mix, top customers, and CSV or Excel exports for small business accounting.',
    eyebrow: 'Sales reports',
    h1: 'Sales reports that explain your billing',
    heroSupport:
      'Understand daily and monthly revenue, invoice status mix, and top customers — then export CSV or Excel when your books need the numbers.',
    primaryCta: 'Explore sales reports',
    benefitsHeading: 'Benefits of ReceiptFlow sales reports',
    benefits: [
      {
        title: 'Trends you can trust',
        body: 'Charts show how revenue and invoice volume move over time.',
      },
      {
        title: 'Customer insight',
        body: 'See which customers contribute the most so you know where to focus.',
      },
      {
        title: 'Export-ready',
        body: 'Download CSV or Excel for accountants, partners, or month-end close.',
      },
    ],
    featuresHeading: 'Sales report features',
    features: [
      {
        title: 'Daily & monthly charts',
        body: 'Visualize sales performance across the periods that matter to your team.',
      },
      {
        title: 'Invoice mix',
        body: 'Understand paid, unpaid, and other statuses in your invoice pipeline.',
      },
      {
        title: 'Top customers',
        body: 'Rank customers by sales contribution for clearer planning.',
      },
      {
        title: 'CSV & Excel exports',
        body: 'Export report data when you need offline analysis or bookkeeping uploads.',
      },
    ],
    faqHeading: 'Sales reports FAQ',
    faqs: [
      {
        question: 'What sales reports does ReceiptFlow include?',
        answer:
          'Daily and monthly sales views, invoice mix, top customers, and export options for CSV or Excel.',
      },
      {
        question: 'Can I export reports for my accountant?',
        answer:
          'Yes. Download CSV or Excel exports from your reporting workspace.',
      },
      {
        question: 'Are reports limited to my company?',
        answer:
          'Yes. Report data is scoped to your tenant workspace only.',
      },
    ],
    ctaHeading: 'Turn invoices into clear sales reports',
    ctaSupport:
      'Bill in ReceiptFlow, then review revenue trends and export when you need them.',
    related: [
      { label: 'Sales dashboard', path: '/sales-dashboard' },
      { label: 'Payment tracking', path: '/payment-tracking' },
      { label: 'Invoice software', path: '/invoice-software' },
    ],
  },
  {
    slug: 'payment-tracking',
    path: '/payment-tracking',
    title: 'Payment Tracking for Invoices | ReceiptFlow',
    description:
      'Track invoice payments in ReceiptFlow — update status, record payment modes, and see what is paid, due, or still outstanding.',
    eyebrow: 'Payment tracking',
    h1: 'Payment tracking for every invoice',
    heroSupport:
      'Know which invoices are paid, pending, or overdue. Capture payment mode and keep billing status accurate for your team.',
    primaryCta: 'Track payments free',
    benefitsHeading: 'Benefits of built-in payment tracking',
    benefits: [
      {
        title: 'Status at a glance',
        body: 'Move invoices through paid and unpaid states without a separate tracker.',
      },
      {
        title: 'Payment context',
        body: 'Record how a customer paid — cash, card, UPI options, or other — on the bill.',
      },
      {
        title: 'Fewer missed follow-ups',
        body: 'See outstanding invoices quickly so reminders happen on time.',
      },
    ],
    featuresHeading: 'Payment tracking features',
    features: [
      {
        title: 'Invoice statuses',
        body: 'Track draft, sent, paid, partially paid, overdue, and related states.',
      },
      {
        title: 'Payment modes',
        body: 'Capture cash, card, UPI apps, or a custom payment mode on each invoice.',
      },
      {
        title: 'Dashboard signals',
        body: 'Use workspace stats and recent invoices to spot what still needs collection.',
      },
      {
        title: 'History for your team',
        body: 'Keep payment details with the invoice so anyone on the workspace can follow up.',
      },
    ],
    faqHeading: 'Payment tracking FAQ',
    faqs: [
      {
        question: 'Can I mark invoices as paid in ReceiptFlow?',
        answer:
          'Yes. Update invoice status and keep payment mode details with the bill.',
      },
      {
        question: 'Does payment tracking work with email invoices?',
        answer:
          'Yes. Send the invoice, then update status when payment arrives — all in the same workspace.',
      },
      {
        question: 'Can I see unpaid invoices quickly?',
        answer:
          'Yes. Use invoice lists, filters, and dashboard activity to find what is still outstanding.',
      },
    ],
    ctaHeading: 'Track payments beside your invoices',
    ctaSupport:
      'Create bills, email PDFs, and keep payment status accurate in ReceiptFlow.',
    related: [
      { label: 'Email invoices', path: '/email-invoices' },
      { label: 'Sales dashboard', path: '/sales-dashboard' },
      { label: 'Sales reports', path: '/reports' },
    ],
  },
]

export const SEO_LANDING_BY_PATH = Object.fromEntries(
  SEO_LANDING_PAGES.map((page) => [page.path, page]),
) as Record<string, SeoLandingPageConfig>

export const SEO_LANDING_BY_SLUG = Object.fromEntries(
  SEO_LANDING_PAGES.map((page) => [page.slug, page]),
) as Record<string, SeoLandingPageConfig>

export function getSeoLanding(slugOrPath: string): SeoLandingPageConfig | undefined {
  if (slugOrPath.startsWith('/')) return SEO_LANDING_BY_PATH[slugOrPath]
  return SEO_LANDING_BY_SLUG[slugOrPath]
}

/** Convenience paths for nav/footer linking. */
export const seoLandingPaths = {
  invoiceSoftware: '/invoice-software',
  gstBilling: '/gst-billing-software',
  customerManagement: '/customer-management',
  pdfInvoices: '/pdf-invoices',
  emailInvoices: '/email-invoices',
  salesDashboard: '/sales-dashboard',
  reports: '/reports',
  paymentTracking: '/payment-tracking',
} as const

export const HOME_PATH = paths.landing
