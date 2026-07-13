import type { SeoLandingPageConfig } from '@/content/marketing-landing-types'
import { seoLandingPaths } from '@/content/seo-landings'

/**
 * City / location long-tail landing pages.
 * Each page uses distinct local keywords, FAQs, and placeholder testimonials.
 */
export const LOCATION_LANDING_PAGES: SeoLandingPageConfig[] = [
  {
    slug: 'billing-software-hyderabad',
    path: '/billing-software-hyderabad',
    title: 'Billing Software Hyderabad | GST Invoicing | ReceiptFlow',
    description:
      'Billing software in Hyderabad for GST invoices, PDF bills, and customer tracking — built for Hitec City freelancers, Jubilee Hills shops, and Telangana SMEs.',
    eyebrow: 'Hyderabad',
    h1: 'Billing software Hyderabad businesses rely on',
    heroSupport:
      'Online billing software for Hyderabad shops, agencies, and service firms — raise GST invoices, email PDF receipts across Secunderabad and the ORR corridor, and track who still owes you.',
    primaryCta: 'Start billing in Hyderabad',
    benefitsHeading: 'Why Hyderabad teams choose ReceiptFlow',
    benefits: [
      {
        title: 'GST-ready for Telangana trade',
        body: 'Put your GSTIN on branded invoices so Hyderabad B2B buyers and local retailers get bills their accountants can file.',
      },
      {
        title: 'Built for mixed Hyderabad workdays',
        body: 'Bill a Hitec City retainer in the morning and a Kukatpally counter sale in the afternoon from the same workspace.',
      },
      {
        title: 'Less WhatsApp invoice chaos',
        body: 'Stop pasting totals in chats — send a proper Hyderabad invoice PDF with line items, tax, and payment status.',
      },
    ],
    featuresHeading: 'Hyderabad billing features that matter locally',
    features: [
      {
        title: 'Customer book for city regulars',
        body: 'Save clinics in Banjara Hills, dealers in Begumpet, and apartment societies with phone and GST details ready for the next bill.',
      },
      {
        title: 'UPI + cash payment notes',
        body: 'Record how Hyderabad customers paid so end-of-day cash and PhonePe tallies stay aligned.',
      },
      {
        title: 'Branded PDF invoices',
        body: 'Download or email invoices that look like your Hyderabad brand — not a generic notepad slip.',
      },
      {
        title: 'Sales pulse for busy weeks',
        body: 'See today’s billed value before festival rushes in Abids or Charminar wholesale lanes peak.',
      },
    ],
    faqHeading: 'Billing software Hyderabad FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow billing software available for businesses in Hyderabad?',
        answer:
          'Yes. Hyderabad SMEs use ReceiptFlow online to create GST invoices, manage customers, and email PDF bills from any browser.',
      },
      {
        question: 'Does Hyderabad GST billing work for freelancers and shops?',
        answer:
          'Yes. Service providers in Gachibowli and retail shops across the city can both use the same invoicing workspace with tax and discounts.',
      },
      {
        question: 'Can I send invoices to customers outside Hyderabad?',
        answer:
          'Yes. Bill any Indian customer; the Hyderabad focus is local SEO and workflows — your invoices work pan-India.',
      },
      {
        question: 'Do I need desktop software installed in my Hyderabad shop?',
        answer:
          'No. ReceiptFlow is cloud billing software — sign in from a laptop or counter tablet without a local install.',
      },
    ],
    testimonialsHeading: 'Hyderabad billing stories (placeholders)',
    testimonialsIntro:
      'Sample scenarios for local businesses. Replace these with real customer quotes when you publish reviews.',
    testimonials: [
      {
        quote:
          'We bill retainers for Madhapur clients and still need clean GST PDFs for our CA every month.',
        name: 'Asha R.',
        role: 'Placeholder — Design studio, Hitec City',
      },
      {
        quote:
          'Our kirana regulars in LB Nagar settle on UPI. Status on each invoice finally matches the drawer.',
        name: 'Ramesh K.',
        role: 'Placeholder — Grocery counter, LB Nagar',
      },
      {
        quote:
          'Emailing invoices to Secunderabad dealers beat forwarding blurry photos of handwritten bills.',
        name: 'Farheen S.',
        role: 'Placeholder — Wholesale desk, Secunderabad',
      },
    ],
    ctaHeading: 'Run Hyderabad billing without paper ledgers',
    ctaSupport:
      'Create your ReceiptFlow workspace, add Hyderabad customers, and send your next GST invoice today.',
    related: [
      { label: 'GST billing software', path: seoLandingPaths.gstBilling },
      { label: 'Billing software Bangalore', path: '/billing-software-bangalore' },
      { label: 'Invoice software', path: seoLandingPaths.invoiceSoftware },
    ],
  },
  {
    slug: 'billing-software-bangalore',
    path: '/billing-software-bangalore',
    title: 'Billing Software Bangalore | GST Invoicing | ReceiptFlow',
    description:
      'Billing software in Bangalore for startups, cafés, and retailers — GST invoices, PDF receipts, and payment tracking for Bengaluru SMEs.',
    eyebrow: 'Bangalore',
    h1: 'Billing software Bangalore teams actually finish setup for',
    heroSupport:
      'Bengaluru billing software for Koramangala cafés, Indiranagar boutiques, and Whitefield service firms — GST invoices, branded PDFs, and clearer collections without another spreadsheet.',
    primaryCta: 'Start billing in Bangalore',
    benefitsHeading: 'Built for Bangalore’s pace',
    benefits: [
      {
        title: 'Startup + retail in one tool',
        body: 'Invoice SaaS clients in Outer Ring Road offices and walk-in buyers on Church Street without juggling two billing apps.',
      },
      {
        title: 'GST without the panic',
        body: 'Apply tax on Bangalore invoices and keep your GSTIN on PDFs your CA in Jayanagar can actually use.',
      },
      {
        title: 'Faster collections',
        body: 'Know which Bengaluru invoices are still unpaid before your next vendor payment week.',
      },
    ],
    featuresHeading: 'Bangalore invoicing features',
    features: [
      {
        title: 'Client directory that scales',
        body: 'Store agencies in HSR, clinics in Malleswaram, and apartment societies with emails ready for soft-copy bills.',
      },
      {
        title: 'Itemized modern invoices',
        body: 'Line items for retainers, products, or mixed orders — common across Bangalore’s hybrid SMEs.',
      },
      {
        title: 'Email PDF from the workspace',
        body: 'Send invoices to customers who expect a professional attachment, not a screenshot from a chat thread.',
      },
      {
        title: 'Dashboard for peak weekends',
        body: 'Glance at Saturday sales when Brigade Road and commercial street weekends spike.',
      },
    ],
    faqHeading: 'Billing software Bangalore FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow good billing software for Bangalore startups?',
        answer:
          'Yes. Bengaluru founders use it for client invoices, GST details, PDF delivery, and payment status in one cloud workspace.',
      },
      {
        question: 'Does it support GST billing for Karnataka businesses?',
        answer:
          'Yes. Add tax on invoices, store your GSTIN in company settings, and share GST-ready PDFs with Bangalore buyers.',
      },
      {
        question: 'Can café or retail shops in Bangalore use it?',
        answer:
          'Yes. Retail counters and service businesses both create invoices, save customers, and track dues.',
      },
      {
        question: 'Is this desktop billing software for Bangalore shops?',
        answer:
          'No install required. Use ReceiptFlow in the browser from a laptop, iPad, or counter PC.',
      },
    ],
    testimonialsHeading: 'Bangalore billing stories (placeholders)',
    testimonialsIntro:
      'Illustrative quotes for local SEO pages — swap in verified Bangalore customer testimonials when ready.',
    testimonials: [
      {
        quote:
          'Our Koramangala clients wanted branded PDFs. Paper bills were embarrassing for B2B work.',
        name: 'Nikhil M.',
        role: 'Placeholder — Agency founder, Koramangala',
      },
      {
        quote:
          'Whitefield site visits meant billing from a laptop. Cloud invoices finally matched how we work.',
        name: 'Priya D.',
        role: 'Placeholder — Facilities vendor, Whitefield',
      },
      {
        quote:
          'Indiranagar boutique orders with advances are clearer now that invoice status is visible.',
        name: 'Sana T.',
        role: 'Placeholder — Boutique owner, Indiranagar',
      },
    ],
    ctaHeading: 'Ship Bangalore invoices that look fundable',
    ctaSupport:
      'Set up your Bengaluru workspace branding and email your next GST invoice from ReceiptFlow.',
    related: [
      { label: 'Billing software Hyderabad', path: '/billing-software-hyderabad' },
      { label: 'PDF invoices', path: seoLandingPaths.pdfInvoices },
      { label: 'Sales dashboard', path: seoLandingPaths.salesDashboard },
    ],
  },
  {
    slug: 'billing-software-chennai',
    path: '/billing-software-chennai',
    title: 'Billing Software Chennai | GST Invoicing | ReceiptFlow',
    description:
      'Billing software in Chennai for T. Nagar retailers, Ambattur traders, and Tamil Nadu SMEs — GST invoices, PDF bills, and payment tracking online.',
    eyebrow: 'Chennai',
    h1: 'Billing software Chennai retailers and traders need',
    heroSupport:
      'Chennai billing software for T. Nagar showrooms, Anna Nagar clinics, and Ambattur suppliers — GST-ready invoices, Tamil Nadu customer records, and PDFs procurement teams accept.',
    primaryCta: 'Start billing in Chennai',
    benefitsHeading: 'Chennai commerce, clearer invoices',
    benefits: [
      {
        title: 'Retail + wholesale rhythm',
        body: 'Bill walk-ins on Ranganathan Street and dealer accounts from Guindy without rewriting buyer details each time.',
      },
      {
        title: 'Tamil Nadu GST clarity',
        body: 'Taxed invoices with your GSTIN help Chennai CAs close books without reconstructing handwritten slips.',
      },
      {
        title: 'Monsoon-proof records',
        body: 'Digital invoices and customer history stay searchable when paper ledgers get damp or misplaced.',
      },
    ],
    featuresHeading: 'Chennai billing software features',
    features: [
      {
        title: 'Party-wise customer profiles',
        body: 'Keep textile buyers, spare-parts dealers, and clinic accounts with phones and GSTINs for repeat billing.',
      },
      {
        title: 'Discount-friendly invoices',
        body: 'Apply festival or bulk discounts common across Chennai retail seasons without manual total math.',
      },
      {
        title: 'Email bills to accounts desks',
        body: 'Send PDF invoices when industrial buyers in Sriperumbudur or Oragadam request soft copies.',
      },
      {
        title: 'Outstanding dues view',
        body: 'Mark which Chennai invoices are unpaid before releasing the next dispatch conversation.',
      },
    ],
    faqHeading: 'Billing software Chennai FAQ',
    faqs: [
      {
        question: 'Can Chennai shops use ReceiptFlow as billing software?',
        answer:
          'Yes. Chennai retailers and service firms create GST invoices, email PDFs, and track payments online.',
      },
      {
        question: 'Does it work for Tamil Nadu GST invoicing?',
        answer:
          'Yes. Store your GSTIN, apply tax on invoices, and share PDFs suitable for local compliance workflows.',
      },
      {
        question: 'Is ReceiptFlow only for English invoices in Chennai?',
        answer:
          'Invoices and UI are in English today — suitable for most Chennai B2B and retail billing paperwork.',
      },
      {
        question: 'Can I bill customers across Tamil Nadu from Chennai?',
        answer:
          'Yes. Your workspace is not limited to city boundaries — bill any customer while targeting Chennai SEO locally.',
      },
    ],
    testimonialsHeading: 'Chennai billing stories (placeholders)',
    testimonialsIntro:
      'Placeholder testimonials for local keyword pages. Publish real Chennai reviews when available.',
    testimonials: [
      {
        quote:
          'T. Nagar weekend rushes used to bury us in carbon copies. Digital invoices are easier to find later.',
        name: 'Venkatesh P.',
        role: 'Placeholder — Apparel retailer, T. Nagar',
      },
      {
        quote:
          'Ambattur buyers ask for GST PDFs before payment. We email them from ReceiptFlow the same day.',
        name: 'Lakshmi N.',
        role: 'Placeholder — Components trader, Ambattur',
      },
      {
        quote:
          'Anna Nagar clinic accounts finally have a clean invoice history instead of WhatsApp forwards.',
        name: 'Dr. Meera I.',
        role: 'Placeholder — Clinic admin, Anna Nagar',
      },
    ],
    ctaHeading: 'Modernize Chennai billing this week',
    ctaSupport:
      'Onboard your Chennai company profile and send a branded GST invoice from ReceiptFlow.',
    related: [
      { label: 'Billing software Mumbai', path: '/billing-software-mumbai' },
      { label: 'GST billing software', path: seoLandingPaths.gstBilling },
      { label: 'Customer management', path: seoLandingPaths.customerManagement },
    ],
  },
  {
    slug: 'billing-software-mumbai',
    path: '/billing-software-mumbai',
    title: 'Billing Software Mumbai | GST Invoicing | ReceiptFlow',
    description:
      'Billing software in Mumbai for traders, agencies, and retailers — GST invoices, PDF receipts, and payment tracking for Maharashtra SMEs.',
    eyebrow: 'Mumbai',
    h1: 'Billing software Mumbai businesses use when volume spikes',
    heroSupport:
      'Mumbai billing software for Andheri agencies, Dadar retailers, and Bhiwandi-linked traders — fast GST invoices, branded PDFs, and dues tracking built for high-tempo commerce.',
    primaryCta: 'Start billing in Mumbai',
    benefitsHeading: 'Keep Mumbai invoices as sharp as the city',
    benefits: [
      {
        title: 'High-volume line items',
        body: 'Build detailed invoices for wholesale lots and service retainers without slowing the counter or the desk.',
      },
      {
        title: 'Maharashtra GST paperwork',
        body: 'Taxed PDFs with your GSTIN help Mumbai CAs and clients stay aligned at month end.',
      },
      {
        title: 'Collections across suburbs',
        body: 'Track unpaid bills from Thane to Navi Mumbai parties in one customer-aware workspace.',
      },
    ],
    featuresHeading: 'Mumbai billing features',
    features: [
      {
        title: 'Trader-ready customer book',
        body: 'Save parties from Crawford Market lanes to Bandra offices with phones, emails, and GSTINs.',
      },
      {
        title: 'Payment mode on every bill',
        body: 'Note NEFT, UPI, or cash — useful when Mumbai settlements move fast and staff handovers matter.',
      },
      {
        title: 'Email invoices that get opened',
        body: 'Send professional PDFs to accounts teams who will not accept photo bills from a chat app.',
      },
      {
        title: 'Sales reports for peak months',
        body: 'Review billed revenue around festival and wedding seasons when Mumbai retail and wholesale surge.',
      },
    ],
    faqHeading: 'Billing software Mumbai FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow billing software for Mumbai SMEs?',
        answer:
          'Yes. Mumbai traders, retailers, and agencies use it for GST invoices, PDF delivery, and payment status.',
      },
      {
        question: 'Can I use it for GST billing in Maharashtra?',
        answer:
          'Yes. Apply tax on invoices and keep company GST details on every PDF you send.',
      },
      {
        question: 'Does it replace Tally for Mumbai businesses?',
        answer:
          'ReceiptFlow focuses on invoicing, customers, and sales tracking — not full accounting ledgers. Many teams use it alongside their CA’s tools.',
      },
      {
        question: 'Can suburban Mumbai shops bill from a phone or tablet?',
        answer:
          'Yes. Sign in from a browser on mobile or tablet for on-the-go invoicing.',
      },
    ],
    testimonialsHeading: 'Mumbai billing stories (placeholders)',
    testimonialsIntro:
      'Example quotes for Mumbai local SEO. Replace with verified customer testimonials before treating them as social proof.',
    testimonials: [
      {
        quote:
          'Andheri clients expect a PDF the same evening. Screenshot bills were costing us credibility.',
        name: 'Rohan V.',
        role: 'Placeholder — Creative studio, Andheri East',
      },
      {
        quote:
          'Dadar counter sales plus weekly dealer invoices finally live in one searchable list.',
        name: 'Smita G.',
        role: 'Placeholder — Retail owner, Dadar',
      },
      {
        quote:
          'Following Navi Mumbai dues is easier when every invoice has a clear paid or unpaid status.',
        name: 'Imran Q.',
        role: 'Placeholder — Distributor desk, Navi Mumbai',
      },
    ],
    ctaHeading: 'Bill Mumbai customers with less chase',
    ctaSupport:
      'Create your Mumbai workspace, import key parties as customers, and send the next GST invoice today.',
    related: [
      { label: 'Billing software Delhi', path: '/billing-software-delhi' },
      { label: 'Payment tracking', path: seoLandingPaths.paymentTracking },
      { label: 'Email invoices', path: seoLandingPaths.emailInvoices },
    ],
  },
  {
    slug: 'billing-software-delhi',
    path: '/billing-software-delhi',
    title: 'Billing Software Delhi | GST Invoicing | ReceiptFlow',
    description:
      'Billing software in Delhi and NCR for wholesalers, retailers, and service firms — GST invoices, PDF bills, and outstanding payment tracking.',
    eyebrow: 'Delhi',
    h1: 'Billing software Delhi & NCR traders trust for GST bills',
    heroSupport:
      'Delhi billing software for Karol Bagh wholesalers, Connaught Place agencies, and Noida/Gurugram suppliers — GST invoices, party-wise history, and PDFs that survive accounts scrutiny.',
    primaryCta: 'Start billing in Delhi',
    benefitsHeading: 'Delhi trade needs disciplined invoicing',
    benefits: [
      {
        title: 'Wholesale party memory',
        body: 'Save Chandni Chowk and Sadar Bazar buyers once, then raise repeat GST invoices without rewriting GSTINs.',
      },
      {
        title: 'NCR-wide collections',
        body: 'Track dues across Delhi, Noida, and Gurugram customers from a single workspace.',
      },
      {
        title: 'Paperwork that travels',
        body: 'Email PDF invoices when transporters leave so the site or shop has the same bill you raised.',
      },
    ],
    featuresHeading: 'Delhi billing software features',
    features: [
      {
        title: 'B2B customer profiles',
        body: 'Store dealer names, phones, and tax IDs common across Delhi NCR wholesale relationships.',
      },
      {
        title: 'Multi-item GST invoices',
        body: 'Add many SKUs with quantities and rates — typical for Delhi hardware, garments, and electronics lots.',
      },
      {
        title: 'Status for credit sales',
        body: 'Mark invoices unpaid until settlement, then update when UPI or cheque clears.',
      },
      {
        title: 'Reports for season swings',
        body: 'See which months drove the most billed value during wedding and festival wholesale peaks.',
      },
    ],
    faqHeading: 'Billing software Delhi FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow billing software for Delhi and NCR businesses?',
        answer:
          'Yes. Delhi and NCR SMEs use it for GST invoicing, customer management, PDF bills, and payment tracking.',
      },
      {
        question: 'Can wholesalers in Karol Bagh or Chandni Chowk use it?',
        answer:
          'Yes. High-item invoices, party GST details, and email PDFs fit Delhi wholesale billing workflows.',
      },
      {
        question: 'Does Delhi GST billing include e-way bill generation?',
        answer:
          'No. ReceiptFlow creates GST-ready invoices and records; e-way bills remain in your government portal workflow.',
      },
      {
        question: 'Can Gurugram or Noida companies use the Delhi page offer?',
        answer:
          'Yes. The product works across India — this page targets Delhi NCR search intent with local keywords.',
      },
    ],
    testimonialsHeading: 'Delhi billing stories (placeholders)',
    testimonialsIntro:
      'Placeholder NCR stories for SEO. Use real Delhi customer quotes here once reviews are collected.',
    testimonials: [
      {
        quote:
          'Karol Bagh credit parties finally have invoice statuses we can show the floor team.',
        name: 'Ankit S.',
        role: 'Placeholder — Wholesale manager, Karol Bagh',
      },
      {
        quote:
          'CP clients want soft-copy GST invoices. Emailing PDFs stopped the follow-up calls.',
        name: 'Neha B.',
        role: 'Placeholder — Consulting firm, Connaught Place',
      },
      {
        quote:
          'Gurugram deliveries used to lose paper bills. Digital invoices travel with the driver now.',
        name: 'Harpreet K.',
        role: 'Placeholder — Supplier, Gurugram',
      },
    ],
    ctaHeading: 'Tighten Delhi invoicing before the next season',
    ctaSupport:
      'Set up your Delhi NCR workspace and send a GST-ready PDF invoice from ReceiptFlow.',
    related: [
      { label: 'Billing software Mumbai', path: '/billing-software-mumbai' },
      {
        label: 'Billing for wholesale businesses',
        path: '/billing-software-for-wholesale-businesses',
      },
      { label: 'GST billing software', path: seoLandingPaths.gstBilling },
    ],
  },
]

export const LOCATION_LANDING_BY_PATH = Object.fromEntries(
  LOCATION_LANDING_PAGES.map((page) => [page.path, page]),
) as Record<string, SeoLandingPageConfig>

export const LOCATION_LANDING_BY_SLUG = Object.fromEntries(
  LOCATION_LANDING_PAGES.map((page) => [page.slug, page]),
) as Record<string, SeoLandingPageConfig>

export function getLocationLanding(
  slugOrPath: string,
): SeoLandingPageConfig | undefined {
  if (slugOrPath.startsWith('/')) return LOCATION_LANDING_BY_PATH[slugOrPath]
  return LOCATION_LANDING_BY_SLUG[slugOrPath]
}
