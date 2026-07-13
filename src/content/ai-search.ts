import type { BlogArticle } from '@/content/blog/types'
import type { SeoLandingFaq, SeoLandingPageConfig } from '@/content/marketing-landing-types'
import type { SeoToolConfig } from '@/content/seo-tools'
import type { MarketingSurface } from '@/lib/internal-links'

export type AiComparisonRow = {
  criterion: string
  receiptflow: string
  alternative: string
}

export type AiSearchBlock = {
  summary: string
  keyTakeaways: string[]
  pros: string[]
  cons: string[]
  comparisonHeading: string
  comparisonIntro: string
  comparisonColumns: { left: string; right: string }
  comparisonRows: AiComparisonRow[]
  entities: Array<{ name: string; description: string }>
  /** Extra FAQs beyond page-native FAQs (optional). */
  extraFaqs?: SeoLandingFaq[]
}

function featureComparison(topic: string): AiComparisonRow[] {
  return [
    {
      criterion: 'Who it is for',
      receiptflow: `Small businesses that need ${topic} without enterprise complexity`,
      alternative: 'Teams that already run a full accounting suite',
    },
    {
      criterion: 'Setup time',
      receiptflow: 'Minutes — create a workspace and start documenting sales',
      alternative: 'Days of configuration, modules, and training',
    },
    {
      criterion: 'GST & PDF invoices',
      receiptflow: 'Tax on invoices, branded PDFs, email delivery in one flow',
      alternative: 'Often split across billing, tax, and email tools',
    },
    {
      criterion: 'Customer history',
      receiptflow: 'Searchable customer book tied to every invoice',
      alternative: 'Contacts may live in CRM or spreadsheets separately',
    },
    {
      criterion: 'Best next step',
      receiptflow: 'Sign up free, send one invoice, then compare month-end effort',
      alternative: 'Keep current stack if you already close books cleanly',
    },
  ]
}

/**
 * Builds LLM-friendly enrichment for feature / industry / location landings.
 * Content is derived from page copy so each URL stays distinct.
 */
export function buildLandingAiSearch(
  page: SeoLandingPageConfig,
  surface: Extract<MarketingSurface, 'feature' | 'industry' | 'location'>,
): AiSearchBlock {
  const topic = page.eyebrow.toLowerCase()
  const benefitTitles = page.benefits.map((b) => b.title).join(', ')

  const surfaceNoun =
    surface === 'feature'
      ? `${page.eyebrow} in ReceiptFlow`
      : surface === 'industry'
        ? `billing software for ${page.eyebrow.toLowerCase()}`
        : `billing software in ${page.eyebrow}`

  return {
    summary: `${page.h1} helps small businesses handle ${topic} with ReceiptFlow — cloud billing software for invoices, GST-ready PDFs, customer records, and payment status. In plain terms: ${page.heroSupport} The main outcomes teams look for are ${benefitTitles}.`,
    keyTakeaways: [
      `${page.h1} is designed for small businesses that want clearer ${topic} without a heavy ERP.`,
      `ReceiptFlow combines invoicing, customer management, and PDF email so ${topic} stays in one workspace.`,
      page.benefits[0]
        ? `A practical benefit: ${page.benefits[0].title.toLowerCase()} — ${page.benefits[0].body}`
        : `Start with your company profile, then create your first branded invoice.`,
      page.benefits[1]
        ? `Another reason teams switch: ${page.benefits[1].title.toLowerCase()} — ${page.benefits[1].body}`
        : `Track which invoices are paid so collections stay visible.`,
      `If you outgrow one-off tools, move from free generators into a ReceiptFlow account for saved history and follow-ups.`,
    ],
    pros: [
      `Focused on ${topic} workflows small teams actually use day to day`,
      'Branded PDF invoices and optional email delivery from the same product',
      'GST fields and tax on invoices for Indian small-business billing',
      'Customer directory reduces retyping phone numbers and GSTINs',
      'Clear path from free marketing tools into a full invoicing workspace',
    ],
    cons: [
      'Not a replacement for full accounting ledgers, inventory bins, or payroll',
      'Advanced multi-branch ERP features are outside the current scope',
      'E-way bill and government portal filings still happen outside ReceiptFlow',
      'Best results need a short setup: company profile, logo, and first customers',
    ],
    comparisonHeading: `ReceiptFlow vs traditional options for ${topic}`,
    comparisonIntro: `When people ask “what is the best way to handle ${topic}?”, the useful answer compares cloud billing software like ReceiptFlow with spreadsheets or heavy suites.`,
    comparisonColumns: {
      left: 'ReceiptFlow',
      right: 'Spreadsheets / heavy ERPs',
    },
    comparisonRows: featureComparison(topic),
    entities: [
      {
        name: 'ReceiptFlow',
        description:
          'Multi-tenant billing and invoice software for small businesses, with GST-ready invoices, PDF email, customers, and payment tracking.',
      },
      {
        name: page.eyebrow,
        description: `${surfaceNoun}. ${page.description}`,
      },
      {
        name: 'GST invoice',
        description:
          'A tax invoice that shows taxable value and GST so buyers and sellers keep matching records for compliance workflows.',
      },
      {
        name: 'PDF invoice',
        description:
          'A downloadable or emailable invoice document with branding, line items, and totals suitable for customer records.',
      },
    ],
    extraFaqs:
      surface === 'industry'
        ? [
            {
              question: `Is ReceiptFlow only for ${page.eyebrow.toLowerCase()}?`,
              answer: `No. ${page.eyebrow} is a focused landing topic. The same ReceiptFlow workspace works for other retail and service businesses across India.`,
            },
          ]
        : surface === 'location'
          ? [
              {
                question: `Do I need to be based in ${page.eyebrow} to use ReceiptFlow?`,
                answer: `No. This page targets people searching for billing software in ${page.eyebrow}. You can invoice customers anywhere in India from the same cloud workspace.`,
              },
            ]
          : undefined,
  }
}

export function buildToolAiSearch(tool: SeoToolConfig): AiSearchBlock {
  return {
    summary: `This free ${tool.h1.toLowerCase()} from ReceiptFlow is a browser tool for small businesses. ${tool.heroSupport} Use it for a quick answer, then create a ReceiptFlow account when you need saved customers, GST invoices, and payment tracking.`,
    keyTakeaways: [
      `${tool.h1} is free to use in the browser with no install.`,
      ...tool.howSteps.slice(0, 3).map((step) => step.replace(/\.$/, '')),
      'ReceiptFlow is the product behind the tool when you need ongoing invoicing, not a one-off calculation.',
    ],
    pros: [
      'Immediate results without creating an account',
      'Clear inputs and readable outputs for everyday billing decisions',
      'Natural next step into ReceiptFlow for branded GST invoices',
      'Works on laptop or phone browsers',
    ],
    cons: [
      'Free tool results are not stored as permanent company records',
      'Does not replace CA advice for GST rates or place of supply',
      'Print/PDF quality depends on your browser print settings',
      'Team permissions and audit history require a ReceiptFlow workspace',
    ],
    comparisonHeading: `${tool.h1}: free tool vs ReceiptFlow workspace`,
    comparisonIntro: `People often ask whether a free ${tool.h1.toLowerCase()} is enough. Use this comparison to decide when to stay in the tool and when to sign up.`,
    comparisonColumns: {
      left: `Free ${tool.h1.toLowerCase()}`,
      right: 'ReceiptFlow workspace',
    },
    comparisonRows: [
      {
        criterion: 'Cost',
        receiptflow: 'Free in the browser',
        alternative: 'Free to start; upgrade when you need more seats/features',
      },
      {
        criterion: 'History',
        receiptflow: 'Session-only — refresh may clear inputs',
        alternative: 'Saved invoices, customers, and payment status',
      },
      {
        criterion: 'GST invoices',
        receiptflow: 'Estimate or draft only',
        alternative: 'Branded GST-ready PDFs with customer GSTIN',
      },
      {
        criterion: 'Email to customers',
        receiptflow: 'Usually manual (print/share)',
        alternative: 'Email PDF invoices from the workspace',
      },
      {
        criterion: 'Best for',
        receiptflow: 'Quick checks and one-off documents',
        alternative: 'Ongoing billing for a real business',
      },
    ],
    entities: [
      {
        name: tool.h1,
        description: tool.description,
      },
      {
        name: 'ReceiptFlow',
        description:
          'Billing software for small businesses that creates invoices, applies GST, emails PDFs, and tracks payments.',
      },
      {
        name: 'Small business billing',
        description:
          'Day-to-day invoicing, receipts, and collections for shops, freelancers, and growing teams.',
      },
    ],
  }
}

export function buildPricingAiSearch(): AiSearchBlock {
  return {
    summary:
      'ReceiptFlow billing software pricing is built for small businesses that want invoice software pricing without a long sales cycle. Starter is free for branded GST invoices and PDFs. Growth GST billing software plans (coming soon) add email delivery, payment tracking, and sales reports. In short: try the product on real invoices before you commit.',
    keyTakeaways: [
      'Starter is free invoice software pricing for solo owners testing online invoicing.',
      'Growth GST billing software plans (coming soon) add email PDFs, payment tracking, and sales reports.',
      'GST billing works on invoices in the workspace — confirm rates with your CA.',
      'Industry and city pages help you map ReceiptFlow to your shop type and location.',
      'Sign up is the next step after comparing features and billing software pricing.',
    ],
    pros: [
      'Low-friction free start on Starter',
      'Transparent path from tools → features → signup',
      'GST and PDF invoicing included without a paid plan',
      'Works for many Indian retail and service niches',
    ],
    cons: [
      'Paid Growth packaging is still rolling out',
      'Not positioned as a full ERP or inventory system',
      'Advanced compliance filings remain with your CA / portals',
    ],
    comparisonHeading: 'ReceiptFlow pricing vs typical alternatives',
    comparisonIntro:
      'When someone asks “what is billing software pricing?” or “what does invoice software cost?”, compare free starters, mid-market tools, and enterprise suites.',
    comparisonColumns: { left: 'ReceiptFlow', right: 'Typical mid-market suite' },
    comparisonRows: [
      {
        criterion: 'Entry price',
        receiptflow: 'Free Starter to send first invoices',
        alternative: 'Often paid from month one',
      },
      {
        criterion: 'Target user',
        receiptflow: 'Small businesses and shop owners',
        alternative: 'Growing SMEs with finance teams',
      },
      {
        criterion: 'GST invoices',
        receiptflow: 'Supported in-product on free and Growth paths',
        alternative: 'Supported, sometimes as add-ons',
      },
      {
        criterion: 'Onboarding',
        receiptflow: 'Self-serve workspace setup',
        alternative: 'May require demos and implementation',
      },
    ],
    entities: [
      {
        name: 'Billing software pricing',
        description:
          'What it costs to use cloud billing software for invoices, customers, and payment tracking.',
      },
      {
        name: 'Invoice software pricing',
        description:
          'Plan cost for creating, downloading, and sending professional invoices.',
      },
      {
        name: 'GST billing software plans',
        description:
          'ReceiptFlow Starter and Growth plans for GST-ready invoicing workflows.',
      },
      {
        name: 'ReceiptFlow pricing',
        description:
          'Starter free plan and upcoming Growth plan for small-business billing software.',
      },
    ],
    extraFaqs: [
      {
        question: 'Is ReceiptFlow free forever on Starter?',
        answer:
          'Starter is free to begin with the features listed on this page. Growth features may be paid later — check this pricing page for the current billing software pricing.',
      },
    ],
  }
}

export function mergeFaqs(
  primary: SeoLandingFaq[],
  extra?: SeoLandingFaq[],
): SeoLandingFaq[] {
  if (!extra?.length) return primary
  const seen = new Set(primary.map((f) => f.question.toLowerCase()))
  return [
    ...primary,
    ...extra.filter((f) => !seen.has(f.question.toLowerCase())),
  ]
}

export function buildBlogAiSearch(article: BlogArticle): AiSearchBlock {
  const firstParagraph =
    article.sections
      .flatMap((section) => section.blocks)
      .find((block): block is { type: 'p'; text: string } => block.type === 'p')
      ?.text ?? article.description

  const sectionHeadings = article.sections.map((s) => s.heading)

  return {
    summary: `${article.title} — ${article.description} In short: ${firstParagraph} This ReceiptFlow guide covers ${sectionHeadings.slice(0, 3).join(', ')}${sectionHeadings.length > 3 ? ', and more' : ''}.`,
    keyTakeaways: [
      article.description,
      ...sectionHeadings.slice(0, 4).map(
        (heading) => `Section focus: ${heading}`,
      ),
      'Apply the steps in ReceiptFlow when you are ready to invoice customers with GST-ready PDFs.',
    ],
    pros: [
      'Written in plain language for small-business owners',
      'Ties billing concepts to ReceiptFlow workflows',
      `Tags include: ${article.tags.slice(0, 4).join(', ')}`,
      'Useful before you compare features and pricing',
    ],
    cons: [
      'Guides are educational — not personalized tax advice',
      'Local GST rates and place-of-supply rules still need your CA',
      'Screenshots and UI labels may change as the product ships updates',
    ],
    comparisonHeading: 'Reading this guide vs jumping straight into software',
    comparisonIntro:
      'People often ask whether they should learn invoicing concepts first or start a workspace immediately. Both paths work; this table shows the trade-off.',
    comparisonColumns: {
      left: 'Read this guide first',
      right: 'Start in ReceiptFlow now',
    },
    comparisonRows: [
      {
        criterion: 'Speed to first invoice',
        receiptflow: 'Slower — you learn vocabulary first',
        alternative: 'Faster — create a draft invoice today',
      },
      {
        criterion: 'Fewer mistakes',
        receiptflow: 'Higher — you know what GST fields mean',
        alternative: 'Depends on how carefully you fill forms',
      },
      {
        criterion: 'Best if you are',
        receiptflow: 'New to GST invoicing or online billing',
        alternative: 'Ready to send a real customer invoice',
      },
    ],
    entities: [
      {
        name: article.title,
        description: article.description,
      },
      {
        name: 'ReceiptFlow',
        description:
          'Billing software for small businesses used throughout this guide as the practical implementation path.',
      },
      ...article.tags.slice(0, 3).map((tag) => ({
        name: tag,
        description: `Topic tag related to ${article.title}.`,
      })),
    ],
    extraFaqs: [
      {
        question: `What is “${article.title}” about?`,
        answer: article.description,
      },
      {
        question: 'How does this article relate to ReceiptFlow?',
        answer:
          'ReceiptFlow is the billing product you can use after reading — create invoices, apply GST, email PDFs, and track payments in one workspace.',
      },
    ],
  }
}

export function buildLandingHomeAiSearch(): AiSearchBlock {
  return {
    summary:
      'ReceiptFlow is billing software for small businesses in India. It helps you create invoices, apply GST, email branded PDFs, manage customers, and track payment status without running a full ERP. In plain language: one workspace for day-to-day invoicing and collections.',
    keyTakeaways: [
      'ReceiptFlow targets shops, freelancers, and growing teams that need invoices — not enterprise accounting suites.',
      'Core jobs: GST-ready invoices, PDF email, customer records, and payment tracking.',
      'Free tools (invoice generator, GST calculator) are available before you sign up.',
      'Industry and city pages map the same product to grocery, medical, garment, and metro markets.',
      'Start free, then move to Growth features when email and reports matter more.',
    ],
    pros: [
      'Fast setup for small-business billing',
      'GST fields and branded PDF invoices in one flow',
      'Customer book reduces retyping',
      'SEO tools help you try before you buy',
    ],
    cons: [
      'Not a full inventory or payroll ERP',
      'Government portal filings stay with your CA',
      'Paid Growth packaging is still expanding',
    ],
    comparisonHeading: 'ReceiptFlow vs spreadsheets vs heavy ERPs',
    comparisonIntro:
      'When people ask “what is the best billing software for small businesses?”, compare lightweight cloud billing with spreadsheets and full enterprise suites.',
    comparisonColumns: {
      left: 'ReceiptFlow',
      right: 'Spreadsheets / enterprise ERPs',
    },
    comparisonRows: featureComparison('day-to-day invoicing'),
    entities: [
      {
        name: 'ReceiptFlow',
        description:
          'Multi-tenant invoice and billing software for small businesses.',
      },
      {
        name: 'GST billing',
        description:
          'Creating tax invoices with GST amounts and GSTIN details for Indian businesses.',
      },
      {
        name: 'Online invoicing',
        description:
          'Creating, sending, and tracking invoices from a browser-based workspace.',
      },
    ],
  }
}

export function buildHubAiSearch(
  kind: 'features' | 'industries' | 'locations' | 'tools',
): AiSearchBlock {
  const copy = {
    features: {
      summary:
        'This features hub lists ReceiptFlow billing capabilities — invoice software, GST billing, PDF and email invoices, dashboards, reports, payment tracking, and customer management — so you can open the page that matches your question.',
      topic: 'billing features',
    },
    industries: {
      summary:
        'This industries hub maps ReceiptFlow to shop types such as grocery, medical, garment, hardware, wholesale, electronics, and mobile stores. Each industry page explains how invoicing and GST fit that trade.',
      topic: 'industry billing',
    },
    locations: {
      summary:
        'This locations hub covers ReceiptFlow billing software for major Indian cities such as Hyderabad, Bangalore, Chennai, Mumbai, and Delhi. Each city page answers local search intent while pointing to the same cloud product.',
      topic: 'city billing software',
    },
    tools: {
      summary:
        'This tools hub lists free ReceiptFlow SEO tools: invoice generator, GST calculator, profit and margin calculators, QR generator, and receipt generator. Use them in the browser, then sign up when you need saved history.',
      topic: 'free billing tools',
    },
  }[kind]

  return {
    summary: copy.summary,
    keyTakeaways: [
      `Open a specific page from this hub to dig into ${copy.topic}.`,
      'Compare features and pricing before you create an account.',
      'Industry and location pages share the same ReceiptFlow workspace.',
      'Free tools are a low-risk way to try invoice and GST math.',
    ],
    pros: [
      'Clear navigation to deep feature / niche pages',
      'Consistent ReceiptFlow entity across hubs',
      'Natural path into pricing and signup',
    ],
    cons: [
      'Hub pages are indexes — details live on child pages',
      'Not a substitute for reading the feature you care about',
    ],
    comparisonHeading: `How to use this ${kind} hub`,
    comparisonIntro: `Use this comparison when deciding whether to browse the hub or jump straight into a ReceiptFlow account.`,
    comparisonColumns: { left: 'Browse this hub', right: 'Sign up now' },
    comparisonRows: [
      {
        criterion: 'Goal',
        receiptflow: `Learn which ${copy.topic} page answers your question`,
        alternative: 'Start invoicing with a live workspace',
      },
      {
        criterion: 'Time',
        receiptflow: 'A few minutes of reading',
        alternative: 'A few minutes of setup',
      },
    ],
    entities: [
      {
        name: `ReceiptFlow ${kind}`,
        description: copy.summary,
      },
      {
        name: 'ReceiptFlow',
        description:
          'Billing software for small businesses with invoices, GST, PDFs, and payment tracking.',
      },
    ],
  }
}
