import type { SeoLandingPageConfig } from '@/content/marketing-landing-types'
import { seoLandingPaths } from '@/content/seo-landings'

/**
 * Industry long-tail landing pages.
 * Each page uses distinct pain points, workflows, FAQs, and CTAs — no shared boilerplate paragraphs.
 */
export const INDUSTRY_LANDING_PAGES: SeoLandingPageConfig[] = [
  {
    slug: 'billing-software-for-grocery-stores',
    path: '/billing-software-for-grocery-stores',
    title: 'Billing Software for Grocery Stores | ReceiptFlow',
    description:
      'Billing software for grocery stores to invoice kirana and supermarket customers, track daily sales, apply GST, and email PDF bills from one workspace.',
    eyebrow: 'Grocery stores',
    h1: 'Billing software for grocery stores',
    heroSupport:
      'Built for kirana shops and grocery counters that bill walk-in and account customers every day — with fast invoices, GST on staples, and a clear end-of-day sales view.',
    primaryCta: 'Start grocery billing',
    benefitsHeading: 'Why grocery retailers switch to ReceiptFlow',
    benefits: [
      {
        title: 'Speed at the counter',
        body: 'Create bills quickly for regulars and credit customers without rewriting phone numbers or addresses each time.',
      },
      {
        title: 'GST on everyday goods',
        body: 'Apply tax on invoices so grocery invoices stay clear for customers who need a proper bill.',
      },
      {
        title: 'Day-close clarity',
        body: 'See today’s grocery sales and recent invoices before you lock the shutter — no spreadsheet scramble.',
      },
    ],
    featuresHeading: 'Grocery billing features that matter on the floor',
    features: [
      {
        title: 'Repeat customer book',
        body: 'Save apartment societies, restaurants, and household accounts with phone and GST details for next-day orders.',
      },
      {
        title: 'Mixed payment modes',
        body: 'Mark cash, UPI, or card against each grocery invoice so your cash drawer matches the system.',
      },
      {
        title: 'PDF bills for account customers',
        body: 'Email or download branded PDFs when hotels and offices ask for formal grocery invoices.',
      },
      {
        title: 'Private store workspace',
        body: 'Keep one grocery shop’s customers and sales isolated — useful if you run more than one outlet.',
      },
    ],
    faqHeading: 'Grocery store billing FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow suitable as billing software for grocery stores?',
        answer:
          'Yes. Grocery shops use it to bill account customers, apply GST, track daily sales, and keep a searchable customer list for regulars.',
      },
      {
        question: 'Can I bill both walk-in and credit grocery customers?',
        answer:
          'Yes. Create invoices for anyone, save frequent buyers in your customer book, and update payment status when they settle.',
      },
      {
        question: 'Does grocery billing support GST on invoices?',
        answer:
          'Yes. Set tax on invoices and store your GSTIN in company settings so PDF bills include the right business details.',
      },
    ],
    ctaHeading: 'Run grocery billing without paper ledgers',
    ctaSupport:
      'Set up your store profile, add a few regulars, and send your next grocery invoice from ReceiptFlow.',
    related: [
      { label: 'GST billing software', path: seoLandingPaths.gstBilling },
      { label: 'Payment tracking', path: seoLandingPaths.paymentTracking },
      {
        label: 'Billing for wholesale businesses',
        path: '/billing-software-for-wholesale-businesses',
      },
    ],
  },
  {
    slug: 'billing-software-for-mobile-shops',
    path: '/billing-software-for-mobile-shops',
    title: 'Billing Software for Mobile Shops | ReceiptFlow',
    description:
      'Billing software for mobile shops to invoice handsets, accessories, and repairs — with GST, customer history, PDF receipts, and payment status in one place.',
    eyebrow: 'Mobile shops',
    h1: 'Billing software for mobile shops',
    heroSupport:
      'Made for mobile retailers who sell phones, accessories, and repair jobs — keep IMEI notes with the customer, tax the invoice correctly, and prove the sale with a PDF.',
    primaryCta: 'Bill your next handset sale',
    benefitsHeading: 'Built for phone retail and service counters',
    benefits: [
      {
        title: 'Accessory + handset invoices',
        body: 'Line-item bills for phones, cases, chargers, and tempered glass without mixing them into a vague total.',
      },
      {
        title: 'Repair job documentation',
        body: 'Add service descriptions and customer contacts so pickup conversations stay professional.',
      },
      {
        title: 'Proof of purchase',
        body: 'Email a branded PDF when buyers need a receipt for warranty desks or office reimbursements.',
      },
    ],
    featuresHeading: 'Mobile shop billing features',
    features: [
      {
        title: 'Customer + device notes',
        body: 'Store buyer details and free-form comments (for example model or IMEI references) next to the invoice.',
      },
      {
        title: 'GST for device sales',
        body: 'Apply tax rates on invoices so mobile invoices match what your CA expects at month end.',
      },
      {
        title: 'UPI-heavy payment tracking',
        body: 'Record UPI, card, or cash on each sale so staff handovers stay accurate after rush hours.',
      },
      {
        title: 'Search past buyers',
        body: 'Find a customer by phone number when they return for a case, SIM, or screen replacement.',
      },
    ],
    faqHeading: 'Mobile shop billing FAQ',
    faqs: [
      {
        question: 'Can mobile shops use ReceiptFlow for handset and accessory billing?',
        answer:
          'Yes. Create itemized invoices for devices and accessories, attach GST, and email PDF receipts to customers.',
      },
      {
        question: 'How do I keep repair customers organized?',
        answer:
          'Save the customer profile, note job details on the invoice or comments, then update status when they pay on pickup.',
      },
      {
        question: 'Will this replace my handwritten mobile shop bill book?',
        answer:
          'It can. Staff create digital invoices, customers get PDFs, and you keep searchable history instead of stacked carbon copies.',
      },
    ],
    ctaHeading: 'Modernize mobile shop billing',
    ctaSupport:
      'Create your shop workspace and send a professional invoice for your next phone or repair sale.',
    related: [
      { label: 'Billing for electronics stores', path: '/billing-software-for-electronics-stores' },
      { label: 'PDF invoices', path: seoLandingPaths.pdfInvoices },
      { label: 'Customer management', path: seoLandingPaths.customerManagement },
    ],
  },
  {
    slug: 'billing-software-for-medical-stores',
    path: '/billing-software-for-medical-stores',
    title: 'Billing Software for Medical Stores | ReceiptFlow',
    description:
      'Billing software for medical stores and pharmacies to invoice clinic accounts, apply GST where needed, email PDF bills, and track outstanding payments.',
    eyebrow: 'Medical stores',
    h1: 'Billing software for medical stores',
    heroSupport:
      'Designed for pharmacies and medical counters that serve walk-ins plus clinic or nursing-home accounts — with clear invoices, GST fields, and follow-ups on unpaid bills.',
    primaryCta: 'Start medical store billing',
    benefitsHeading: 'Pharmacy billing that stays organized',
    benefits: [
      {
        title: 'Clinic & hospital accounts',
        body: 'Save institutional buyers once, then raise repeat invoices without retyping billing addresses.',
      },
      {
        title: 'Cleaner month-end for your CA',
        body: 'Export sales context and keep GST-ready PDFs instead of sorting loose thermal slips.',
      },
      {
        title: 'Outstanding bill visibility',
        body: 'Mark which medical invoices are still unpaid so counter staff know who to remind.',
      },
    ],
    featuresHeading: 'Medical store billing features',
    features: [
      {
        title: 'Account customer profiles',
        body: 'Store clinic names, phones, emails, and GSTINs for B2B pharmacy supply billing.',
      },
      {
        title: 'Itemized medicine invoices',
        body: 'List products or supply descriptions with quantity and price for transparent pharmacy bills.',
      },
      {
        title: 'Email bills to procurement desks',
        body: 'Send PDF invoices when clinics ask for soft copies before releasing payment.',
      },
      {
        title: 'Secure tenant workspace',
        body: 'Keep patient-adjacent retail data inside your medical store’s private company space.',
      },
    ],
    faqHeading: 'Medical store billing FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow billing software for medical stores and pharmacies?',
        answer:
          'Yes. Medical retailers use it for account invoices, GST-ready PDFs, customer records, and payment status tracking.',
      },
      {
        question: 'Can I invoice clinics that buy in bulk?',
        answer:
          'Yes. Save the clinic as a customer, create itemized invoices, and email the PDF to their accounts team.',
      },
      {
        question: 'Does it replace pharmacy inventory software?',
        answer:
          'No. ReceiptFlow focuses on invoicing, customers, and sales tracking — not batch-level pharmacy inventory or expiry management.',
      },
    ],
    ctaHeading: 'Give your medical store a proper billing system',
    ctaSupport:
      'Onboard your pharmacy profile and start sending clear invoices to clinics and counter customers.',
    related: [
      { label: 'Email invoices', path: seoLandingPaths.emailInvoices },
      { label: 'GST billing software', path: seoLandingPaths.gstBilling },
      { label: 'Payment tracking', path: seoLandingPaths.paymentTracking },
    ],
  },
  {
    slug: 'billing-software-for-garment-shops',
    path: '/billing-software-for-garment-shops',
    title: 'Billing Software for Garment Shops | ReceiptFlow',
    description:
      'Billing software for garment shops and boutiques to invoice retail and wholesale apparel orders, brand PDFs, track payments, and manage boutique customers.',
    eyebrow: 'Garment shops',
    h1: 'Billing software for garment shops',
    heroSupport:
      'For boutiques, tailoring counters, and apparel retailers who bill piece-by-piece or by order — keep style notes with the customer and send polished invoices after fittings.',
    primaryCta: 'Start boutique billing',
    benefitsHeading: 'Apparel billing without WhatsApp chaos',
    benefits: [
      {
        title: 'Order-style invoices',
        body: 'Describe garments, alterations, or bulk lots as line items so customers see exactly what they owe.',
      },
      {
        title: 'Bridal & wholesale follow-ups',
        body: 'Save high-value customers and mark partial payments when deposits come in.',
      },
      {
        title: 'Brand-forward PDFs',
        body: 'Send invoices that match your boutique branding instead of generic notepad bills.',
      },
    ],
    featuresHeading: 'Garment shop billing features',
    features: [
      {
        title: 'Customer style notes',
        body: 'Use comments for measurements reminders, delivery dates, or preferred fabrics tied to the buyer.',
      },
      {
        title: 'Discounts on seasonal sales',
        body: 'Apply invoice discounts during clearance or festival offers without rewriting totals by hand.',
      },
      {
        title: 'Tailor-to-customer workflow',
        body: 'Create the invoice when the order is confirmed, then update status when the garment is delivered.',
      },
      {
        title: 'Multi-outlet ready',
        body: 'Run each garment store as its own workspace if you manage more than one boutique brand.',
      },
    ],
    faqHeading: 'Garment shop billing FAQ',
    faqs: [
      {
        question: 'Can boutiques use ReceiptFlow as billing software for garment shops?',
        answer:
          'Yes. Boutiques and apparel retailers use it for itemized invoices, deposits, branded PDFs, and customer follow-ups.',
      },
      {
        question: 'Does it handle alteration or stitching charges?',
        answer:
          'Yes. Add stitching, fabric, and finishing as separate line items so the final bill stays transparent.',
      },
      {
        question: 'Can I take an advance and bill the balance later?',
        answer:
          'Use invoice status and notes to reflect deposits, then update the bill when the remaining amount is paid.',
      },
    ],
    ctaHeading: 'Dress your billing like your boutique',
    ctaSupport:
      'Add your logo, create a customer, and send a branded garment invoice from ReceiptFlow.',
    related: [
      { label: 'Invoice software', path: seoLandingPaths.invoiceSoftware },
      { label: 'PDF invoices', path: seoLandingPaths.pdfInvoices },
      {
        label: 'Billing for wholesale businesses',
        path: '/billing-software-for-wholesale-businesses',
      },
    ],
  },
  {
    slug: 'billing-software-for-hardware-stores',
    path: '/billing-software-for-hardware-stores',
    title: 'Billing Software for Hardware Stores | ReceiptFlow',
    description:
      'Billing software for hardware stores to invoice contractors and walk-in buyers, apply GST on materials, track dues, and share PDF bills for site purchases.',
    eyebrow: 'Hardware stores',
    h1: 'Billing software for hardware stores',
    heroSupport:
      'Aimed at hardware and building-material counters that supply contractors by the site — with GST invoices, dues tracking, and PDFs that stand up on a job site.',
    primaryCta: 'Bill your next contractor order',
    benefitsHeading: 'Hardware billing for contractor-heavy trade',
    benefits: [
      {
        title: 'Site-wise customer memory',
        body: 'Keep contractor phones and firm GSTINs ready when they return for cement, fittings, or tools.',
      },
      {
        title: 'Mixed unit line items',
        body: 'Invoice pipes, bags, and pieces together with clear quantities and rates.',
      },
      {
        title: 'Fewer disputed dues',
        body: 'Email the PDF after loading so site supervisors have the same bill your counter printed.',
      },
    ],
    featuresHeading: 'Hardware store billing features',
    features: [
      {
        title: 'Contractor accounts',
        body: 'Save builders and electricians as customers with notes for preferred sites or vehicles.',
      },
      {
        title: 'GST on materials',
        body: 'Apply tax on hardware invoices and keep your store GSTIN on every PDF.',
      },
      {
        title: 'Payment mode on delivery',
        body: 'Capture cash or UPI when the tempo leaves, then mark the invoice paid.',
      },
      {
        title: 'Sales reports for stock planning',
        body: 'Review which periods were busiest so you know when contractor demand spiked.',
      },
    ],
    faqHeading: 'Hardware store billing FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow good billing software for hardware stores?',
        answer:
          'Yes. Hardware counters use it for contractor invoices, GST PDFs, dues tracking, and searchable buyer history.',
      },
      {
        question: 'Can I bill large contractor purchases with many items?',
        answer:
          'Yes. Add multiple line items with quantities and rates, then generate a PDF for the site or accounts desk.',
      },
      {
        question: 'How do I track hardware customers who pay later?',
        answer:
          'Keep invoice status updated and use your customer list plus payment notes to follow outstanding contractor bills.',
      },
    ],
    ctaHeading: 'Supply sites with invoices that look official',
    ctaSupport:
      'Create your hardware store workspace and send the next contractor bill as a branded PDF.',
    related: [
      { label: 'Billing for wholesale businesses', path: '/billing-software-for-wholesale-businesses' },
      { label: 'GST billing software', path: seoLandingPaths.gstBilling },
      { label: 'Sales reports', path: seoLandingPaths.reports },
    ],
  },
  {
    slug: 'billing-software-for-wholesale-businesses',
    path: '/billing-software-for-wholesale-businesses',
    title: 'Billing Software for Wholesale Businesses | ReceiptFlow',
    description:
      'Billing software for wholesale businesses to raise B2B invoices, manage dealer GST details, email PDF bills, and monitor party-wise outstanding payments.',
    eyebrow: 'Wholesale businesses',
    h1: 'Billing software for wholesale businesses',
    heroSupport:
      'For distributors and wholesale traders who invoice dealers every week — party-wise customers, GST-ready PDFs, and reports that show which accounts still owe you.',
    primaryCta: 'Start wholesale invoicing',
    benefitsHeading: 'Wholesale billing without ledger confusion',
    benefits: [
      {
        title: 'Dealer-first customer book',
        body: 'Store party names, GSTINs, and phones so repeat wholesale invoices take minutes, not rewrite sessions.',
      },
      {
        title: 'B2B PDF credibility',
        body: 'Send formal invoices dealers can file — with your branding and tax breakdown intact.',
      },
      {
        title: 'Collection discipline',
        body: 'Track which wholesale invoices are unpaid before you release the next dispatch conversation.',
      },
    ],
    featuresHeading: 'Wholesale billing features',
    features: [
      {
        title: 'High-volume line items',
        body: 'Build invoices with multiple SKUs, quantities, and rates suited to carton or bag wholesale orders.',
      },
      {
        title: 'Party GST profiles',
        body: 'Keep buyer tax IDs on the customer record for cleaner B2B documentation.',
      },
      {
        title: 'Email to dealer accounts teams',
        body: 'Deliver PDF invoices straight to the email on file when purchasing managers ask for soft copies.',
      },
      {
        title: 'Revenue and party insight',
        body: 'Use sales reports to see which wholesale relationships drive the most billed value.',
      },
    ],
    faqHeading: 'Wholesale billing FAQ',
    faqs: [
      {
        question: 'Can wholesalers use ReceiptFlow as billing software for wholesale businesses?',
        answer:
          'Yes. Distributors use it for dealer invoices, GST details, PDF delivery, and outstanding payment visibility.',
      },
      {
        question: 'Does it support GST invoicing for B2B wholesale?',
        answer:
          'Yes. Store your GSTIN, capture dealer tax IDs, apply tax on invoices, and share GST-ready PDFs.',
      },
      {
        question: 'Is this a full ERP for wholesale inventory?',
        answer:
          'No. ReceiptFlow focuses on invoicing, customers, payments, and reports — not warehouse bin management or purchase planning.',
      },
    ],
    ctaHeading: 'Invoice dealers with less back-and-forth',
    ctaSupport:
      'Onboard your wholesale firm, import your top parties as customers, and send the next B2B invoice from ReceiptFlow.',
    related: [
      { label: 'GST billing software', path: seoLandingPaths.gstBilling },
      { label: 'Sales reports', path: seoLandingPaths.reports },
      { label: 'Customer management', path: seoLandingPaths.customerManagement },
    ],
  },
  {
    slug: 'billing-software-for-electronics-stores',
    path: '/billing-software-for-electronics-stores',
    title: 'Billing Software for Electronics Stores | ReceiptFlow',
    description:
      'Billing software for electronics stores to invoice TVs, appliances, and accessories with GST, warranty-friendly PDF receipts, and customer purchase history.',
    eyebrow: 'Electronics stores',
    h1: 'Billing software for electronics stores',
    heroSupport:
      'For electronics showrooms selling TVs, appliances, and accessories — itemized invoices, GST, PDF receipts customers keep for warranty, and a history of who bought what.',
    primaryCta: 'Bill your next appliance sale',
    benefitsHeading: 'Electronics retail billing that supports after-sales',
    benefits: [
      {
        title: 'Warranty-ready paperwork',
        body: 'Email a detailed PDF so customers have invoice proof when they call a brand service center.',
      },
      {
        title: 'Bundle sales without confusion',
        body: 'List the TV, installation, and wall mount as separate lines instead of one opaque total.',
      },
      {
        title: 'High-ticket payment clarity',
        body: 'Record how large appliance purchases were paid and whether any balance remains.',
      },
    ],
    featuresHeading: 'Electronics store billing features',
    features: [
      {
        title: 'Model-level line items',
        body: 'Describe SKUs clearly on the invoice so floor staff and customers share the same sale record.',
      },
      {
        title: 'GST on electronics invoices',
        body: 'Apply tax and keep company GST details on PDFs for compliant showroom billing.',
      },
      {
        title: 'Customer purchase history',
        body: 'Search past buyers when they return for accessories, AMC conversations, or a second unit.',
      },
      {
        title: 'Showroom dashboard pulse',
        body: 'Check today’s electronics sales and recent high-value invoices from your workspace home.',
      },
    ],
    faqHeading: 'Electronics store billing FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow billing software for electronics stores and showrooms?',
        answer:
          'Yes. Electronics retailers use it for itemized invoices, GST PDFs, payment tracking, and customer history.',
      },
      {
        question: 'Can invoices include installation or accessory add-ons?',
        answer:
          'Yes. Add installation, stands, or extended service as separate line items on the same invoice.',
      },
      {
        question: 'Will customers get something they can use for warranty claims?',
        answer:
          'They can download or receive a branded PDF invoice with product details suitable as purchase proof.',
      },
    ],
    ctaHeading: 'Give every electronics sale a proper invoice',
    ctaSupport:
      'Set your showroom branding and send the next appliance invoice as a professional PDF.',
    related: [
      { label: 'Billing for mobile shops', path: '/billing-software-for-mobile-shops' },
      { label: 'PDF invoices', path: seoLandingPaths.pdfInvoices },
      { label: 'Sales dashboard', path: seoLandingPaths.salesDashboard },
    ],
  },
]

export const INDUSTRY_LANDING_BY_PATH = Object.fromEntries(
  INDUSTRY_LANDING_PAGES.map((page) => [page.path, page]),
) as Record<string, SeoLandingPageConfig>

export const INDUSTRY_LANDING_BY_SLUG = Object.fromEntries(
  INDUSTRY_LANDING_PAGES.map((page) => [page.slug, page]),
) as Record<string, SeoLandingPageConfig>

export function getIndustryLanding(
  slugOrPath: string,
): SeoLandingPageConfig | undefined {
  if (slugOrPath.startsWith('/')) return INDUSTRY_LANDING_BY_PATH[slugOrPath]
  return INDUSTRY_LANDING_BY_SLUG[slugOrPath]
}
