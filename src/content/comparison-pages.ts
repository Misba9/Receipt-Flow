import type { SeoLandingFaq } from '@/content/marketing-landing-types'
import { paths } from '@/lib/paths'

export type ComparisonRow = {
  criterion: string
  receiptflow: string
  competitor: string
}

export type ComparisonPageConfig = {
  slug: string
  path: string
  competitorName: string
  /** Clear product label for the competitor (avoids vague brand-only claims). */
  competitorProduct: string
  title: string
  description: string
  eyebrow: string
  h1: string
  heroSupport: string
  summary: string
  disclaimer: string
  whenReceiptFlowHeading: string
  whenReceiptFlow: string[]
  whenCompetitorHeading: string
  whenCompetitor: string[]
  tableHeading: string
  tableIntro: string
  rows: ComparisonRow[]
  highlightsHeading: string
  highlights: Array<{ title: string; body: string }>
  faqHeading: string
  faqs: SeoLandingFaq[]
  ctaHeading: string
  ctaSupport: string
  primaryCta: string
  related: Array<{ label: string; path: string }>
}

const SHARED_DISCLAIMER =
  'Product packaging, pricing, and feature sets change often. Treat this page as a category comparison based on publicly known product focus — verify current details on each vendor’s site before you buy.'

const RECEIPTFLOW_HIGHLIGHTS: ComparisonPageConfig['highlights'] = [
  {
    title: 'Cloud invoicing workspace',
    body: 'Create and manage invoices from a browser — no desktop install required for day-to-day billing.',
  },
  {
    title: 'Branded PDF invoices',
    body: 'Apply logo, brand color, and footer, then download a print-ready PDF from the same flow.',
  },
  {
    title: 'GST-ready invoice fields',
    body: 'Store GSTIN details and apply tax on invoices so bills stay structured for Indian small-business billing.',
  },
  {
    title: 'Email delivery & payment status',
    body: 'Send invoice PDFs to customers and track draft, sent, paid, and overdue status in one place.',
  },
]

function relatedComparisons(excludeSlug: string) {
  return COMPARISON_PAGES.filter((page) => page.slug !== excludeSlug)
    .slice(0, 4)
    .map((page) => ({
      label: `vs ${page.competitorName}`,
      path: page.path,
    }))
}

/**
 * Factual competitor comparisons.
 * ReceiptFlow claims are limited to shipped product capabilities.
 * Competitor claims stick to well-established product categories (cloud vs desktop,
 * invoicing vs full accounting/inventory) without inventing pricing or niche modules.
 */
export const COMPARISON_PAGES: ComparisonPageConfig[] = [
  {
    slug: 'receiptflow-vs-zoho',
    path: '/receiptflow-vs-zoho',
    competitorName: 'Zoho',
    competitorProduct: 'Zoho Books / Zoho Invoice',
    title: 'ReceiptFlow vs Zoho | Billing Software Comparison',
    description:
      'Compare ReceiptFlow and Zoho (Books / Invoice) for small-business invoicing: cloud billing focus, GST invoice fields, PDF email, and when a fuller Zoho accounting suite fits better.',
    eyebrow: 'vs Zoho',
    h1: 'ReceiptFlow vs Zoho',
    heroSupport:
      'A fair look at ReceiptFlow billing software beside Zoho’s cloud accounting and invoicing products — so you can match the tool to how you actually invoice.',
    summary:
      'ReceiptFlow is cloud billing software focused on invoices, customers, branded PDFs, email delivery, GST tax on invoices, and payment status. Zoho Books and Zoho Invoice are part of Zoho’s broader cloud finance suite — commonly chosen when teams want fuller accounting workflows, bank feeds, and deeper Zoho app integrations. If your main job is sending professional invoices quickly, ReceiptFlow stays narrower and simpler. If you need a wider accounting platform inside the Zoho ecosystem, Zoho is usually the stronger fit.',
    disclaimer: SHARED_DISCLAIMER,
    whenReceiptFlowHeading: 'Choose ReceiptFlow when',
    whenReceiptFlow: [
      'You primarily need to create, PDF, email, and track invoices',
      'You want a lightweight cloud workspace without adopting a full finance suite',
      'GST fields and tax on invoices matter more than full ledger accounting',
      'You prefer to start free and expand features as billing volume grows',
    ],
    whenCompetitorHeading: 'Choose Zoho when',
    whenCompetitor: [
      'You need broader cloud accounting beyond day-to-day invoicing',
      'Your team already uses other Zoho apps and wants that ecosystem',
      'You want deeper finance automation typically associated with Zoho Books',
      'Multiple finance modules matter more than a focused billing product',
    ],
    tableHeading: 'ReceiptFlow vs Zoho at a glance',
    tableIntro:
      'High-level differences. Zoho here refers mainly to Zoho Books / Zoho Invoice — not every Zoho product.',
    rows: [
      {
        criterion: 'Primary focus',
        receiptflow: 'Small-business invoicing and billing workspace',
        competitor: 'Cloud accounting and invoicing within Zoho’s finance suite',
      },
      {
        criterion: 'Deployment',
        receiptflow: 'Cloud / browser',
        competitor: 'Cloud / browser',
      },
      {
        criterion: 'Invoices & PDFs',
        receiptflow: 'Branded invoices with PDF download and email delivery',
        competitor: 'Strong invoicing; depth varies by Zoho Books vs Invoice plan',
      },
      {
        criterion: 'GST on invoices',
        receiptflow: 'GSTIN fields and tax applied on invoices',
        competitor: 'GST-oriented Indian cloud accounting workflows (suite-dependent)',
      },
      {
        criterion: 'Customers & payment status',
        receiptflow: 'Customer directory tied to invoice payment status',
        competitor: 'Contacts plus broader finance/receivables tooling in Books',
      },
      {
        criterion: 'Accounting depth',
        receiptflow: 'Billing-focused — not a full accounting ledger suite',
        competitor: 'Typically deeper books, reports, and finance automation',
      },
      {
        criterion: 'Best fit',
        receiptflow: 'Owners who want clear invoicing without enterprise finance setup',
        competitor: 'Teams that want cloud accounting inside the Zoho ecosystem',
      },
    ],
    highlightsHeading: 'ReceiptFlow features in this comparison',
    highlights: RECEIPTFLOW_HIGHLIGHTS,
    faqHeading: 'ReceiptFlow vs Zoho FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow a Zoho Books alternative?',
        answer:
          'It can be for teams that mainly need invoicing, PDF email, customers, and payment tracking. It is not a full replacement for Zoho Books’ broader accounting and ecosystem features.',
      },
      {
        question: 'Which is better for GST invoicing?',
        answer:
          'Both support GST-oriented billing workflows. ReceiptFlow focuses on GST fields and tax on invoices inside a billing workspace. Zoho Books is commonly used when GST sits inside fuller cloud accounting.',
      },
      {
        question: 'Does ReceiptFlow integrate with Zoho?',
        answer:
          'ReceiptFlow is a standalone billing product. If you need deep Zoho CRM or Books integrations, Zoho’s own suite is the natural path.',
      },
    ],
    ctaHeading: 'Try ReceiptFlow invoicing free',
    ctaSupport:
      'Create a workspace, send a branded PDF invoice, and decide if a focused billing tool is enough — or if you still need Zoho’s wider suite.',
    primaryCta: 'Start free',
    related: [
      { label: 'Invoice software', path: '/invoice-software' },
      { label: 'GST billing software', path: '/gst-billing-software' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Sign up', path: paths.register },
    ],
  },
  {
    slug: 'receiptflow-vs-vyapar',
    path: '/receiptflow-vs-vyapar',
    competitorName: 'Vyapar',
    competitorProduct: 'Vyapar',
    title: 'ReceiptFlow vs Vyapar | Billing Software Comparison',
    description:
      'Compare ReceiptFlow and Vyapar for small shops: cloud invoice PDFs and payment tracking versus Vyapar’s simple GST billing and inventory-oriented shop workflows.',
    eyebrow: 'vs Vyapar',
    h1: 'ReceiptFlow vs Vyapar',
    heroSupport:
      'Both aim at small businesses. ReceiptFlow centers on cloud invoicing and collections; Vyapar is widely known for simple GST billing with shop-friendly stock workflows.',
    summary:
      'ReceiptFlow is a cloud billing workspace for creating branded invoices, applying GST tax, emailing PDFs, managing customers, and tracking payment status. Vyapar is commonly positioned as easy GST billing software for micro and small retailers — often with mobile/desktop billing and inventory features for shops. Choose ReceiptFlow when your priority is professional cloud invoices and collections. Choose Vyapar when quick retail billing and stock tracking are the daily job.',
    disclaimer: SHARED_DISCLAIMER,
    whenReceiptFlowHeading: 'Choose ReceiptFlow when',
    whenReceiptFlow: [
      'You bill customers with branded PDF invoices over email',
      'Payment status and customer history matter as much as creating the bill',
      'You want a browser-based workspace without installing shop POS software',
      'Your workflow is service or light retail invoicing more than counter billing',
    ],
    whenCompetitorHeading: 'Choose Vyapar when',
    whenCompetitor: [
      'You run a shop that needs fast GST billing at the counter',
      'Inventory and stock tracking are part of daily billing',
      'You prefer Vyapar’s mobile/desktop billing style for retailers',
      'You want a billing app purpose-built for micro retailers and traders',
    ],
    tableHeading: 'ReceiptFlow vs Vyapar at a glance',
    tableIntro:
      'Category-level comparison for small-business billing — not an exhaustive feature checklist.',
    rows: [
      {
        criterion: 'Primary focus',
        receiptflow: 'Cloud invoicing, PDF email, customers, payment status',
        competitor: 'Simple GST billing commonly used by small shops and traders',
      },
      {
        criterion: 'Deployment',
        receiptflow: 'Cloud / browser',
        competitor: 'Typically mobile and desktop billing apps',
      },
      {
        criterion: 'Invoice branding & PDF',
        receiptflow: 'Logo, brand color, footer, PDF download and email',
        competitor: 'GST invoices and sharing; branding depth depends on plan/app',
      },
      {
        criterion: 'Inventory / stock',
        receiptflow: 'Not positioned as inventory or POS software',
        competitor: 'Often includes stock tracking for shop billing',
      },
      {
        criterion: 'GST billing',
        receiptflow: 'GSTIN fields and tax on invoices',
        competitor: 'Widely used for quick GST invoices in retail settings',
      },
      {
        criterion: 'Best fit',
        receiptflow: 'Owners who need cloud invoice delivery and collections visibility',
        competitor: 'Shopkeepers who need fast billing plus stock',
      },
    ],
    highlightsHeading: 'ReceiptFlow features in this comparison',
    highlights: RECEIPTFLOW_HIGHLIGHTS,
    faqHeading: 'ReceiptFlow vs Vyapar FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow better than Vyapar for shops?',
        answer:
          'It depends. ReceiptFlow is stronger when you care about branded cloud PDFs, email delivery, and payment tracking. Vyapar is often a better fit when counter billing and inventory are the main workflow.',
      },
      {
        question: 'Does ReceiptFlow replace Vyapar inventory?',
        answer:
          'No. ReceiptFlow is billing software, not a stock or POS system. Keep Vyapar (or similar) if inventory is essential.',
      },
      {
        question: 'Can I try ReceiptFlow without migrating everything?',
        answer:
          'Yes. Create a free workspace and send a few invoices. Compare effort against your current Vyapar billing flow before switching.',
      },
    ],
    ctaHeading: 'See ReceiptFlow on a real invoice',
    ctaSupport:
      'Start free, create one branded PDF, and compare it with how you currently bill in Vyapar.',
    primaryCta: 'Start free',
    related: [
      { label: 'Invoice software', path: '/invoice-software' },
      { label: 'Payment tracking', path: '/payment-tracking' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Sign up', path: paths.register },
    ],
  },
  {
    slug: 'receiptflow-vs-busy',
    path: '/receiptflow-vs-busy',
    competitorName: 'Busy',
    competitorProduct: 'BUSY Accounting',
    title: 'ReceiptFlow vs Busy | Billing Software Comparison',
    description:
      'Compare ReceiptFlow and BUSY Accounting: lightweight cloud invoicing versus desktop GST accounting and inventory commonly used by traders and distributors.',
    eyebrow: 'vs Busy',
    h1: 'ReceiptFlow vs Busy',
    heroSupport:
      'ReceiptFlow focuses on cloud invoices and collections. BUSY is a well-known desktop accounting product for GST billing, inventory, and trading businesses.',
    summary:
      'ReceiptFlow is cloud billing software for invoices, GST tax fields, branded PDFs, email delivery, customers, and payment status. BUSY Accounting is commonly used as desktop GST accounting software for SMEs — especially traders and distributors that need inventory and accounting on office machines. ReceiptFlow is the lighter choice for invoice-first teams. Busy is typically stronger when desktop accounting and stock are core requirements.',
    disclaimer: SHARED_DISCLAIMER,
    whenReceiptFlowHeading: 'Choose ReceiptFlow when',
    whenReceiptFlow: [
      'You want browser-based invoicing without a desktop accounting install',
      'Sending branded PDFs and tracking dues is the main job',
      'You do not need multi-location inventory as part of billing',
      'A focused small-business billing workspace is enough',
    ],
    whenCompetitorHeading: 'Choose Busy when',
    whenCompetitor: [
      'You need desktop GST accounting with inventory for trading/distribution',
      'Your team works primarily from office desktops',
      'Purchase, stock, and accounting depth matter alongside billing',
      'You are comparing Busy as a Tally-class desktop alternative',
    ],
    tableHeading: 'ReceiptFlow vs Busy at a glance',
    tableIntro:
      'Busy here refers to BUSY Accounting Software as commonly used by Indian SMEs.',
    rows: [
      {
        criterion: 'Primary focus',
        receiptflow: 'Cloud invoicing and payment tracking',
        competitor: 'Desktop GST accounting and inventory for SMEs',
      },
      {
        criterion: 'Deployment',
        receiptflow: 'Cloud / browser',
        competitor: 'Primarily desktop',
      },
      {
        criterion: 'Invoicing',
        receiptflow: 'Branded invoices, PDF, email, payment status',
        competitor: 'GST billing inside a fuller accounting product',
      },
      {
        criterion: 'Inventory',
        receiptflow: 'Not an inventory or warehouse product',
        competitor: 'Inventory is a common reason teams choose Busy',
      },
      {
        criterion: 'Accounting depth',
        receiptflow: 'Billing-focused workspace',
        competitor: 'Accounting + billing for trading SMEs',
      },
      {
        criterion: 'Best fit',
        receiptflow: 'Service and light retail teams that live in email invoices',
        competitor: 'Traders and distributors on desktop workflows',
      },
    ],
    highlightsHeading: 'ReceiptFlow features in this comparison',
    highlights: RECEIPTFLOW_HIGHLIGHTS,
    faqHeading: 'ReceiptFlow vs Busy FAQ',
    faqs: [
      {
        question: 'Can ReceiptFlow replace Busy Accounting?',
        answer:
          'Only if your needs are mainly invoicing and collections. ReceiptFlow does not replace Busy’s desktop accounting and inventory strengths.',
      },
      {
        question: 'Is ReceiptFlow cloud while Busy is desktop?',
        answer:
          'Yes — that is the practical difference for many buyers. ReceiptFlow is browser-based; Busy is widely used as desktop accounting software.',
      },
      {
        question: 'Which is simpler to start?',
        answer:
          'ReceiptFlow is designed for a short cloud setup: company profile, customers, and first invoice. Busy typically involves desktop accounting setup for books and stock.',
      },
    ],
    ctaHeading: 'Start with cloud invoicing',
    ctaSupport:
      'If Busy feels heavier than your billing needs, try ReceiptFlow free and send your first PDF invoice today.',
    primaryCta: 'Start free',
    related: [
      { label: 'GST billing software', path: '/gst-billing-software' },
      { label: 'Sales reports', path: '/reports' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Sign up', path: paths.register },
    ],
  },
  {
    slug: 'receiptflow-vs-tally',
    path: '/receiptflow-vs-tally',
    competitorName: 'Tally',
    competitorProduct: 'TallyPrime',
    title: 'ReceiptFlow vs Tally | Billing Software Comparison',
    description:
      'Compare ReceiptFlow and TallyPrime: cloud invoice billing for small businesses versus Tally’s established desktop accounting, GST, and inventory depth.',
    eyebrow: 'vs Tally',
    h1: 'ReceiptFlow vs Tally',
    heroSupport:
      'TallyPrime is a long-standing standard for Indian desktop accounting. ReceiptFlow is a lighter cloud product for invoicing, PDFs, and payment tracking.',
    summary:
      'ReceiptFlow helps small businesses create branded invoices, apply GST tax, email PDFs, manage customers, and track payment status in the cloud. TallyPrime is widely used for desktop accounting, GST compliance workflows, inventory, and CA-friendly books. ReceiptFlow is not a Tally replacement for full accounting. It is a fair alternative when you only need modern cloud invoicing — and a complement when your CA still closes books in Tally.',
    disclaimer: SHARED_DISCLAIMER,
    whenReceiptFlowHeading: 'Choose ReceiptFlow when',
    whenReceiptFlow: [
      'Day-to-day work is creating and sending invoices, not maintaining full books',
      'You want cloud access without depending on a desktop licence for billing',
      'Branded PDF email and payment status are the priority',
      'You want a simpler product than a full TallyPrime deployment',
    ],
    whenCompetitorHeading: 'Choose Tally when',
    whenCompetitor: [
      'You need deep desktop accounting accepted by many CAs',
      'Inventory, godowns, or complex GST accounting are core',
      'Offline desktop control matters for your office',
      'You are standardising on TallyPrime across finance operations',
    ],
    tableHeading: 'ReceiptFlow vs TallyPrime at a glance',
    tableIntro:
      'Tally here means TallyPrime — the current Tally product family commonly used by Indian SMEs and accountants.',
    rows: [
      {
        criterion: 'Primary focus',
        receiptflow: 'Cloud billing and invoice collections',
        competitor: 'Desktop accounting, GST, and inventory depth',
      },
      {
        criterion: 'Deployment',
        receiptflow: 'Cloud / browser',
        competitor: 'Primarily desktop (with optional cloud add-ons from Tally)',
      },
      {
        criterion: 'Invoicing experience',
        receiptflow: 'Branded PDFs, email delivery, payment status',
        competitor: 'GST invoicing inside a full accounting product',
      },
      {
        criterion: 'Books & CA workflows',
        receiptflow: 'Not a ledger replacement for your CA',
        competitor: 'Broad CA familiarity and accounting depth',
      },
      {
        criterion: 'Inventory',
        receiptflow: 'Not inventory ERP',
        competitor: 'Strong inventory and multi-location strengths',
      },
      {
        criterion: 'Best fit',
        receiptflow: 'Small teams that need clear cloud invoicing first',
        competitor: 'SMEs and finance teams that run operations in TallyPrime',
      },
    ],
    highlightsHeading: 'ReceiptFlow features in this comparison',
    highlights: RECEIPTFLOW_HIGHLIGHTS,
    faqHeading: 'ReceiptFlow vs Tally FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow a Tally alternative?',
        answer:
          'For invoicing and collections, it can be. For full accounting, inventory, and CA-led books, TallyPrime remains in a different category.',
      },
      {
        question: 'Can I use ReceiptFlow with Tally?',
        answer:
          'Many businesses invoice day-to-day in one tool and keep statutory books with their CA in Tally. ReceiptFlow does not claim to replace TallyPrime year-end accounting.',
      },
      {
        question: 'Which is easier for a first invoice?',
        answer:
          'ReceiptFlow is built for a short cloud path: set up your company and send a branded invoice. TallyPrime is more powerful, and typically involves a fuller accounting setup.',
      },
    ],
    ctaHeading: 'Invoice in the cloud — keep books where they belong',
    ctaSupport:
      'Try ReceiptFlow free for customer-facing invoices. Keep TallyPrime if you still need its accounting depth.',
    primaryCta: 'Start free',
    related: [
      { label: 'Invoice software', path: '/invoice-software' },
      { label: 'Email invoices', path: '/email-invoices' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Sign up', path: paths.register },
    ],
  },
  {
    slug: 'receiptflow-vs-marg-erp',
    path: '/receiptflow-vs-marg-erp',
    competitorName: 'Marg ERP',
    competitorProduct: 'Marg ERP',
    title: 'ReceiptFlow vs Marg ERP | Billing Software Comparison',
    description:
      'Compare ReceiptFlow and Marg ERP: cloud invoicing for small businesses versus Marg’s retail/distribution ERP strengths such as inventory-heavy GST billing.',
    eyebrow: 'vs Marg ERP',
    h1: 'ReceiptFlow vs Marg ERP',
    heroSupport:
      'Marg ERP is widely used for retail and distribution billing with inventory depth. ReceiptFlow is a lighter cloud product for invoices, PDFs, and payment tracking.',
    summary:
      'ReceiptFlow is cloud billing software for branded invoices, GST tax on invoices, PDF email, customers, and payment status. Marg ERP is commonly chosen by retail, pharma, FMCG, and distribution businesses that need inventory-heavy GST billing and industry-oriented ERP workflows. ReceiptFlow is fair to choose when you need simple cloud invoicing. Marg is typically the better fit when stock, batches, and distribution billing drive the business.',
    disclaimer: SHARED_DISCLAIMER,
    whenReceiptFlowHeading: 'Choose ReceiptFlow when',
    whenReceiptFlow: [
      'You need cloud invoices without deploying retail ERP',
      'PDF email and payment tracking matter more than warehouse stock',
      'Your catalog and inventory needs are light or handled elsewhere',
      'You want a focused small-business billing workspace',
    ],
    whenCompetitorHeading: 'Choose Marg ERP when',
    whenCompetitor: [
      'You run retail or distribution with heavy inventory requirements',
      'Industry workflows (for example pharma/FMCG distribution) matter',
      'GST billing is tightly coupled to stock and batch processes',
      'You need an ERP-style billing system beyond invoices alone',
    ],
    tableHeading: 'ReceiptFlow vs Marg ERP at a glance',
    tableIntro:
      'Category comparison between a cloud invoicing product and an inventory-oriented retail/distribution ERP.',
    rows: [
      {
        criterion: 'Primary focus',
        receiptflow: 'Cloud invoicing and collections',
        competitor: 'Retail/distribution ERP with GST billing and inventory',
      },
      {
        criterion: 'Deployment',
        receiptflow: 'Cloud / browser',
        competitor: 'Typically desktop / on-prem ERP deployments',
      },
      {
        criterion: 'Invoicing',
        receiptflow: 'Branded PDF invoices and email delivery',
        competitor: 'High-volume GST billing tied to inventory workflows',
      },
      {
        criterion: 'Inventory & batches',
        receiptflow: 'Not an inventory ERP',
        competitor: 'Inventory depth is a core Marg strength',
      },
      {
        criterion: 'Industry fit',
        receiptflow: 'General small-business invoicing across niches',
        competitor: 'Often chosen for pharma, FMCG, retail, and distribution',
      },
      {
        criterion: 'Best fit',
        receiptflow: 'Teams that need clear customer invoices without ERP overhead',
        competitor: 'Businesses where stock and billing must stay tightly linked',
      },
    ],
    highlightsHeading: 'ReceiptFlow features in this comparison',
    highlights: RECEIPTFLOW_HIGHLIGHTS,
    faqHeading: 'ReceiptFlow vs Marg ERP FAQ',
    faqs: [
      {
        question: 'Is ReceiptFlow a Marg ERP alternative?',
        answer:
          'For invoicing and payment tracking, it can be a lighter alternative. It is not a substitute for Marg’s inventory-heavy retail and distribution ERP capabilities.',
      },
      {
        question: 'Does ReceiptFlow support batch or expiry tracking?',
        answer:
          'No. Those workflows are why many pharma and distribution teams use Marg ERP. ReceiptFlow focuses on invoices, customers, and collections.',
      },
      {
        question: 'When should I pick ReceiptFlow instead?',
        answer:
          'When you mainly send professional invoices, need branded PDFs and email, and do not need ERP inventory modules for daily operations.',
      },
    ],
    ctaHeading: 'Need invoices — not a full ERP?',
    ctaSupport:
      'Start free with ReceiptFlow. Keep Marg ERP if inventory-led billing is still essential.',
    primaryCta: 'Start free',
    related: [
      { label: 'Customer management', path: '/customer-management' },
      { label: 'PDF invoices', path: '/pdf-invoices' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Sign up', path: paths.register },
    ],
  },
]

// Attach cross-links after array exists (avoid TDZ with relatedComparisons).
for (const page of COMPARISON_PAGES) {
  const extras = relatedComparisons(page.slug).filter(
    (link) => !page.related.some((existing) => existing.path === link.path),
  )
  page.related = [...page.related.slice(0, 3), ...extras].slice(0, 6)
}

export const COMPARISONS_INDEX_PATH = '/comparisons'

export const COMPARISON_BY_SLUG = Object.fromEntries(
  COMPARISON_PAGES.map((page) => [page.slug, page]),
) as Record<string, ComparisonPageConfig>

export const COMPARISON_BY_PATH = Object.fromEntries(
  COMPARISON_PAGES.map((page) => [page.path, page]),
) as Record<string, ComparisonPageConfig>

export function getComparisonPage(
  slugOrPath: string,
): ComparisonPageConfig | undefined {
  if (COMPARISON_BY_PATH[slugOrPath]) return COMPARISON_BY_PATH[slugOrPath]
  const slug = slugOrPath.replace(/^\//, '')
  return COMPARISON_BY_SLUG[slug]
}
