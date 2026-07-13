import type { BlogArticle } from '@/content/blog/types'

/**
 * Blog articles. Content is structured for TOC generation (section headings).
 * Featured images live under /public/blog/.
 */
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'how-to-create-gst-invoice',
    title: 'How to Create a GST Invoice (Step-by-Step)',
    description:
      'Learn how to create a GST invoice with buyer details, tax lines, and a professional PDF your customers and CA can use.',
    categoryId: 'gst',
    tags: ['GST invoice', 'tax invoice', 'GSTIN', 'PDF invoice'],
    featuredImageStem: 'how-to-create-gst-invoice',
    featuredImageAlt: 'Illustration of a GST invoice with tax breakdown',
    publishedAt: '2026-06-02T00:00:00+00:00',
    updatedAt: '2026-07-10T00:00:00+00:00',
    readingTimeMinutes: 7,
    relatedSlugs: [
      'gst-vs-non-gst-invoices',
      'invoice-numbering-best-practices',
      'accounting-basics-for-invoice-software-users',
    ],
    sections: [
      {
        id: 'what-is-a-gst-invoice',
        heading: 'What is a GST invoice?',
        blocks: [
          {
            type: 'p',
            text: 'A GST invoice is a tax invoice that shows taxable value, GST rate, and tax amount so the buyer and seller keep matching records. For many B2B sales in India, this document is what accounts teams file — not a handwritten total.',
          },
          {
            type: 'callout',
            text: 'This guide focuses on creating a clear GST invoice in software like ReceiptFlow. Always confirm rate and place-of-supply rules with your CA for your industry.',
          },
        ],
      },
      {
        id: 'details-you-need',
        heading: 'Details you need before you start',
        blocks: [
          {
            type: 'ul',
            items: [
              'Your business name, address, and GSTIN',
              'Buyer name, billing address, and GSTIN (for B2B)',
              'Invoice date and a unique invoice number',
              'Line items with HSN/SAC description, quantity, and rate',
              'Applicable GST rate and whether tax is inclusive or exclusive',
            ],
          },
        ],
      },
      {
        id: 'step-by-step',
        heading: 'Step-by-step: create a GST invoice',
        blocks: [
          {
            type: 'ol',
            items: [
              'Open your invoicing workspace and choose Create invoice.',
              'Select or add the customer. Save their GSTIN on the customer profile so you do not retype it.',
              'Add line items with clear descriptions, quantities, and unit prices.',
              'Apply the correct GST rate so taxable value and tax amount calculate automatically.',
              'Review the total, discounts, and payment terms.',
              'Generate a branded PDF and email it to the buyer’s accounts address.',
              'Mark the invoice sent, then update status when payment arrives.',
            ],
          },
        ],
      },
      {
        id: 'common-mistakes',
        heading: 'Common GST invoice mistakes to avoid',
        blocks: [
          {
            type: 'ul',
            items: [
              'Reusing invoice numbers across financial years without a clear series',
              'Missing buyer GSTIN on B2B invoices',
              'Vague line descriptions that confuse the buyer’s CA',
              'Sending chat screenshots instead of a PDF tax invoice',
            ],
          },
        ],
      },
      {
        id: 'next-steps',
        heading: 'Next steps',
        blocks: [
          {
            type: 'p',
            text: 'Once GST invoices are consistent, focus on payment tracking and month-end exports so your CA spends less time reconstructing sales. Pair this habit with clear invoice numbering and professional email delivery.',
          },
        ],
      },
    ],
  },
  {
    slug: 'gst-vs-non-gst-invoices',
    title: 'GST vs Non-GST Invoices: When to Use Each',
    description:
      'Understand when a GST tax invoice is required versus a simple bill, and how to keep both types organized in one workspace.',
    categoryId: 'gst',
    tags: ['GST', 'tax invoice', 'billing', 'compliance'],
    featuredImageStem: 'gst-vs-non-gst-invoices',
    featuredImageAlt: 'Side-by-side comparison of GST and non-GST invoices',
    publishedAt: '2026-06-12T00:00:00+00:00',
    updatedAt: '2026-06-12T00:00:00+00:00',
    readingTimeMinutes: 6,
    relatedSlugs: [
      'how-to-create-gst-invoice',
      'accounting-basics-for-invoice-software-users',
      'billing-software-for-small-businesses-guide',
    ],
    sections: [
      {
        id: 'quick-difference',
        heading: 'The quick difference',
        blocks: [
          {
            type: 'p',
            text: 'A GST invoice includes tax fields and GSTIN details for taxable supplies. A non-GST bill may still be a legitimate commercial invoice for exempt sales or unregistered contexts — but mixing the two without labels creates confusion at month end.',
          },
        ],
      },
      {
        id: 'when-gst-invoice',
        heading: 'When you typically need a GST invoice',
        blocks: [
          {
            type: 'ul',
            items: [
              'Taxable B2B supplies where the buyer needs input tax credit documentation',
              'Registered businesses issuing tax invoices per their compliance process',
              'Situations where your CA expects GST breakup on every taxable sale',
            ],
          },
          {
            type: 'callout',
            text: 'Thresholds, composition schemes, and exemptions vary. Use this as an operational guide — not legal advice.',
          },
        ],
      },
      {
        id: 'keep-both-clean',
        heading: 'How to keep both invoice types clean',
        blocks: [
          {
            type: 'ol',
            items: [
              'Decide tax treatment before you create the bill — not after you email it.',
              'Store buyer GSTIN only when relevant so B2C bills stay simple.',
              'Use consistent series or tags so reports can separate taxable sales.',
              'Export or share PDFs that match what you told the customer verbally.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'billing-software-for-small-businesses-guide',
    title: 'Billing Software for Small Businesses: A Practical Guide',
    description:
      'What small businesses should look for in billing software — invoices, GST, customers, PDFs, and payment tracking without enterprise complexity.',
    categoryId: 'billing',
    tags: ['billing software', 'small business', 'invoicing', 'GST billing'],
    featuredImageStem: 'billing-software-guide',
    featuredImageAlt: 'Small business owner reviewing online billing software',
    publishedAt: '2026-05-20T00:00:00+00:00',
    updatedAt: '2026-07-01T00:00:00+00:00',
    readingTimeMinutes: 8,
    relatedSlugs: [
      'how-small-businesses-track-payments',
      'how-to-create-gst-invoice',
      'how-to-email-invoices-professionally',
    ],
    sections: [
      {
        id: 'why-billing-software',
        heading: 'Why billing software beats spreadsheets',
        blocks: [
          {
            type: 'p',
            text: 'Spreadsheets start fine, then break when two people edit totals, invoice numbers collide, or a customer asks for last quarter’s PDF. Billing software keeps customers, invoices, and payment status in one searchable place.',
          },
        ],
      },
      {
        id: 'must-have-features',
        heading: 'Must-have features for small teams',
        blocks: [
          {
            type: 'ul',
            items: [
              'Fast invoice creation with line items, discounts, and tax',
              'Customer directory with phone, email, and GSTIN',
              'Branded PDF download and email delivery',
              'Clear paid / unpaid status',
              'Basic sales reports for weekly decisions',
            ],
          },
        ],
      },
      {
        id: 'buying-checklist',
        heading: 'Buying checklist',
        blocks: [
          {
            type: 'ol',
            items: [
              'Can you brand invoices with your logo and color?',
              'Can more than one staff member work without sharing passwords insecurely?',
              'Can you find an old invoice in under a minute?',
              'Does export or PDF output satisfy your CA?',
            ],
          },
        ],
      },
      {
        id: 'getting-started',
        heading: 'Getting started this week',
        blocks: [
          {
            type: 'p',
            text: 'Set company details first, import your top 20 customers, and recreate one recent invoice as a PDF. If that workflow feels faster than your current method, commit to sending every new bill from the tool.',
          },
        ],
      },
    ],
  },
  {
    slug: 'invoice-numbering-best-practices',
    title: 'Invoice Numbering Best Practices for Growing Teams',
    description:
      'Choose an invoice numbering system that stays unique, audit-friendly, and easy for staff to follow as your volume grows.',
    categoryId: 'invoices',
    tags: ['invoice number', 'invoicing', 'best practices', 'audit'],
    featuredImageStem: 'invoice-numbering',
    featuredImageAlt: 'Sequential invoice numbers on organized documents',
    publishedAt: '2026-05-28T00:00:00+00:00',
    updatedAt: '2026-05-28T00:00:00+00:00',
    readingTimeMinutes: 5,
    relatedSlugs: [
      'how-to-create-gst-invoice',
      'how-to-email-invoices-professionally',
      'accounting-basics-for-invoice-software-users',
    ],
    sections: [
      {
        id: 'why-numbering-matters',
        heading: 'Why numbering matters',
        blocks: [
          {
            type: 'p',
            text: 'Invoice numbers are how customers, banks, and your CA refer to a sale. Gaps, duplicates, or random strings make disputes and audits harder than they need to be.',
          },
        ],
      },
      {
        id: 'simple-patterns',
        heading: 'Simple patterns that work',
        blocks: [
          {
            type: 'ul',
            items: [
              'Sequential numbers: INV-1001, INV-1002…',
              'Year-prefixed series: 2026-001, 2026-002…',
              'Branch-aware series only if you truly need separate books per outlet',
            ],
          },
          {
            type: 'callout',
            text: 'Pick one pattern and document it for staff. Changing mid-year without a note creates more problems than a “perfect” scheme.',
          },
        ],
      },
      {
        id: 'operational-tips',
        heading: 'Operational tips',
        blocks: [
          {
            type: 'ol',
            items: [
              'Let software assign the next number whenever possible.',
              'Never reuse a number — void and issue a new invoice instead.',
              'Keep draft invoices out of the official sequence until finalized if your process requires it.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'how-to-email-invoices-professionally',
    title: 'How to Email Invoices Professionally',
    description:
      'Write clearer invoice emails, attach the right PDF, and follow up on unpaid bills without sounding pushy.',
    categoryId: 'invoices',
    tags: ['email invoice', 'PDF', 'collections', 'customer communication'],
    featuredImageStem: 'email-invoices',
    featuredImageAlt: 'Professional invoice email with PDF attachment',
    publishedAt: '2026-06-18T00:00:00+00:00',
    updatedAt: '2026-06-18T00:00:00+00:00',
    readingTimeMinutes: 6,
    relatedSlugs: [
      'invoice-numbering-best-practices',
      'how-small-businesses-track-payments',
      'billing-software-for-small-businesses-guide',
    ],
    sections: [
      {
        id: 'subject-lines',
        heading: 'Subject lines that get opened',
        blocks: [
          {
            type: 'ul',
            items: [
              'Invoice INV-1042 from Acme Traders — due 20 Jul',
              'GST invoice for May services — PDF attached',
              'Payment request: Invoice INV-1042 (₹24,500)',
            ],
          },
        ],
      },
      {
        id: 'email-body',
        heading: 'What to include in the body',
        blocks: [
          {
            type: 'ol',
            items: [
              'Greeting and a one-line purpose (“Please find invoice INV-1042”).',
              'Amount due, due date, and preferred payment method.',
              'Mention that a PDF is attached for their records.',
              'A polite close with your phone number for questions.',
            ],
          },
        ],
      },
      {
        id: 'follow-ups',
        heading: 'Follow-ups without awkwardness',
        blocks: [
          {
            type: 'p',
            text: 'Reference the invoice number every time. Attach the same PDF again. Update status in your billing tool the day payment clears so the next reminder is never sent by mistake.',
          },
        ],
      },
    ],
  },
  {
    slug: 'how-small-businesses-track-payments',
    title: 'How Small Businesses Can Track Payments Better',
    description:
      'A practical payment-tracking routine for small businesses — link every payment to an invoice and reduce end-of-month surprises.',
    categoryId: 'small-business',
    tags: ['payments', 'cash flow', 'small business', 'collections'],
    featuredImageStem: 'track-payments',
    featuredImageAlt: 'Payment tracking checklist for small businesses',
    publishedAt: '2026-06-05T00:00:00+00:00',
    updatedAt: '2026-07-05T00:00:00+00:00',
    readingTimeMinutes: 6,
    relatedSlugs: [
      'billing-software-for-small-businesses-guide',
      'how-to-email-invoices-professionally',
      'accounting-basics-for-invoice-software-users',
    ],
    sections: [
      {
        id: 'the-core-habit',
        heading: 'The core habit: one status per invoice',
        blocks: [
          {
            type: 'p',
            text: 'Every invoice should be draft, sent, paid, or overdue — not “maybe paid on UPI last Tuesday.” When status lives next to the bill, cash flow conversations get shorter.',
          },
        ],
      },
      {
        id: 'weekly-routine',
        heading: 'A 20-minute weekly routine',
        blocks: [
          {
            type: 'ol',
            items: [
              'List unpaid invoices older than seven days.',
              'Send one polite reminder email with the PDF attached.',
              'Note payment mode when money arrives (UPI, NEFT, cash).',
              'Mark the invoice paid the same day — not at month end.',
            ],
          },
        ],
      },
      {
        id: 'tools-help',
        heading: 'Where tools help',
        blocks: [
          {
            type: 'p',
            text: 'Billing software will not chase customers for you, but it removes the scavenger hunt across chats and notebooks. Pair it with a fixed reminder day each week.',
          },
        ],
      },
    ],
  },
  {
    slug: 'accounting-basics-for-invoice-software-users',
    title: 'Accounting Basics for Invoice Software Users',
    description:
      'How invoicing connects to bookkeeping — what your CA needs from invoice software, and what you can safely handle yourself.',
    categoryId: 'accounting',
    tags: ['accounting', 'bookkeeping', 'CA', 'reports'],
    featuredImageStem: 'accounting-basics',
    featuredImageAlt: 'Invoice reports prepared for accounting review',
    publishedAt: '2026-06-22T00:00:00+00:00',
    updatedAt: '2026-06-22T00:00:00+00:00',
    readingTimeMinutes: 7,
    relatedSlugs: [
      'how-to-create-gst-invoice',
      'gst-vs-non-gst-invoices',
      'invoice-numbering-best-practices',
    ],
    sections: [
      {
        id: 'invoicing-vs-accounting',
        heading: 'Invoicing is not full accounting',
        blocks: [
          {
            type: 'p',
            text: 'Invoice software records sales documents and payment status. Accounting covers ledgers, expenses, payroll, and statutory returns. Knowing the boundary prevents buying the wrong tool — or expecting your CA to invent missing invoices.',
          },
        ],
      },
      {
        id: 'what-cas-want',
        heading: 'What most CAs want from you',
        blocks: [
          {
            type: 'ul',
            items: [
              'A complete set of tax invoices for the period',
              'Consistent numbering and dates',
              'Buyer GSTIN where applicable',
              'A sales summary that matches the PDFs',
            ],
          },
        ],
      },
      {
        id: 'month-end-checklist',
        heading: 'Month-end checklist for owners',
        blocks: [
          {
            type: 'ol',
            items: [
              'Close unpaid follow-ups or document why an invoice is still open.',
              'Export or share invoice PDFs for the month.',
              'Confirm totals against bank credits for large receipts.',
              'Send your CA a clean package instead of a zip of chat screenshots.',
            ],
          },
        ],
      },
    ],
  },
]
